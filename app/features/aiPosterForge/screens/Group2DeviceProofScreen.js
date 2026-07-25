import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Image as RNImage,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  AlphaType,
  ColorType,
  Skia,
  useImage,
} from '@shopify/react-native-skia';
import * as FileSystem
  from 'expo-file-system/legacy';
import MbwRuntimeProof
  from '../../../../modules/mbw-runtime-proof/src/index';
import AIStudioCanvas
  from '../components/AIStudioCanvas';
import {
  createPortraitRequestToken,
  runPortraitMatting,
} from '../runtime/aiPortraitMattingEngine';
import {
  appendAIProof,
} from '../runtime/aiDeviceProofLedger';
import {
  captureMeasuredEditor,
} from '../runtime/measuredExportRuntime';
import {
  choosePersonalImage,
  exportToGallery,
} from '../runtime/photoStudioRuntime';
import {
  initialFullEditorState,
} from '../state/fullEditorReducer';

const MAX_INFERENCE_MS = 45000;
const MAX_PEAK_PSS_DELTA_KB = 524288;
const MAX_RESIDUAL_PSS_DELTA_KB = 196608;

const pause = (
  milliseconds
) =>
  new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        milliseconds
      )
  );

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

function alphaToImage(
  alpha,
  width,
  height
) {
  const rgba =
    new Uint8Array(
      width *
      height *
      4
    );

  for (
    let index = 0;
    index < alpha.length;
    index += 1
  ) {
    const value =
      Math.round(
        Math.max(
          0,
          Math.min(
            1,
            alpha[index]
          )
        ) * 255
      );
    const offset =
      index * 4;

    rgba[offset] = value;
    rgba[
      offset + 1
    ] = value;
    rgba[
      offset + 2
    ] = value;
    rgba[
      offset + 3
    ] = 255;
  }

  return Skia.Image.MakeImage(
    {
      width,
      height,
      alphaType:
        AlphaType.Unpremul,
      colorType:
        ColorType.RGBA_8888,
    },
    Skia.Data.fromBytes(
      rgba
    ),
    width * 4
  );
}

function getImageSize(
  uri
) {
  return new Promise(
    (resolve, reject) => {
      RNImage.getSize(
        uri,
        (
          width,
          height
        ) =>
          resolve({
            width,
            height,
          }),
        reject
      );
    }
  );
}

function delta(
  after,
  before,
  key
) {
  return (
    Number(
      after?.[key] || 0
    ) -
    Number(
      before?.[key] || 0
    )
  );
}

export default function Group2DeviceProofScreen({
  navigation,
}) {
  const [source, setSource] =
    useState(null);
  const [maskImage, setMaskImage] =
    useState(null);
  const [maskMeta, setMaskMeta] =
    useState(null);
  const [runtimeProof, setRuntimeProof] =
    useState(null);
  const [exportProof, setExportProof] =
    useState(null);
  const [visualCertified, setVisualCertified] =
    useState(false);
  const [busy, setBusy] =
    useState(false);
  const [status, setStatus] =
    useState('SELECT A TEST PORTRAIT');
  const canvasRef =
    useRef(null);
  const sourceImage =
    useImage(
      source?.uri || null
    );

  const overallPass =
    Boolean(
      runtimeProof?.pass &&
      exportProof?.pass &&
      visualCertified
    );

  const summary =
    useMemo(
      () => ({
        status,
        source: source
          ? {
              width:
                source.width,
              height:
                source.height,
            }
          : null,
        runtimeProof,
        maskMeta,
        exportProof,
        visualCertified,
        overallPass,
        thresholds: {
          maxInferenceMs:
            MAX_INFERENCE_MS,
          maxPeakPssDeltaKb:
            MAX_PEAK_PSS_DELTA_KB,
          maxResidualPssDeltaKb:
            MAX_RESIDUAL_PSS_DELTA_KB,
        },
      }),
      [
        exportProof,
        maskMeta,
        overallPass,
        runtimeProof,
        source,
        status,
        visualCertified,
      ]
    );

  const choose = useCallback(
    async () => {
      setBusy(true);

      try {
        const result =
          await choosePersonalImage();

        if (
          result?.ok &&
          result.uri
        ) {
          setSource(result);
          setMaskImage(null);
          setMaskMeta(null);
          setRuntimeProof(null);
          setExportProof(null);
          setVisualCertified(false);
          setStatus(
            'PORTRAIT READY'
          );
        }
      } finally {
        setBusy(false);
      }
    },
    []
  );

  const runInference = useCallback(
    async () => {
      if (
        !sourceImage ||
        !source?.uri
      ) {
        Alert.alert(
          'GROUP 2 DEVICE COURT',
          'SELECT AND LOAD A PORTRAIT FIRST'
        );
        return;
      }

      setBusy(true);
      setVisualCertified(false);
      setStatus(
        'RUNNING NATIVE ONNX'
      );

      try {
        const capabilities =
          MbwRuntimeProof
            .getRuntimeCapabilities();
        const before =
          MbwRuntimeProof
            .getMemorySnapshot();
        const info =
          sourceImage.getImageInfo();
        const pixels =
          sourceImage.readPixels(
            0,
            0,
            info
          );

        if (!pixels) {
          throw new Error(
            'SKIA_PIXEL_READ_FAILED'
          );
        }

        const token =
          createPortraitRequestToken(
            Date.now()
          );
        const started =
          performance.now();
        const result =
          await runPortraitMatting({
            pixels,
            width:
              info.width,
            height:
              info.height,
            token,
            timeoutMs:
              MAX_INFERENCE_MS,
          });
        const elapsedMs =
          performance.now() -
          started;
        const peak =
          MbwRuntimeProof
            .getMemorySnapshot();
        const image =
          alphaToImage(
            result.alpha,
            result.width,
            result.height
          );

        if (!image) {
          throw new Error(
            'MASK_IMAGE_CREATION_FAILED'
          );
        }

        setMaskImage(image);
        setMaskMeta({
          width:
            result.width,
          height:
            result.height,
          preprocessing:
            result.preprocessing,
          inputName:
            result.inputName,
          outputNames:
            result.outputNames,
          engineElapsedMs:
            result.elapsedMs,
        });

        MbwRuntimeProof
          .requestProofGc();
        await pause(1600);

        const settled =
          MbwRuntimeProof
            .getMemorySnapshot();
        const peakDeltaKb =
          delta(
            peak,
            before,
            'totalPssKb'
          );
        const residualDeltaKb =
          delta(
            settled,
            before,
            'totalPssKb'
          );
        const inferencePass =
          elapsedMs <=
          MAX_INFERENCE_MS;
        const peakMemoryPass =
          peakDeltaKb <=
          MAX_PEAK_PSS_DELTA_KB;
        const residualMemoryPass =
          residualDeltaKb <=
          MAX_RESIDUAL_PSS_DELTA_KB;
        const pass =
          inferencePass &&
          peakMemoryPass &&
          residualMemoryPass;

        const proof = {
          pass,
          inferencePass,
          peakMemoryPass,
          residualMemoryPass,
          elapsedMs:
            Math.round(
              elapsedMs
            ),
          before,
          peak,
          settled,
          peakPssDeltaKb:
            peakDeltaKb,
          residualPssDeltaKb:
            residualDeltaKb,
          capabilities,
          hardNativeCancellation:
            false,
          cancellationMode:
            'COOPERATIVE_CALLBACK_SUPPRESSION_AND_SESSION_RELEASE',
        };

        setRuntimeProof(
          proof
        );
        setStatus(
          pass
            ? 'NATIVE AI PASS'
            : 'NATIVE AI LIMIT FAILED'
        );

        await appendAIProof(
          'GROUP2_NATIVE_RUNTIME_PROOF',
          {
            ...proof,
            mask: {
              width:
                result.width,
              height:
                result.height,
              preprocessing:
                result.preprocessing,
            },
          }
        );
      } catch (error) {
        const message =
          String(
            error?.message ||
            error
          );

        setRuntimeProof({
          pass: false,
          error: message,
        });
        setStatus(
          'NATIVE AI ERROR'
        );

        await appendAIProof(
          'GROUP2_NATIVE_RUNTIME_ERROR',
          {
            message,
          }
        );

        Alert.alert(
          'GROUP 2 DEVICE COURT',
          message
        );
      } finally {
        setBusy(false);
      }
    },
    [
      source,
      sourceImage,
    ]
  );

  const verifyExport = useCallback(
    async () => {
      if (
        !maskImage ||
        !runtimeProof?.pass
      ) {
        Alert.alert(
          'GROUP 2 EXPORT COURT',
          'PASS NATIVE AI FIRST'
        );
        return;
      }

      setBusy(true);
      setStatus(
        'VERIFYING 1080 × 1600 EXPORT'
      );

      try {
        await twoFrames();

        const captured =
          await captureMeasuredEditor(
            canvasRef
          );
        const dimensions =
          await getImageSize(
            captured.uri
          );
        const info =
          await FileSystem
            .getInfoAsync(
              captured.uri,
              {
                size: true,
              }
            );
        const dimensionPass =
          dimensions.width ===
            1080 &&
          dimensions.height ===
            1600;
        const filePass =
          Boolean(
            info.exists &&
            Number(
              info.size || 0
            ) > 0
          );
        const pass =
          dimensionPass &&
          filePass;
        const gallery =
          await exportToGallery(
            captured.uri
          );
        const proof = {
          pass:
            pass &&
            gallery.ok,
          dimensionPass,
          filePass,
          galleryPass:
            gallery.ok,
          width:
            dimensions.width,
          height:
            dimensions.height,
          fileSize:
            Number(
              info.size || 0
            ),
          uri:
            captured.uri,
        };

        setExportProof(
          proof
        );
        setStatus(
          proof.pass
            ? 'EXPORT PASS'
            : 'EXPORT FAILED'
        );

        await appendAIProof(
          'GROUP2_EXPORT_PROOF',
          proof
        );
      } catch (error) {
        const message =
          String(
            error?.message ||
            error
          );

        setExportProof({
          pass: false,
          error: message,
        });
        setStatus(
          'EXPORT ERROR'
        );

        await appendAIProof(
          'GROUP2_EXPORT_ERROR',
          {
            message,
          }
        );

        Alert.alert(
          'GROUP 2 EXPORT COURT',
          message
        );
      } finally {
        setBusy(false);
      }
    },
    [
      maskImage,
      runtimeProof,
    ]
  );

  const certifyVisual = useCallback(
    async () => {
      if (
        !runtimeProof?.pass ||
        !exportProof?.pass
      ) {
        Alert.alert(
          'GROUP 2 VISUAL COURT',
          'RUNTIME AND EXPORT MUST PASS FIRST'
        );
        return;
      }

      setVisualCertified(true);
      setStatus(
        'LIVE VISUAL CERTIFIED'
      );

      await appendAIProof(
        'GROUP2_MANUAL_VISUAL_CERTIFICATION',
        {
          certified: true,
          criteria: [
            'SUBJECT AND MASK ALIGNED',
            'SHADOW ATTACHED TO SUBJECT',
            'NO STRETCH OR SQUARE DISTORTION',
            'MAIN FACE AND BODY SAFE',
            'EXPORT MATCHES PREVIEW',
          ],
        }
      );
    },
    [
      exportProof,
      runtimeProof,
    ]
  );

  return (
    <SafeAreaView
      style={styles.root}
    >
      <View
        style={styles.header}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return"
          onPress={() =>
            navigation?.goBack?.()
          }
          style={styles.iconButton}
        >
          <Text
            style={styles.icon}
          >
            ←
          </Text>
        </Pressable>

        <View style={styles.titleWrap}>
          <Text style={styles.title}>
            GROUP 2 DEVICE COURT
          </Text>
          <Text style={styles.subtitle}>
            {status}
          </Text>
        </View>

        <View
          style={[
            styles.statusOrb,
            overallPass &&
              styles.statusOrbPass,
          ]}
        >
          <Text
            style={styles.statusText}
          >
            {overallPass
              ? '✓'
              : busy
              ? '…'
              : '2'}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.canvasWrap}>
          <AIStudioCanvas
            ref={canvasRef}
            uri={source?.uri}
            aiMaskImage={
              maskImage
            }
            aiMaskEnabled={
              Boolean(maskImage)
            }
            adjustments={
              initialFullEditorState
                .adjustments
            }
            transform={
              initialFullEditorState
                .transform
            }
            backgroundColor="#050303"
            layers={
              initialFullEditorState
                .layers
            }
            manualMaskEnabled={false}
            manualMaskMode="ADD"
            manualMaskBrushSize={34}
            manualMaskPaths={[]}
            activeRetouchTool={null}
            retouchOperations={[]}
            showEditorOverlays={false}
            onMaskCommit={() => null}
            onRetouchOperation={() => null}
          />
        </View>

        <View
          style={styles.actionRow}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose proof portrait"
            disabled={busy}
            onPress={choose}
            style={styles.action}
          >
            <Text style={styles.actionText}>
              🖼️
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Run native AI proof"
            disabled={
              busy ||
              !sourceImage
            }
            onPress={
              runInference
            }
            style={styles.action}
          >
            <Text style={styles.actionText}>
              🧠
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Verify measured export"
            disabled={
              busy ||
              !runtimeProof?.pass
            }
            onPress={
              verifyExport
            }
            style={styles.action}
          >
            <Text style={styles.actionText}>
              📐
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Certify visual alignment"
            disabled={
              busy ||
              !exportProof?.pass
            }
            onPress={
              certifyVisual
            }
            style={styles.action}
          >
            <Text style={styles.actionText}>
              👁️
            </Text>
          </Pressable>
        </View>

        <Text
          selectable
          style={styles.proofText}
        >
          {JSON.stringify(
            summary,
            null,
            2
          )}
        </Text>
      </ScrollView>
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
    header: {
      minHeight: 62,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor:
        'rgba(214,167,58,0.24)',
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor:
        'rgba(214,167,58,0.38)',
    },
    icon: {
      color: '#F0D47F',
      fontSize: 22,
    },
    titleWrap: {
      flex: 1,
      alignItems: 'center',
    },
    title: {
      color: '#F0D47F',
      fontSize: 14,
      fontWeight: '900',
      letterSpacing: 0.8,
    },
    subtitle: {
      marginTop: 3,
      color:
        'rgba(248,244,234,0.52)',
      fontSize: 9,
      letterSpacing: 0.7,
    },
    statusOrb: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        'rgba(75,13,22,0.88)',
      borderWidth: 1,
      borderColor: '#D6A73A',
    },
    statusOrbPass: {
      backgroundColor:
        'rgba(32,120,62,0.84)',
    },
    statusText: {
      color: '#F0D47F',
      fontWeight: '900',
    },
    content: {
      padding: 12,
      paddingBottom: 44,
    },
    canvasWrap: {
      width: '100%',
      maxWidth: 620,
      alignSelf: 'center',
    },
    actionRow: {
      marginTop: 14,
      flexDirection: 'row',
      justifyContent:
        'space-around',
    },
    action: {
      width: 54,
      height: 54,
      borderRadius: 27,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor:
        'rgba(214,167,58,0.42)',
      backgroundColor:
        'rgba(75,13,22,0.45)',
    },
    actionText: {
      fontSize: 22,
    },
    proofText: {
      marginTop: 16,
      padding: 12,
      borderRadius: 14,
      color:
        'rgba(248,244,234,0.82)',
      backgroundColor:
        'rgba(20,8,11,0.92)',
      fontSize: 10,
      lineHeight: 15,
    },
  });
