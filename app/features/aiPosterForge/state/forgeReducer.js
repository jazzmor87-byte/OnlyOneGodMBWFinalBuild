import { FORGE_MODES } from '../constants/toolCatalog';

export const initialForgeState = Object.freeze({
  mode: FORGE_MODES[0].id,
  originalImageUri: null,
  workingImageUri: null,
  posterTemplateId: 'MBW_BLACK_GOLD_01',
  selectedToolId: null,
  commandText: '',
  commandActions: [],
  layers: [],
  masks: [],
  adjustments: {},
  history: [],
  historyIndex: -1,
  faceLock: true,
  bodyLock: true,
  posterWorldLocked: true,
  safeZoneStatus: 'PENDING',
  exportStatus: 'NOT_STARTED',
});

function pushHistory(state, event) {
  const clean = state.history.slice(0, state.historyIndex + 1);
  const history = [...clean, {
    at: Date.now(), event, mode: state.mode, selectedToolId: state.selectedToolId,
    adjustments: state.adjustments, layers: state.layers,
  }];
  return { history, historyIndex: history.length - 1 };
}

export function forgeReducer(state, action) {
  switch (action.type) {
    case 'SET_MODE': return { ...state, mode: action.mode };
    case 'SET_IMAGE': return { ...state, originalImageUri: state.originalImageUri || action.uri, workingImageUri: action.uri, ...pushHistory(state, 'SET_IMAGE') };
    case 'SELECT_TOOL': return { ...state, selectedToolId: action.toolId };
    case 'SET_ADJUSTMENT': {
      const next = { ...state, adjustments: { ...state.adjustments, [action.key]: action.value } };
      return { ...next, ...pushHistory(next, `ADJUST_${action.key}`) };
    }
    case 'ADD_LAYER': {
      const next = { ...state, layers: [...state.layers, action.layer] };
      return { ...next, ...pushHistory(next, 'ADD_LAYER') };
    }
    case 'SET_COMMAND': return { ...state, commandText: action.text };
    case 'SET_COMMAND_ACTIONS': return { ...state, commandActions: action.actions };
    case 'SET_SAFE_ZONE': return { ...state, safeZoneStatus: action.status };
    case 'SET_EXPORT_STATUS': return { ...state, exportStatus: action.status };
    case 'UNDO': return { ...state, historyIndex: Math.max(-1, state.historyIndex - 1) };
    case 'REDO': return { ...state, historyIndex: Math.min(state.history.length - 1, state.historyIndex + 1) };
    case 'RESET': return { ...initialForgeState };
    default: return state;
  }
}
