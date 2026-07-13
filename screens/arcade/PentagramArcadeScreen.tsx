import React from 'react';
import { View, StyleSheet } from 'react-native';
import MBWSingleAppVisualBody from '../../app/components/MBWSingleAppVisualBody';

export const PentagramArcadeScreen_17G1_FRESH_SOURCE_ONLY = Object.freeze({
  marker: '17G1R_ROOT_PENTAGRAM_ARCADE_FRESH_ONLY',
  oldVisualBodyImported: false,
  oldRootImported: false,
  heavyGraphImported: false,
  htmlEngineImported: false,
  visibleText: false,
  touchCapture: false,
});

function PentagramArcadeScreenContent() {
  return <View pointerEvents="none" style={styles.freshSourceOnly} />;
}

const styles = StyleSheet.create({
  freshSourceOnly: {
    flex: 1,
    opacity: 0.01,
    backgroundColor: 'rgba(204, 156, 58, 0.02)',
  },
});

// MBW_24E26B_VISUAL_OWNER_REPAIR
export default function PentagramArcadeScreenMBWVisualOwned(props) {
  return (
    <MBWSingleAppVisualBody screenName="PentagramArcadeScreen">
      <PentagramArcadeScreenContent {...props} />
    </MBWSingleAppVisualBody>
  );
}

