import React, {
  useCallback,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import AIProcessingCourt
  from './AIProcessingCourt';
import AIPortraitSampler
  from './AIPortraitSampler';
import AIStudioCanvas
  from './AIStudioCanvas';
import EditorInspector
  from './EditorInspector';
import EditorToolRail
  from './EditorToolRail';
import {
  PRESETS,
} from '../constants/fullEditorCatalog';
import {
  fullEditorReducer,
  initialFullEditorState,
} from '../state/fullEditorReducer';
import {
  appendAIProof,
} from '../runtime/aiDeviceProofLedger';
import {
  captureMeasuredEditor,
} from '../runtime/measuredExportRuntime';
import {
  capturePersonalImage,
  choosePersonalImage,
  exportToGallery,
  saveToMBWVault,
  transformImage,
} from '../runtime/photoStudioRuntime';

const RETOUCH_TOOLS =
  new Set([
    'Spot Heal',
    'Patch Tool',
    'Clone Stamp',
  ]);

const twoFrames = () =>
  new Promise(
    (resolve) =>
      requestAnimationFrame(
        () =>
          requestAnimationFrame(
            resolve
          )
      )
  );

export default function FullAIEditorWorkspace({
  navigation,
}) {
  const {
    width,
  } = useWindowDimensions();
  const [state, dispatch] =
    useReducer(
      fullEditorReducer,
      initialFullEditorState
    );
  const [busy, setBusy] =
    useState(false);
  const [aiPhase, setAIPhase] =
    useState('IDLE');
  const canvasRef =
    useRef(null);
  const tablet =
    width >= 700;

  const setImage =
    useCallback(
      async (result) => {
        if (
          result?.ok &&
          result.uri
        ) {
          dispatch({
            type: 'SET_IMAGE',
            uri: result.uri,
            width:
              result.width,
            height:
              result.height,
          });

          await appendAIProof(
            'IMAGE_READY',
            {
              width:
                result.width,
              height:
                result.height,
            }
          );
          return;
        }

        if (
          result?.code &&
          !String(
            result.code
          ).includes(
            'CANCELLED'
          )
        ) {
          Alert.alert(
            'MBW PHOTO STUDIO',
            result.code
          );
        }
      },
      []
    );

  const startAI =
    useCallback(
      async () => {
        if (!state.imageUri) {
          Alert.alert(
            'MBW PHOTO STUDIO',
            'SELECT A PICTURE FIRST'
          );
          return;
        }

        setBusy(true);
        setAIPhase(
          'REQUESTED'
        );
        dispatch({
          type: 'AI_START',
          uri:
            state.imageUri,
        });

        await appendAIProof(
          'AI_CUTOUT_REQUESTED',
          {
            imageMeta:
              state.imageMeta,
          }
        );
      },
      [
        state.imageMeta,
        state.imageUri,
      ]
    );

  const onAISuccess =
    useCallback(
      async (result) => {
        dispatch({
          type: 'AI_SUCCESS',
          maskImage:
            result.maskImage,
          maskMeta:
            result.maskMeta,
        });
        setAIPhase(
          'READY'
        );
        setBusy(false);

        await appendAIProof(
          'AI_CUTOUT_READY',
          result.maskMeta
        );
      },
      []
    );

  const onAIError =
    useCallback(
      async (message) => {
        dispatch({
          type: 'AI_FAIL',
          message,
        });
        setAIPhase(
          'ERROR'
        );
        setBusy(false);

        await appendAIProof(
          'AI_CUTOUT_ERROR',
          {
            message,
          }
        );

        Alert.alert(
          'MBW AI CUTOUT',
          message
        );
      },
      []
    );

  const adjust = (
    key,
    delta,
    minimum,
    maximum
  ) => {
    const current =
      Number(
        state.adjustments[
          key
        ]
      );

    dispatch({
      type:
        'SET_ADJUSTMENTS',
      value: {
        [key]:
          Math.max(
            minimum,
            Math.min(
              maximum,
              current + delta
            )
          ),
      },
    });
  };

  const move = (
    key,
    delta,
    minimum,
    maximum
  ) => {
    const current =
      Number(
        state.transform[
          key
        ]
      );

    dispatch({
      type:
        'SET_TRANSFORM',
      value: {
        [key]:
          Math.max(
            minimum,
            Math.min(
              maximum,
              current + delta
            )
          ),
      },
    });
  };

  const executeAction =
    async (action) => {
      if (busy) {
        return;
      }

      try {
        if (
          action ===
          'Choose Image'
        ) {
          setBusy(true);
          await setImage(
            await choosePersonalImage()
          );
          return;
        }

        if (
          action ===
          'Camera Capture'
        ) {
          setBusy(true);
          await setImage(
            await capturePersonalImage()
          );
          return;
        }

        if (
          action ===
          'AI Portrait Cutout'
        ) {
          await startAI();
          return;
        }

        if (
          action ===
          'Clear AI Cutout'
        ) {
          dispatch({
            type: 'CLEAR_AI',
          });
          return;
        }

        if (
          action ===
          'Refine Edge +'
        ) {
          dispatch({
            type:
              'SET_MANUAL_MASK_MODE',
            mode: 'ADD',
          });
          return;
        }

        if (
          action ===
          'Refine Edge -'
        ) {
          dispatch({
            type:
              'SET_MANUAL_MASK_MODE',
            mode: 'SUBTRACT',
          });
          return;
        }

        if (!state.imageUri) {
          Alert.alert(
            'MBW PHOTO STUDIO',
            'SELECT A PICTURE FIRST'
          );
          return;
        }

        const imageActions = {
          'Rotate Left': [
            {
              rotate: -90,
            },
          ],
          'Rotate Right': [
            {
              rotate: 90,
            },
          ],
          'Flip Horizontal': [
            {
              flip:
                'horizontal',
            },
          ],
          'Flip Vertical': [
            {
              flip:
                'vertical',
            },
          ],
        };

        if (
          imageActions[action]
        ) {
          setBusy(true);
          await setImage(
            await transformImage(
              state.imageUri,
              imageActions[action]
            )
          );
          return;
        }

        const transformActions = {
          'Scale +': [
            'scale',
            0.05,
            0.25,
            3,
          ],
          'Scale -': [
            'scale',
            -0.05,
            0.25,
            3,
          ],
          'Move Up': [
            'translateY',
            -12,
            -500,
            500,
          ],
          'Move Down': [
            'translateY',
            12,
            -500,
            500,
          ],
          'Move Left': [
            'translateX',
            -12,
            -500,
            500,
          ],
          'Move Right': [
            'translateX',
            12,
            -500,
            500,
          ],
        };

        if (
          transformActions[action]
        ) {
          move(
            ...transformActions[
              action
            ]
          );
          return;
        }

        if (
          action ===
          'Reset Transform'
        ) {
          dispatch({
            type:
              'SET_TRANSFORM',
            value:
              initialFullEditorState
                .transform,
          });
          return;
        }

        const toneActions = {
          'Brightness +': [
            'brightness',
            0.04,
            -1,
            1,
          ],
          'Brightness -': [
            'brightness',
            -0.04,
            -1,
            1,
          ],
          'Contrast +': [
            'contrast',
            0.05,
            0,
            3,
          ],
          'Contrast -': [
            'contrast',
            -0.05,
            0,
            3,
          ],
          'Saturation +': [
            'saturation',
            0.05,
            0,
            3,
          ],
          'Saturation -': [
            'saturation',
            -0.05,
            0,
            3,
          ],
          'Warmth +': [
            'warmth',
            0.04,
            -1,
            1,
          ],
          'Warmth -': [
            'warmth',
            -0.04,
            -1,
            1,
          ],
          'Blur +': [
            'blur',
            1,
            0,
            30,
          ],
          'Blur -': [
            'blur',
            -1,
            0,
            30,
          ],
        };

        if (
          toneActions[action]
        ) {
          adjust(
            ...toneActions[action]
          );
          return;
        }

        const presetMap = {
          'Black Gold':
            PRESETS.BLACK_GOLD,
          'Deep Maroon':
            PRESETS.DEEP_MAROON,
          'Royal Amber':
            PRESETS.ROYAL_AMBER,
          'Dark Velvet':
            PRESETS.DARK_VELVET,
          'Original Tone':
            PRESETS.ORIGINAL,
        };

        if (
          presetMap[action]
        ) {
          dispatch({
            type:
              'SET_ADJUSTMENTS',
            value:
              presetMap[action],
          });
          return;
        }

        if (
          action ===
          'Hair Edge Refine'
        ) {
          dispatch({
            type:
              'SET_MANUAL_MASK_MODE',
            mode: 'ADD',
          });
          return;
        }

        if (
          RETOUCH_TOOLS.has(
            action
          )
        ) {
          dispatch({
            type:
              'SET_RETOUCH_TOOL',
            tool: action,
          });
          return;
        }

        if (
          action ===
          'Retouch Off'
        ) {
          dispatch({
            type:
              'SET_RETOUCH_TOOL',
            tool: null,
          });
          return;
        }

        if (
          action ===
          'Manual Mask On'
        ) {
          dispatch({
            type:
              'SET_MANUAL_MASK',
            enabled: true,
          });
          return;
        }

        if (
          action ===
          'Manual Mask Off'
        ) {
          dispatch({
            type:
              'SET_MANUAL_MASK',
            enabled: false,
          });
          return;
        }

        if (
          action ===
          'AI Mask On'
        ) {
          dispatch({
            type:
              'SET_AI_MASK',
            enabled: true,
          });
          return;
        }

        if (
          action ===
          'AI Mask Off'
        ) {
          dispatch({
            type:
              'SET_AI_MASK',
            enabled: false,
          });
          return;
        }

        const layerMap = {
          'Subject Layer':
            'subject',
          'Background Layer':
            'background',
          'Effects Layer':
            'effects',
          'Shadow Layer':
            'shadow',
        };

        if (
          layerMap[action]
        ) {
          dispatch({
            type:
              'TOGGLE_LAYER',
            layer:
              layerMap[action],
          });
          return;
        }

        if (action === 'Undo') {
          dispatch({
            type: 'UNDO',
          });
          return;
        }

        if (action === 'Redo') {
          dispatch({
            type: 'REDO',
          });
          return;
        }

        if (
          action ===
          'Reset Edit'
        ) {
          dispatch({
            type: 'RESET_EDIT',
          });
          return;
        }

        if (
          action ===
          'Save Version'
        ) {
          dispatch({
            type:
              'SAVE_VERSION',
          });
          Alert.alert(
            'MBW VERSION VAULT',
            'VERSION SAVED'
          );
          return;
        }

        if (
          action ===
          'Restore Latest'
        ) {
          dispatch({
            type:
              'RESTORE_LATEST',
          });
          return;
        }

        if (
          action ===
            'Save Gallery' ||
          action ===
            'Save MBW Vault'
        ) {
          setBusy(true);
          dispatch({
            type:
              'SET_EXPORTING',
            value: true,
          });

          await twoFrames();

          const captured =
            await captureMeasuredEditor(
              canvasRef
            );
          const result =
            action ===
            'Save Gallery'
              ? await exportToGallery(
                  captured.uri
                )
              : await saveToMBWVault(
                  captured.uri
                );

          await appendAIProof(
            'EDITOR_EXPORT',
            {
              action,
              ok: result.ok,
              width:
                captured.width,
              height:
                captured.height,
            }
          );

          Alert.alert(
            action ===
              'Save Gallery'
              ? 'MBW EXPORT FORGE'
              : 'MBW PROJECT VAULT',
            result.ok
              ? 'EXPORT COMPLETE'
              : result.code
          );
        }
      } catch (error) {
        Alert.alert(
          'MBW PHOTO STUDIO',
          String(
            error?.message ||
            error
          )
        );
      } finally {
        dispatch({
          type:
            'SET_EXPORTING',
          value: false,
        });

        if (
          action !==
          'AI Portrait Cutout'
        ) {
          setBusy(false);
        }
      }
    };

  return (
    <SafeAreaView
      style={styles.root}
    >
      <AIPortraitSampler
        uri={state.aiInputUri}
        requestId={
          state.aiRequestId
        }
        active={
          state.aiStatus ===
          'PROCESSING'
        }
        onStatus={
          setAIPhase
        }
        onSuccess={
          onAISuccess
        }
        onError={
          onAIError
        }
      />

      <AIProcessingCourt
        visible={
          state.aiStatus ===
          'PROCESSING'
        }
        message={aiPhase}
      />

      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return"
          onPress={() => {
            if (
              navigation
                ?.canGoBack?.()
            ) {
              navigation.goBack();
            } else {
              navigation
                ?.navigate?.(
                  'MainHub'
                );
            }
          }}
          style={
            styles.topButton
          }
        >
          <Text
            style={styles.topIcon}
          >
            ←
          </Text>
        </Pressable>

        <View
          style={styles.titleWrap}
        >
          <Text
            style={styles.title}
          >
            MBW AI PHOTO STUDIO
          </Text>
          <Text
            style={styles.subtitle}
          >
            MEASURED GOLDEN CANVAS
          </Text>
        </View>

        <Pressable
          style={[
            styles.aiBadge,
            state.aiStatus ===
              'READY' &&
              styles.aiBadgeReady,
            state.aiStatus ===
              'ERROR' &&
              styles.aiBadgeError,
          ]}
        
          accessibilityRole="button"
          accessibilityLabel="Group 2 device proof"
          delayLongPress={1200}
          onLongPress={() => navigation?.navigate?.('AIStudioDeviceProof')}
        >
          <Text
            style={
              styles.aiBadgeText
            }
          >
            {state.aiStatus ===
            'PROCESSING'
              ? '…'
              : state.aiStatus ===
                'READY'
              ? '✓'
              : state.aiStatus ===
                'ERROR'
              ? '!'
              : 'AI'}
          </Text>
        </Pressable>
      </View>

      <View
        style={[
          styles.workspace,
          tablet &&
            styles.workspaceTablet,
        ]}
      >
        <View
          style={styles.canvasArea}
        >
          <AIStudioCanvas
            ref={canvasRef}
            uri={state.imageUri}
            aiMaskImage={
              state.aiMaskImage
            }
            aiMaskEnabled={
              state.aiMaskEnabled
            }
            adjustments={
              state.adjustments
            }
            transform={
              state.transform
            }
            backgroundColor={
              state.backgroundColor
            }
            layers={
              state.layers
            }
            manualMaskEnabled={
              state.manualMaskEnabled
            }
            manualMaskMode={
              state.manualMaskMode
            }
            manualMaskBrushSize={
              state.manualMaskBrushSize
            }
            manualMaskPaths={
              state.manualMaskPaths
            }
            activeRetouchTool={
              state.activeRetouchTool
            }
            retouchOperations={
              state.retouchOperations
            }
            showEditorOverlays={
              !state.exporting
            }
            onMaskCommit={(
              path
            ) =>
              dispatch({
                type:
                  'ADD_MANUAL_MASK_PATH',
                path,
              })
            }
            onRetouchOperation={(
              operation
            ) =>
              dispatch({
                type:
                  'ADD_RETOUCH',
                operation,
              })
            }
          />

          {!state.imageUri ? (
            <View
              pointerEvents="none"
              style={
                styles.emptyState
              }
            >
              <Text
                style={
                  styles.emptyIcon
                }
              >
                🖼️
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <EditorToolRail
        mode={state.mode}
        onSelect={(mode) =>
          dispatch({
            type: 'SET_MODE',
            mode,
          })
        }
      />

      <EditorInspector
        mode={state.mode}
        activeAction={
          state.activeRetouchTool
        }
        disabled={busy}
        onAction={executeAction}
      />
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor:
        '#050303',
    },
    topBar: {
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor:
        'rgba(214,167,58,0.20)',
      backgroundColor:
        'rgba(5,3,3,0.98)',
    },
    topButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent:
        'center',
      borderWidth: 1,
      borderColor:
        'rgba(214,167,58,0.30)',
    },
    topIcon: {
      color: '#F0D47F',
      fontSize: 22,
    },
    titleWrap: {
      flex: 1,
      alignItems: 'center',
    },
    title: {
      color: '#F0D47F',
      fontSize: 15,
      fontWeight: '900',
      letterSpacing: 0.7,
    },
    subtitle: {
      marginTop: 2,
      color:
        'rgba(248,244,234,0.48)',
      fontSize: 8,
      letterSpacing: 1.2,
    },
    aiBadge: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent:
        'center',
      backgroundColor:
        'rgba(75,13,22,0.84)',
      borderWidth: 1,
      borderColor:
        '#D6A73A',
    },
    aiBadgeReady: {
      backgroundColor:
        'rgba(35,120,65,0.70)',
    },
    aiBadgeError: {
      backgroundColor:
        'rgba(150,35,35,0.72)',
    },
    aiBadgeText: {
      color: '#F0D47F',
      fontSize: 12,
      fontWeight: '900',
    },
    workspace: {
      flex: 1,
      padding: 10,
    },
    workspaceTablet: {
      paddingHorizontal: 28,
    },
    canvasArea: {
      flex: 1,
      alignItems: 'center',
      justifyContent:
        'center',
    },
    emptyState: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent:
        'center',
    },
    emptyIcon: {
      fontSize: 44,
    },
  });
