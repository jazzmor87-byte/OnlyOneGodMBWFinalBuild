import React, {
  forwardRef,
  useMemo,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Blur,
  Canvas,
  ColorMatrix,
  Fill,
  Group,
  Image,
  Mask,
  Path,
  Rect,
  Skia,
  useImage,
} from '@shopify/react-native-skia';
import ManualMaskCanvas
  from './ManualMaskCanvas';
import RetouchGestureLayer
  from './RetouchGestureLayer';
import RetouchOverlayCanvas
  from './RetouchOverlayCanvas';
import {
  createEditorGeometry,
  EDITOR_HEIGHT,
  EDITOR_WIDTH,
  subjectTransformList,
} from '../geometry/editorGeometry';

function adjustmentMatrix({
  brightness = 0,
  contrast = 1,
  saturation = 1,
  warmth = 0,
}) {
  const inverse =
    1 - saturation;
  const red =
    0.213 * inverse;
  const green =
    0.715 * inverse;
  const blue =
    0.072 * inverse;
  const translate =
    (1 - contrast) *
      0.5 +
    brightness;

  return [
    contrast *
      (red + saturation),
    contrast * green,
    contrast * blue,
    0,
    translate +
      warmth * 0.08,

    contrast * red,
    contrast *
      (green + saturation),
    contrast * blue,
    0,
    translate,

    contrast * red,
    contrast * green,
    contrast *
      (blue + saturation),
    0,
    translate -
      warmth * 0.08,

    0,
    0,
    0,
    1,
    0,
  ];
}

function manualPath(
  path
) {
  const skPath =
    Skia.Path.MakeFromSVGString(
      path.svg || ''
    );

  if (!skPath) {
    return null;
  }

  return (
    <Path
      key={path.id}
      path={skPath}
      style="stroke"
      strokeWidth={
        path.brushSize
      }
      strokeCap="round"
      strokeJoin="round"
      color={
        path.mode ===
        'SUBTRACT'
          ? 'black'
          : 'white'
      }
    />
  );
}

function SubjectMask({
  maskImage,
  maskEnabled,
  manualMaskPaths,
}) {
  return (
    <Group>
      <Rect
        x={0}
        y={0}
        width={EDITOR_WIDTH}
        height={EDITOR_HEIGHT}
        color={
          maskEnabled &&
          maskImage
            ? 'black'
            : 'white'
        }
      />

      {maskEnabled &&
      maskImage ? (
        <Image
          image={maskImage}
          x={0}
          y={0}
          width={EDITOR_WIDTH}
          height={EDITOR_HEIGHT}
          fit="contain"
        />
      ) : null}

      {manualMaskPaths.map(
        manualPath
      )}
    </Group>
  );
}

function SubjectImage({
  image,
  adjustments,
}) {
  return (
    <Image
      image={image}
      x={0}
      y={0}
      width={EDITOR_WIDTH}
      height={EDITOR_HEIGHT}
      fit="contain"
    >
      <Blur
        blur={
          adjustments.blur
        }
        mode="clamp"
      />
      <ColorMatrix
        matrix={
          adjustmentMatrix(
            adjustments
          )
        }
      />
    </Image>
  );
}

function ShadowImage({
  image,
}) {
  return (
    <Image
      image={image}
      x={0}
      y={0}
      width={EDITOR_WIDTH}
      height={EDITOR_HEIGHT}
      fit="contain"
    >
      <Blur
        blur={28}
        mode="clamp"
      />
      <ColorMatrix
        matrix={[
          0,0,0,0,0,
          0,0,0,0,0,
          0,0,0,0,0,
          0,0,0,0.52,0,
        ]}
      />
    </Image>
  );
}

const AIStudioCanvas =
  forwardRef(
    function AIStudioCanvas(
      {
        uri,
        aiMaskImage,
        aiMaskEnabled,
        adjustments,
        transform,
        backgroundColor,
        layers,
        manualMaskEnabled,
        manualMaskMode,
        manualMaskBrushSize,
        manualMaskPaths,
        activeRetouchTool,
        retouchOperations,
        showEditorOverlays,
        onMaskCommit,
        onRetouchOperation,
      },
      ref
    ) {
      const image =
        useImage(uri || null);
      const [layout, setLayout] =
        useState({
          width: 1,
          height: 1,
        });
      const geometry =
        useMemo(
          () =>
            createEditorGeometry(
              layout
            ),
          [
            layout.width,
            layout.height,
          ]
        );
      const subjectTransform =
        subjectTransformList(
          transform
        );
      const mask = (
        <SubjectMask
          maskImage={
            aiMaskImage
          }
          maskEnabled={
            aiMaskEnabled
          }
          manualMaskPaths={
            manualMaskPaths
          }
        />
      );

      return (
        <View
          ref={ref}
          collapsable={false}
          style={styles.capture}
          onLayout={(event) => {
            const {
              width,
              height,
            } =
              event.nativeEvent
                .layout;

            setLayout({
              width,
              height,
            });
          }}
        >
          <Canvas
            style={styles.canvas}
          >
            <Fill
              color={
                layers.background
                  ? backgroundColor
                  : 'transparent'
              }
            />

            {image &&
            layers.shadow ? (
              <Group
                transform={[
                  {
                    scaleX:
                      geometry
                        .scaleX,
                  },
                  {
                    scaleY:
                      geometry
                        .scaleY,
                  },
                ]}
              >
                <Group
                  origin={{
                    x:
                      EDITOR_WIDTH /
                      2,
                    y:
                      EDITOR_HEIGHT /
                      2,
                  }}
                  transform={[
                    ...subjectTransform,
                    {
                      translateY:
                        86,
                    },
                  ]}
                >
                  <Mask
                    mode="luminance"
                    mask={mask}
                  >
                    <ShadowImage
                      image={image}
                    />
                  </Mask>
                </Group>
              </Group>
            ) : null}

            {image &&
            layers.subject ? (
              <Group
                transform={[
                  {
                    scaleX:
                      geometry
                        .scaleX,
                  },
                  {
                    scaleY:
                      geometry
                        .scaleY,
                  },
                ]}
              >
                <Group
                  origin={{
                    x:
                      EDITOR_WIDTH /
                      2,
                    y:
                      EDITOR_HEIGHT /
                      2,
                  }}
                  transform={
                    subjectTransform
                  }
                >
                  <Mask
                    mode="luminance"
                    mask={mask}
                  >
                    <SubjectImage
                      image={image}
                      adjustments={
                        adjustments
                      }
                    />
                  </Mask>
                </Group>
              </Group>
            ) : null}

            {layers.effects ? (
              <Group
                opacity={0.08}
              >
                <Fill
                  color="#4B0D16"
                />
              </Group>
            ) : null}
          </Canvas>

          {layers.retouch ? (
            <View
              pointerEvents="none"
              style={
                StyleSheet
                  .absoluteFill
              }
            >
              <RetouchOverlayCanvas
                uri={uri}
                geometry={
                  geometry
                }
                transform={
                  transform
                }
                maskImage={
                  aiMaskImage
                }
                maskEnabled={
                  aiMaskEnabled
                }
                manualMaskPaths={
                  manualMaskPaths
                }
                operations={
                  retouchOperations
                }
                visible={true}
              />
            </View>
          ) : null}

          <ManualMaskCanvas
            geometry={
              geometry
            }
            transform={
              transform
            }
            brushSize={
              manualMaskBrushSize
            }
            mode={
              manualMaskMode
            }
            paths={
              manualMaskPaths
            }
            visible={
              Boolean(
                manualMaskEnabled &&
                showEditorOverlays
              )
            }
            onCommit={
              onMaskCommit
            }
          />

          <RetouchGestureLayer
            activeTool={
              activeRetouchTool
            }
            geometry={
              geometry
            }
            transform={
              transform
            }
            visible={
              showEditorOverlays
            }
            onOperation={
              onRetouchOperation
            }
          />
        </View>
      );
    }
  );

export default AIStudioCanvas;

const styles =
  StyleSheet.create({
    capture: {
      width: '100%',
      aspectRatio:
        EDITOR_WIDTH /
        EDITOR_HEIGHT,
      overflow: 'hidden',
      borderRadius: 24,
      backgroundColor:
        '#050303',
    },
    canvas: {
      ...StyleSheet.absoluteFillObject,
    },
  });
