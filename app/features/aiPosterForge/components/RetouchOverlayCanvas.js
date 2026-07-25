import React from 'react';
import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  Image,
  Mask,
  Path,
  Rect,
  Skia,
  useImage,
} from '@shopify/react-native-skia';
import {
  EDITOR_HEIGHT,
  EDITOR_WIDTH,
  subjectTransformList,
} from '../geometry/editorGeometry';

function maskPath(
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
        maskPath
      )}
    </Group>
  );
}

function SourcePatch({
  image,
  operation,
}) {
  const dx =
    operation.target.x -
    operation.source.x;
  const dy =
    operation.target.y -
    operation.source.y;

  return (
    <Mask
      clip
      mask={
        <Circle
          cx={
            operation.target.x
          }
          cy={
            operation.target.y
          }
          r={
            operation.radius
          }
          opacity={
            operation.opacity
          }
        >
          <BlurMask
            blur={
              operation.feather
            }
            style="normal"
          />
        </Circle>
      }
    >
      <Group
        transform={[
          {
            translateX:
              dx,
          },
          {
            translateY:
              dy,
          },
        ]}
      >
        <Image
          image={image}
          x={0}
          y={0}
          width={EDITOR_WIDTH}
          height={EDITOR_HEIGHT}
          fit="contain"
        />
      </Group>
    </Mask>
  );
}

function HealPatch({
  image,
  operation,
}) {
  return (
    <SourcePatch
      image={image}
      operation={{
        ...operation,
        source: {
          x:
            operation.target.x +
            operation.radius *
              1.7,
          y:
            operation.target.y -
            operation.radius *
              1.2,
        },
        feather:
          operation.blur ||
          8,
      }}
    />
  );
}

export default function RetouchOverlayCanvas({
  uri,
  geometry,
  transform,
  maskImage,
  maskEnabled,
  manualMaskPaths = [],
  operations = [],
  visible = true,
}) {
  const image =
    useImage(uri || null);

  if (
    !visible ||
    !image ||
    !operations.length ||
    !geometry?.ready
  ) {
    return null;
  }

  return (
    <Canvas
      pointerEvents="none"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Group
        transform={[
          {
            scaleX:
              geometry.scaleX,
          },
          {
            scaleY:
              geometry.scaleY,
          },
        ]}
      >
        <Group
          origin={{
            x:
              EDITOR_WIDTH / 2,
            y:
              EDITOR_HEIGHT / 2,
          }}
          transform={
            subjectTransformList(
              transform
            )
          }
        >
          <Mask
            mode="luminance"
            mask={
              <SubjectMask
                maskImage={
                  maskImage
                }
                maskEnabled={
                  maskEnabled
                }
                manualMaskPaths={
                  manualMaskPaths
                }
              />
            }
          >
            {operations.map(
              (operation) => {
                if (
                  operation.type ===
                    'CLONE_STAMP' ||
                  operation.type ===
                    'PATCH'
                ) {
                  return (
                    <SourcePatch
                      key={
                        operation.id
                      }
                      image={image}
                      operation={
                        operation
                      }
                    />
                  );
                }

                if (
                  operation.type ===
                  'SPOT_HEAL'
                ) {
                  return (
                    <HealPatch
                      key={
                        operation.id
                      }
                      image={image}
                      operation={
                        operation
                      }
                    />
                  );
                }

                return null;
              }
            )}
          </Mask>
        </Group>
      </Group>
    </Canvas>
  );
}
