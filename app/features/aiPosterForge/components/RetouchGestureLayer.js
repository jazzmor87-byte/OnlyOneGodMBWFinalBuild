import React, {
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import {
  viewToSubjectPoint,
} from '../geometry/editorGeometry';
import {
  createCloneStampOperation,
  createPatchOperation,
  createSpotHealOperation,
} from '../engines/retouchOperationEngine';

const SOURCE_TOOLS =
  new Set([
    'Clone Stamp',
    'Patch Tool',
  ]);

export default function RetouchGestureLayer({
  activeTool,
  geometry,
  transform,
  visible = true,
  onOperation,
}) {
  const sourceRef =
    useRef(null);
  const [source, setSource] =
    useState(null);

  const responder =
    useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder:
            () =>
              Boolean(
                activeTool &&
                visible
              ),
          onMoveShouldSetPanResponder:
            () => false,
          onPanResponderGrant:
            (event) => {
              const current =
                viewToSubjectPoint(
                  {
                    x:
                      event
                        .nativeEvent
                        .locationX,
                    y:
                      event
                        .nativeEvent
                        .locationY,
                  },
                  geometry,
                  transform
                );

              if (
                SOURCE_TOOLS.has(
                  activeTool
                )
              ) {
                if (!sourceRef.current) {
                  sourceRef.current =
                    current;
                  setSource(current);
                  return;
                }

                const operation =
                  activeTool ===
                  'Clone Stamp'
                    ? createCloneStampOperation({
                        source:
                          sourceRef.current,
                        target:
                          current,
                      })
                    : createPatchOperation({
                        source:
                          sourceRef.current,
                        target:
                          current,
                      });

                onOperation?.(
                  operation
                );
                sourceRef.current =
                  null;
                setSource(null);
                return;
              }

              if (
                activeTool ===
                'Spot Heal'
              ) {
                onOperation?.(
                  createSpotHealOperation({
                    target:
                      current,
                  })
                );
              }
            },
        }),
      [
        activeTool,
        geometry,
        onOperation,
        transform,
        visible,
      ]
    );

  if (
    !activeTool ||
    !visible
  ) {
    return null;
  }

  return (
    <View
      {...responder.panHandlers}
      style={styles.root}
    >
      {source ? (
        <View
          pointerEvents="none"
          style={[
            styles.source,
            {
              left:
                source.x *
                (
                  geometry
                    ?.scaleX ||
                  1
                ) -
                8,
              top:
                source.y *
                (
                  geometry
                    ?.scaleY ||
                  1
                ) -
                8,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles =
  StyleSheet.create({
    root: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 80,
    },
    source: {
      position: 'absolute',
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 2,
      borderColor:
        '#F0D47F',
      backgroundColor:
        'rgba(5,3,3,0.38)',
    },
  });
