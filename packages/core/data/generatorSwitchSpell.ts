import { Spell } from '../types'

export default {
  id: '3b7add2b-0f49-4c6b-8db9-18ecbb34602c',
  name: 'wee silver',
  chain: {
    id: 'demo@0.1.0',
    nodes: {
      '124': {
        id: 124,
        data: {
          name: 'default',
          error: false,
          socketKey: '20c0d2db-1916-433f-88c6-69d3ae123217',
          nodeLocked: true,
          dataControls: {
            name: { expanded: true },
            playtestToggle: { expanded: true },
          },
          playtestToggle: { receivePlaytest: true },
          success: false,
        },
        inputs: {},
        outputs: {
          trigger: {
            connections: [{ node: 755, input: 'trigger', data: { pins: [] } }],
          },
        },
        position: [-1556.5668566017482, -114.13292905935491],
        name: 'Module Trigger In',
      },
      '233': {
        id: 233,
        data: {
          name: 'output',
          error: false,
          display: 'nope',
          socketKey: 'ba6ed95b-3aac-49e9-91ae-a33f5510c83b',
          nodeLocked: true,
          dataControls: {
            name: { expanded: true },
            sendToPlaytest: { expanded: true },
          },
          sendToPlaytest: true,
          success: false,
        },
        inputs: {
          input: {
            connections: [
              { node: 756, output: 'result', data: { pins: [] } },
              { node: 757, output: 'nope', data: { pins: [] } },
            ],
          },
          trigger: {
            connections: [
              { node: 756, output: 'trigger', data: { pins: [] } },
              { node: 757, output: 'trigger', data: { pins: [] } },
            ],
          },
        },
        outputs: { trigger: { connections: [] } },
        position: [-355.34246696789677, -379.7943353508476],
        name: 'Output',
      },
      '646': {
        id: 646,
        data: {
          name: 'input',
          text: 'no',
          socketKey: '3a9cfde5-32a0-4e96-9de7-7571a7a4e784',
          nodeLocked: true,
          dataControls: {
            name: { expanded: true },
            useDefault: { expanded: true },
            playtestToggle: { expanded: true },
          },
          playtestToggle: { receivePlaytest: true },
          display: 'no',
          success: false,
        },
        inputs: {},
        outputs: {
          output: {
            connections: [{ node: 755, input: 'input', data: { pins: [] } }],
          },
        },
        position: [-1555.1553378286703, -376.7788066492969],
        name: 'Universal Input',
      },
      '755': {
        id: 755,
        data: {
          dataControls: { outputs: { expanded: true } },
          outputs: [
            {
              name: 'yes',
              taskType: 'option',
              socketKey: 'yes',
              connectionType: 'output',
              socketType: 'triggerSocket',
            },
            {
              name: 'no',
              taskType: 'option',
              socketKey: 'no',
              connectionType: 'output',
              socketType: 'triggerSocket',
            },
          ],
          success: false,
        },
        inputs: {
          input: {
            connections: [{ node: 646, output: 'output', data: { pins: [] } }],
          },
          trigger: {
            connections: [{ node: 124, output: 'trigger', data: { pins: [] } }],
          },
        },
        outputs: {
          default: { connections: [] },
          yes: {
            connections: [{ node: 756, input: 'trigger', data: { pins: [] } }],
          },
          no: {
            connections: [{ node: 757, input: 'trigger', data: { pins: [] } }],
          },
        },
        position: [-1176.2411766908515, -306.22492046552907],
        name: 'Switch',
      },
      '756': {
        id: 756,
        data: {
          stop: '\\n',
          temp: 0.7,
          maxTokens: 50,
          error: false,
          dataControls: {
            name: { expanded: true },
            model: { expanded: true },
            inputs: { expanded: true },
            fewshot: { expanded: true },
            stop: { expanded: true },
            temp: { expanded: true },
            maxTokens: { expanded: true },
            frequencyPenalty: { expanded: true },
          },
          fewshot: 'Generate',
          display:
            's a printable report for a given period.\nGenerated report will have following sections.\nTotal number of accounts, Class A, Class B, Class C, Class D, Class E.\nTotal number of accounts with',
          success: false,
        },
        inputs: {
          trigger: {
            connections: [{ node: 755, output: 'yes', data: { pins: [] } }],
          },
        },
        outputs: {
          trigger: {
            connections: [{ node: 233, input: 'trigger', data: { pins: [] } }],
          },
          result: {
            connections: [{ node: 233, input: 'input', data: { pins: [] } }],
          },
          composed: { connections: [] },
        },
        position: [-756.0054171828833, -686.5866282949149],
        name: 'Generator',
      },
      '757': {
        id: 757,
        data: {
          code: "\n// inputs: dictionary of inputs based on socket names\n// data: internal data of the node to read or write to nodes data state\n// state: access to the current game state in the state manager window. Return state to update the state.\nfunction worker(inputs, data, state) {\n\n  // Keys of the object returned must match the names \n  // of your outputs you defined.\n  // To update the state, you must return the modified state.\n  return {nope: 'nope'}\n}\n",
          dataControls: {
            name: { expanded: true },
            inputs: { expanded: true },
            outputs: { expanded: true },
            code: { expanded: true },
          },
          outputs: [
            {
              name: 'nope',
              taskType: 'output',
              socketKey: 'nope',
              connectionType: 'output',
              socketType: 'anySocket',
            },
          ],
          display: '{"nope":"nope"}',
          success: false,
        },
        inputs: {
          trigger: {
            connections: [{ node: 755, output: 'no', data: { pins: [] } }],
          },
        },
        outputs: {
          trigger: {
            connections: [{ node: 233, input: 'trigger', data: { pins: [] } }],
          },
          nope: {
            connections: [{ node: 233, input: 'input', data: { pins: [] } }],
          },
        },
        position: [-763.6582824038765, -158.00935186007678],
        name: 'Code',
      },
    },
  },
  createdAt: '2022-05-25T22:31:10.259Z',
  updatedAt: '2022-05-25T22:36:33.629Z',
  deletedAt: null,
  userId: '2508068',
  modules: [],
  gameState: {
    introText:
      'This is a simple AI generator app. Type anything and let the AI continue ',
  },
} as unknown as Spell
