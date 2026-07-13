import React from 'react';
import { View, StyleSheet } from 'react-native';

export const ArcadeHub_17G1_FRESH_SOURCE_ONLY = Object.freeze({
  marker: '17G1R_ROOT_ARCADE_HUB_FRESH_ONLY',
  oldVisualBodyImported: false,
  oldRootImported: false,
  heavyGraphImported: false,
  htmlEngineImported: false,
  visibleText: false,
  touchCapture: false,
});

export default function ArcadeHub() {
  return <View pointerEvents="none" style={styles.freshSourceOnly} />;
}

const styles = StyleSheet.create({
  freshSourceOnly: {
    flex: 1,
    opacity: 0.01,
    backgroundColor: 'rgba(204, 156, 58, 0.02)',
  },
});
