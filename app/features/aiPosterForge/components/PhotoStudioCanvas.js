import React, { forwardRef } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import AIStudioCanvas from './AIStudioCanvas';

const subjectLayers = Object.freeze({
  background: false,
  subject: true,
  shadow: true,
  retouch: true,
  effects: false,
});

function slotStyle(slot) {
  return {
    left: `${slot.left * 100}%`,
    top: `${slot.top * 100}%`,
    width: `${slot.width * 100}%`,
    height: `${slot.height * 100}%`,
    zIndex: slot.zIndex || 20,
  };
}

const PhotoStudioCanvas = forwardRef(function PhotoStudioCanvas(
  {
    template,
    subjectsBySlot,
    activeSlotId,
    onSelectSlot,
    exporting,
  },
  ref
) {
  const modelSlots = template?.modelSlots || [];

  return (
    <ViewShot
      ref={ref}
      collapsable={false}
      options={{
        format: 'png',
        quality: 1,
        result: 'tmpfile',
        width: template?.exportWidth || 1080,
        height: template?.exportHeight || 1600,
        handleGLSurfaceViewOnAndroid: true,
      }}
      style={styles.capture}
    >
      <ImageBackground
        source={template?.posterSource}
        resizeMode="cover"
        style={styles.poster}
      >
        {modelSlots.map((modelSlot) => {
          const subject = subjectsBySlot?.[modelSlot.id] || {};
          return (
            <View
              key={modelSlot.id}
              pointerEvents="box-none"
              style={[styles.slot, slotStyle(modelSlot)]}
            >
              {subject.imageUri ? (
                <AIStudioCanvas
                  uri={subject.imageUri}
                  aiMaskImage={subject.aiMaskImage || null}
                  aiMaskEnabled={Boolean(subject.aiMaskImage)}
                  adjustments={subject.adjustments}
                  transform={subject.transform}
                  backgroundColor="transparent"
                  layers={subjectLayers}
                  manualMaskEnabled={false}
                  manualMaskMode="ADD"
                  manualMaskBrushSize={34}
                  manualMaskPaths={[]}
                  activeRetouchTool={null}
                  retouchOperations={[]}
                  showEditorOverlays={false}
                  onMaskCommit={() => {}}
                  onRetouchOperation={() => {}}
                />
              ) : null}

              {!exporting ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${modelSlot.id}`}
                  onPress={() => onSelectSlot?.(modelSlot.id)}
                  style={[
                    styles.slotSelector,
                    activeSlotId === modelSlot.id && styles.slotSelectorActive,
                  ]}
                />
              ) : null}
            </View>
          );
        })}

        {template?.foregroundSource ? (
          <Image
            pointerEvents="none"
            source={template.foregroundSource}
            resizeMode="cover"
            style={styles.foreground}
          />
        ) : null}
      </ImageBackground>
    </ViewShot>
  );
});

export default PhotoStudioCanvas;

const styles = StyleSheet.create({
  capture: {
    width: '100%',
    aspectRatio: 1080 / 1600,
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: '#030202',
  },
  poster: {
    flex: 1,
    backgroundColor: '#030202',
  },
  slot: {
    position: 'absolute',
    overflow: 'hidden',
  },
  slotSelector: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(214,166,67,0.25)',
  },
  slotSelectorActive: {
    borderWidth: 2,
    borderColor: 'rgba(214,166,67,0.95)',
  },
  foreground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 90,
  },
});
