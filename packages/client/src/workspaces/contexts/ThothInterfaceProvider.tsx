import axios from 'axios'
import { createContext, useContext, useEffect, useRef } from 'react'

import { useGetSpellQuery, useRunSpellMutation } from '@/state/api/spells'
import {
  CreateEventArgs,
  EditorContext,
  Spell,
  ThothWorkerInputs,
} from '@thothai/thoth-core/types'

import { usePubSub } from '../../contexts/PubSubProvider'
import { thothApiRootUrl } from '@/config'

const Context = createContext<EditorContext>(undefined!)

export const useThothInterface = () => useContext(Context)

const ThothInterfaceProvider = ({ children, tab }) => {
  const { events, publish, subscribe } = usePubSub()
  const spellRef = useRef<Spell | null>(null)
  const [_runSpell] = useRunSpellMutation()
  const { data: _spell } = useGetSpellQuery(
    {
      spellId: tab.spellId,
    },
    {
      skip: !tab.spellId,
    }
  )

  useEffect(() => {
    if (!_spell) return
    spellRef.current = _spell
  }, [_spell])

  const {
    $PLAYTEST_INPUT,
    $PLAYTEST_PRINT,
    $INSPECTOR_SET,
    $DEBUG_PRINT,
    $DEBUG_INPUT,
    $TEXT_EDITOR_CLEAR,
    $SAVE_SPELL_DIFF,
    $NODE_SET,
    ADD_SUBSPELL,
    UPDATE_SUBSPELL,
    $SUBSPELL_UPDATED,
    $PROCESS,
    $TRIGGER,
    $REFRESH_EVENT_TABLE,
    $SEND_TO_AVATAR,
  } = events

  const onTrigger = (node, callback) => {
    let isDefault = node === 'default' ? 'default' : null
    return subscribe($TRIGGER(tab.id, isDefault ?? node.id), (event, data) => {
      publish($PROCESS(tab.id))
      // weird hack.  This staggers the process slightly to allow the published event to finish before the callback runs.
      // No super elegant, but we need a better more centralised way to run the engine than these callbacks.
      setTimeout(() => callback(data), 0)
    })
  }

  const refreshEventTable = () => {
    return publish($REFRESH_EVENT_TABLE(tab.id))
  }

  const onInspector = (node, callback) => {
    return subscribe($NODE_SET(tab.id, node.id), (event, data) => {
      callback(data)
    })
  }

  const onAddModule = callback => {
    return subscribe(ADD_SUBSPELL, (event, data) => {
      callback(data)
    })
  }

  const onUpdateModule = callback => {
    return subscribe(UPDATE_SUBSPELL, (event, data) => {
      callback(data)
    })
  }

  const onSubspellUpdated = (spellId: string, callback: Function) => {
    return subscribe($SUBSPELL_UPDATED(spellId), (event, data) => {
      callback(data)
    })
  }

  const onDeleteModule = callback => {
    return subscribe(UPDATE_SUBSPELL, (event, data) => {
      callback(data)
    })
  }

  const sendToInspector = data => {
    publish($INSPECTOR_SET(tab.id), data)
  }

  const sendToDebug = data => {
    publish($DEBUG_PRINT(tab.id), data)
  }

  const onDebug = (node, callback) => {
    return subscribe($DEBUG_INPUT(tab.id, node.id), (event, data) => {
      callback(data)
    })
  }

  const sendToPlaytest = data => {
    publish($PLAYTEST_PRINT(tab.id), data)
  }

  const sendToAvatar = data => {
    publish($SEND_TO_AVATAR(tab.id), data)
  }

  const onPlaytest = callback => {
    return subscribe($PLAYTEST_INPUT(tab.id), (event, data) => {
      publish($PROCESS(tab.id))
      // weird hack.  This staggers the process slightly to allow the published event to finish before the callback runs.
      // No super elegant, but we need a better more centralised way to run the engine than these callbacks.
      setTimeout(() => callback(data), 0)
    })
  }

  const processCode = (code, inputs, data, state) => {
    const flattenedInputs = Object.entries(inputs as ThothWorkerInputs).reduce(
      (acc, [key, value]) => {
        // @ts-ignore
        acc[key as string] = value[0] as any
        return acc
      },
      {} as Record<string, any>
    )
    // eslint-disable-next-line no-new-func
    const result = new Function('"use strict";return (' + code + ')')()(
      flattenedInputs,
      data,
      state
    )
    if (result.state) {
      updateCurrentGameState(result.state)
    }
    return result
  }

  const runSpell = async (inputs, spellId, state) => {
    const response = await _runSpell({ inputs, spellId, state })

    if ('error' in response) {
      throw new Error(`Error running spell ${spellId}`)
    }

    return response.data.outputs
  }

  const clearTextEditor = () => {
    publish($TEXT_EDITOR_CLEAR(tab.id))
  }

  const getCurrentGameState = () => {
    if (!spellRef.current) return {}

    return spellRef.current?.gameState ?? {}
  }

  const setCurrentGameState = newState => {
    if (!spellRef.current) return

    const update = {
      gameState: newState,
    }
    // publish($SAVE_SPELL_DIFF(tab.id), update)
  }

  const updateCurrentGameState = _update => {
    if (!spellRef.current) return
    const spell = spellRef.current

    // lets delete out all undefined properties coming in
    Object.keys(_update).forEach(
      key => _update[key] === undefined && delete _update[key]
    )

    const update = {
      gameState: {
        ...spell.gameState,
        ..._update,
      },
    }

    // Temporarily update the spell refs game state to account for multiple state writes in a spell run
    spellRef.current = {
      ...spell,
      ...update,
    }
    // publish($SAVE_SPELL_DIFF(tab.id), update)
  }

  const getEvent = async ({
    type,
    agent,
    speaker,
    client,
    channel,
    maxCount = 10,
    target_count = 'single',
    max_time_diff = -1,
  }) => {
    const urlString = `${
      process.env.REACT_APP_API_ROOT_URL ??
      process.env.API_ROOT_URL ??
      'https://localhost:8001'
    }/event`

    const params = {
      type: type,
      agent: agent,
      speaker: speaker,
      client: client,
      channel: channel,
      maxCount: maxCount,
      target_count,
      max_time_diff,
    } as Record<string, any>

    const url = new URL(urlString)
    for (let p in params) {
      url.searchParams.append(p, params[p])
    }

    const response = await fetch(url.toString())
    if (response.status !== 200) return null
    const json = await response.json()
    return json.event
  }

  const storeEvent = async ({
    type,
    agent,
    speaker,
    text,
    client,
    channel,
  }: CreateEventArgs) => {
    const response = await axios.post(
      `${
        process.env.REACT_APP_API_ROOT_URL ??
        process.env.API_ROOT_URL ??
        'https://localhost:8001'
      }/event`,
      {
        type,
        agent,
        speaker,
        text,
        client,
        channel,
      }
    )
    console.log('Created event', response.data)
    return response.data
  }

  const getWikipediaSummary = async (keyword: string) => {
    const isProd = process.env.NODE_ENV === 'production'
    const root = isProd
      ? 'https://thoth.supereality.com'
      : 'https://localhost:8001'
    const url = `${root}/wikipediaSummary?keyword=${keyword}`

    console.log('FETCHOING FROM URL', url)

    const response = await fetch(url)

    return await response.json()
  }

  const queryGoogle = async (query: string) => {
    const url = `${thothApiRootUrl}/query_google`
    const response = await axios.post(url, {
      query,
    })

    return await response.data.result
  }

  const publicInterface = {
    onTrigger,
    onInspector,
    onAddModule,
    onUpdateModule,
    onDeleteModule,
    onSubspellUpdated,
    sendToInspector,
    sendToDebug,
    onDebug,
    sendToPlaytest,
    onPlaytest,
    clearTextEditor,
    getCurrentGameState,
    setCurrentGameState,
    updateCurrentGameState,
    processCode,
    runSpell,
    refreshEventTable,
    getEvent,
    storeEvent,
    getWikipediaSummary,
    queryGoogle,
    sendToAvatar,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default ThothInterfaceProvider
