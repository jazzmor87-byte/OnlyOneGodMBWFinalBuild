export const initialFullEditorState = {
  mode: 'IMPORT',
  imageUri: null,
  imageMeta: {
    width: 0,
    height: 0,
  },
  aiInputUri: null,
  aiMaskImage: null,
  aiMaskMeta: null,
  aiMaskEnabled: true,
  aiRequestId: 0,
  aiStatus: 'IDLE',
  aiMessage: '',
  manualMaskEnabled: false,
  manualMaskMode: 'ADD',
  manualMaskBrushSize: 34,
  manualMaskPaths: [],
  activeRetouchTool: null,
  retouchOperations: [],
  adjustments: {
    brightness: 0,
    contrast: 1,
    saturation: 1,
    warmth: 0,
    blur: 0,
  },
  transform: {
    scale: 1,
    rotation: 0,
    translateX: 0,
    translateY: 0,
    flipX: 1,
    flipY: 1,
  },
  backgroundColor: '#050303',
  layers: {
    background: true,
    subject: true,
    shadow: true,
    retouch: true,
    effects: true,
  },
  history: [],
  future: [],
  vault: [],
  exporting: false,
};

function snapshot(state) {
  return {
    imageUri:
      state.imageUri,
    imageMeta:
      state.imageMeta,
    aiMaskEnabled:
      state.aiMaskEnabled,
    aiMaskMeta:
      state.aiMaskMeta,
    manualMaskEnabled:
      state.manualMaskEnabled,
    manualMaskMode:
      state.manualMaskMode,
    manualMaskBrushSize:
      state.manualMaskBrushSize,
    manualMaskPaths:
      state.manualMaskPaths,
    activeRetouchTool:
      state.activeRetouchTool,
    retouchOperations:
      state.retouchOperations,
    adjustments:
      state.adjustments,
    transform:
      state.transform,
    backgroundColor:
      state.backgroundColor,
    layers:
      state.layers,
  };
}

function withHistory(
  state,
  changes
) {
  return {
    ...state,
    ...changes,
    history: [
      ...state.history,
      snapshot(state),
    ].slice(-50),
    future: [],
  };
}

export function fullEditorReducer(
  state,
  action
) {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
      };

    case 'SET_IMAGE':
      return withHistory(state, {
        imageUri: action.uri,
        imageMeta: {
          width:
            Number(
              action.width || 0
            ),
          height:
            Number(
              action.height || 0
            ),
        },
        aiInputUri: null,
        aiMaskImage: null,
        aiMaskMeta: null,
        aiStatus: 'IDLE',
        aiMessage: '',
        manualMaskPaths: [],
        retouchOperations: [],
      });

    case 'AI_START':
      return {
        ...state,
        aiInputUri:
          action.uri,
        aiRequestId:
          state.aiRequestId + 1,
        aiStatus: 'PROCESSING',
        aiMessage:
          'AI PORTRAIT MATTING',
      };

    case 'AI_SUCCESS':
      return withHistory(state, {
        aiMaskImage:
          action.maskImage,
        aiMaskMeta:
          action.maskMeta,
        aiMaskEnabled: true,
        aiStatus: 'READY',
        aiMessage:
          'AI CUTOUT READY',
      });

    case 'AI_FAIL':
      return {
        ...state,
        aiStatus: 'ERROR',
        aiMessage:
          action.message,
      };

    case 'AI_CANCEL':
      return {
        ...state,
        aiStatus: 'CANCELLED',
        aiMessage:
          'AI REQUEST CANCELLED',
      };

    case 'CLEAR_AI':
      return withHistory(state, {
        aiInputUri: null,
        aiMaskImage: null,
        aiMaskMeta: null,
        aiMaskEnabled: false,
        aiStatus: 'IDLE',
        aiMessage: '',
      });

    case 'SET_ADJUSTMENTS':
      return withHistory(state, {
        adjustments: {
          ...state.adjustments,
          ...action.value,
        },
      });

    case 'SET_TRANSFORM':
      return withHistory(state, {
        transform: {
          ...state.transform,
          ...action.value,
        },
      });

    case 'SET_BACKGROUND':
      return withHistory(state, {
        backgroundColor:
          action.color,
      });

    case 'TOGGLE_LAYER':
      return withHistory(state, {
        layers: {
          ...state.layers,
          [action.layer]:
            !state.layers[
              action.layer
            ],
        },
      });

    case 'SET_MANUAL_MASK':
      return {
        ...state,
        manualMaskEnabled:
          Boolean(
            action.enabled
          ),
      };

    case 'SET_MANUAL_MASK_MODE':
      return {
        ...state,
        manualMaskEnabled: true,
        manualMaskMode:
          action.mode,
      };

    case 'SET_MANUAL_MASK_BRUSH':
      return {
        ...state,
        manualMaskBrushSize:
          Math.max(
            4,
            Math.min(
              160,
              Number(
                action.size || 34
              )
            )
          ),
      };

    case 'ADD_MANUAL_MASK_PATH':
      return withHistory(state, {
        manualMaskPaths: [
          ...state.manualMaskPaths,
          action.path,
        ].slice(-200),
      });

    case 'CLEAR_MANUAL_MASK':
      return withHistory(state, {
        manualMaskPaths: [],
      });

    case 'SET_AI_MASK':
      return {
        ...state,
        aiMaskEnabled:
          Boolean(
            action.enabled
          ),
      };

    case 'SET_RETOUCH_TOOL':
      return {
        ...state,
        activeRetouchTool:
          action.tool,
      };

    case 'ADD_RETOUCH':
      return withHistory(state, {
        retouchOperations: [
          ...state.retouchOperations,
          action.operation,
        ].slice(-200),
      });

    case 'UNDO': {
      if (!state.history.length) {
        return state;
      }

      const previous =
        state.history[
          state.history.length - 1
        ];

      return {
        ...state,
        ...previous,
        history:
          state.history.slice(
            0,
            -1
          ),
        future: [
          snapshot(state),
          ...state.future,
        ].slice(0, 50),
      };
    }

    case 'REDO': {
      if (!state.future.length) {
        return state;
      }

      const next =
        state.future[0];

      return {
        ...state,
        ...next,
        history: [
          ...state.history,
          snapshot(state),
        ].slice(-50),
        future:
          state.future.slice(1),
      };
    }

    case 'SAVE_VERSION':
      return {
        ...state,
        vault: [
          ...state.vault,
          {
            id:
              `VERSION_${Date.now()}`,
            savedAt:
              new Date()
                .toISOString(),
            snapshot:
              snapshot(state),
          },
        ].slice(-25),
      };

    case 'RESTORE_LATEST': {
      const latest =
        state.vault[
          state.vault.length - 1
        ];

      return latest
        ? withHistory(
            state,
            latest.snapshot
          )
        : state;
    }

    case 'SET_EXPORTING':
      return {
        ...state,
        exporting:
          Boolean(
            action.value
          ),
      };

    case 'RESET_EDIT':
      return withHistory(state, {
        aiInputUri: null,
        aiMaskImage: null,
        aiMaskMeta: null,
        aiMaskEnabled: true,
        aiStatus: 'IDLE',
        aiMessage: '',
        manualMaskEnabled: false,
        manualMaskMode: 'ADD',
        manualMaskPaths: [],
        activeRetouchTool: null,
        retouchOperations: [],
        adjustments:
          initialFullEditorState
            .adjustments,
        transform:
          initialFullEditorState
            .transform,
        backgroundColor:
          initialFullEditorState
            .backgroundColor,
        layers:
          initialFullEditorState
            .layers,
      });

    default:
      return state;
  }
}
