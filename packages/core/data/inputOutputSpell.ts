import { Spell } from './../types'
export default {
  id: '3e645657-ec88-43e7-9b4d-6c177219c8f2',
  name: 'modest bronze',
  graph: {
    id: 'demo@0.1.0',
    nodes: {
      '124': {
        id: 124,
        data: {
          name: 'default',
          socketKey: '20c0d2db-1916-433f-88c6-69d3ae123217',
          dataControls: { name: { expanded: true } },
          playtestToggle: { receivePlaytest: true },
        },
        inputs: {},
        outputs: {
          trigger: {
            connections: [{ node: 233, input: 'trigger', data: { pins: [] } }],
          },
        },
        position: [-1555.4724883179474, -132.7648214211178],
        name: 'Module Trigger In',
      },
      '232': {
        id: 232,
        data: {
          name: 'Input',
          text: 'Input text here',
          outputs: [],
          socketKey: '9d61118c-3c5a-4379-9dae-41965e56207f',
          dataControls: {
            name: { expanded: true },
            useDefault: { expanded: true },
            playtestToggle: { expanded: true },
          },
          defaultValue: 'Input text here',
          playtestToggle: { receivePlaytest: true },
        },
        inputs: {},
        outputs: {
          output: {
            connections: [{ node: 233, input: 'input', data: { pins: [] } }],
          },
        },
        position: [-1554.8394720686588, -362.87891510530955],
        name: 'Universal Input',
      },
      '233': {
        id: 233,
        data: {
          name: 'output-233',
          socketKey: '5fc83754-ddf3-43fc-a7e2-992c5009f853',
          dataControls: {
            name: { expanded: true },
            sendToPlaytest: { expanded: true },
          },
          sendToPlaytest: true,
        },
        inputs: {
          input: {
            connections: [{ node: 232, output: 'output', data: { pins: [] } }],
          },
          trigger: {
            connections: [{ node: 124, output: 'trigger', data: { pins: [] } }],
          },
        },
        outputs: { trigger: { connections: [] } },
        position: [-1134.1518031360474, -300.2158528655752],
        name: 'Output',
      },
    },
  },
  createdAt: '2022-06-08T03:41:18.512Z',
  updatedAt: '2022-06-08T03:41:18.512Z',
  deletedAt: null,
  userId: '2508068',
  modules: [],
  gameState: {},
} as unknown as Spell
