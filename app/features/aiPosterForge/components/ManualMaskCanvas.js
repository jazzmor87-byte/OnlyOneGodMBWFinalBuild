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
import Svg, {
  Path,
} from 'react-native-svg';
import {
  EDITOR_HEIGHT,
  EDITOR_WIDTH,
  viewToSubjectPoint,
} from '../geometry/editorGeometry';

function pointsToPath(
  points
) {
  if (!points.length) {
    return '';
  }

  return points
    .map(
      (point, index) =>
        `${
          index === 0
            ? 'M'
            : 'L'
        } ${point.x} ${point.y}`
    )
    .join(' ');
}

export default function ManualMaskCanvas({
  geometry,
  transform,
  brushSize = 34,
  mode = 'ADD',
  paths = [],
  visible = true,
  onCommit,
}) {
  const active =
    useRef([]);
  const [preview, setPreview] =
    useState([]);

  const finish = () => {
    if (
      active.current.length < 2
    ) {
      active.current = [];
      setPreview([]);
      return;
    }

    onCommit?.({
      id:
        `MASK_${Date.now()}_${Math.random()}`,
      mode,
      brushSize,
      points:
        active.current,
      svg:
        pointsToPath(
          active.current
        ),
    });
    active.current = [];
    setPreview([]);
  };

  const responder =
    useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder:
            () => visible,
          onMoveShouldSetPanResponder:
            () => visible,
          onPanResponderGrant:
            (event) => {
              const point =
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

              active.current = [
                point,
              ];
              setPreview([
                point,
              ]);
            },
          onPanResponderMove:
            (event) => {
              const point =
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

              active.current = [
                ...active.current,
                point,
              ];
              setPreview(
                active.current
              );
            },
          onPanResponderRelease:
            finish,
          onPanResponderTerminate:
            finish,
        }),
      [
        brushSize,
        geometry,
        mode,
        transform,
        visible,
      ]
    );

  if (!visible) {
    return null;
  }

  const previewPath = {
    id: 'PREVIEW',
    mode,
    brushSize,
    svg:
      pointsToPath(
        preview
      ),
  };

  return (
    <View
      {...responder.panHandlers}
      style={styles.root}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox={
          `0 0 ${EDITOR_WIDTH} ${EDITOR_HEIGHT}`
        }
      >
        {[
          ...paths,
          previewPath,
        ].map(
          (path) =>
            path.svg ? (
              <Path
                key={path.id}
                d={path.svg}
                fill="none"
                stroke={
                  path.mode ===
                  'SUBTRACT'
                    ? 'rgba(255,70,70,0.58)'
                    : 'rgba(115,255,165,0.58)'
                }
                strokeWidth={
                  path.brushSize
                }
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null
        )}
      </Svg>
    </View>
  );
}

const styles =
  StyleSheet.create({
    root: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 90,
    },
  });
