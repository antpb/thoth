import { createSelector } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { rootApi } from './api'
import { GraphData, Spell } from '@thothai/thoth-core/types'
// function camelize(str) {
//   return str
//     .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
//       return index === 0 ? word.toLowerCase() : word.toUpperCase()
//     })
//     .replace(/\s+/g, '')
// }
export interface Diff {
  name: string
  diff: Record<string, unknown>
}

export interface DeployedSpellVersion {
  spellId: string
  message?: string
  url?: string
  graph?: GraphData
}

export interface DeployArgs {
  spellId: string
  message: string
}

export interface GetDeployArgs {
  spellId: string
}

export interface PatchArgs {
  spellId: string
  update: Partial<Spell>
}

export interface RunSpell {
  spellId: string
  inputs: Record<string, any>
  state?: Record<string, any>
}

export interface UserSpellArgs {
  spellId: string
}

export const spellApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getSpells: builder.query<Spell[], string>({
      providesTags: ['Spells'],
      query: () => ({
        url: `spells`,
      }),
    }),
    getSpell: builder.query<Spell, UserSpellArgs>({
      providesTags: ['Spell'],
      query: ({ spellId }) => {
        return {
          url: `spells/${spellId}`,
          params: { },
        }
      },
    }),
    runSpell: builder.mutation<Record<string, any>, RunSpell>({
      query: ({ spellId, inputs, state = {} }) => ({
        url: `spells/${spellId}`,
        method: 'POST',
        body: {
          ...inputs,
          state,
        },
      }),
    }),
    saveDiff: builder.mutation<void, Diff>({
      invalidatesTags: ['Spell'],
      query: diffData => ({
        url: 'spells/saveDiff',
        method: 'POST',
        body: diffData,
      }),
    }),
    spellExists: builder.mutation<boolean, string>({
      query: name => ({
        url: 'spells/exists',
        method: 'POST',
        body: {
          name,
        },
      }),
    }),
    saveSpell: builder.mutation<Partial<Spell>, Partial<Spell> | Spell>({
      invalidatesTags: ['Spell'],
      // needed to use queryFn as query option didnt seem to allow async functions.
      async queryFn({ user, ...spell }, { dispatch }, extraOptions, baseQuery) {
        const baseQueryOptions = {
          url: 'spells/save',
          body: spell,
          method: 'POST',
        }

        // cast into proper response shape expected by queryFn return
        // probbably a way to directly pass in type args to baseQuery but couldnt find.
        return baseQuery(baseQueryOptions) as QueryReturnValue<
          Partial<Spell>,
          FetchBaseQueryError,
          unknown
        >
      },
    }),
    newSpell: builder.mutation<Spell, Partial<Spell>>({
      invalidatesTags: ['Spells'],
      query: spellData => ({
        url: 'spells',
        method: 'POST',
        body: spellData,
      }),
    }),
    patchSpell: builder.mutation<Spell, PatchArgs>({
      invalidatesTags: ['Spell'],
      query({ spellId, update }) {
        return {
          url: `spells/${spellId}`,
          body: {
            ...update,
          },
          method: 'PATCH',
        }
      },
    }),
    deleteSpell: builder.mutation<string[], UserSpellArgs>({
      invalidatesTags: ['Spells'],
      query: ({ spellId }) => ({
        url: `spells/${spellId}`,
        method: 'DELETE',
      }),
    }),
    deploySpell: builder.mutation<DeployedSpellVersion, DeployArgs>({
      query({ spellId, ...update }) {
        return {
          url: `spells/${spellId}/deploy`,
          body: update,
          method: 'POST',
        }
      },
    }),
  }),
})

const selectSpellResults = spellApi.endpoints.getSpells.select('')
const emptySpells = []

export const selectAllSpells = createSelector(
  selectSpellResults,
  spellResult => spellResult?.data || emptySpells
)

export const {
  useGetSpellQuery,
  useGetSpellsQuery,
  useSpellExistsMutation,
  useLazyGetSpellQuery,
  useNewSpellMutation,
  useDeleteSpellMutation,
  useRunSpellMutation,
  useSaveSpellMutation,
  useSaveDiffMutation,
  useDeploySpellMutation,
  usePatchSpellMutation,
} = spellApi

export const useGetSpellSubscription =
  spellApi.endpoints.getSpell.useLazyQuerySubscription
