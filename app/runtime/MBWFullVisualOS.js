import React from 'react';
import { View, StyleSheet } from 'react-native';
import MBWGlobalVisualLogicDriver from './MBWGlobalVisualLogicDriver';

export default function MBWFullVisualOS({ children, activeRoute, navigationRef }) {
  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={styles.maroonOrb} />
      <View pointerEvents="none" style={styles.goldCircle} />
      <View pointerEvents="none" style={styles.spaceOrb} />
      <View pointerEvents="none" style={styles.pentagramAura} />
      <View pointerEvents="box-none" style={styles.body}>
        {children}
      <MBWGlobalVisualLogicDriver activeRoute={activeRoute} navigationRef={navigationRef} />
      </View>
    </View>
  );
}

export const MBW_FULL_VISUAL_OS_ACTIVE = true;
export const MBW_FULL_LOGIC_CARRY_ACTIVE = true;
export const MBW_FULL_VISUAL_BODY_ACTIVE = true;
export const MBW_PROTECTION_SCREEN_VISIBLE = false;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#070304', overflow: 'hidden' },
  body: { ...StyleSheet.absoluteFillObject, zIndex: 10 },
  maroonOrb: { position: 'absolute', width: 720, height: 720, borderRadius: 360, top: -190, right: -190, backgroundColor: 'rgba(91, 21, 31, 0.16)' },
  goldCircle: { position: 'absolute', width: 470, height: 470, borderRadius: 235, left: -180, top: 180, borderWidth: 1, borderColor: 'rgba(214, 173, 91, 0.10)' },
  spaceOrb: { position: 'absolute', width: 620, height: 620, borderRadius: 310, left: -260, bottom: -220, backgroundColor: 'rgba(54, 22, 91, 0.08)' },
  pentagramAura: { position: 'absolute', width: 250, height: 250, borderRadius: 125, alignSelf: 'center', top: '35%', backgroundColor: 'rgba(214, 173, 91, 0.035)', transform: [{ rotate: '36deg' }] },
});
