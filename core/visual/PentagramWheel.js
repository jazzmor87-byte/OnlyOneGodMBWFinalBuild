import React from 'react';
import { View, StyleSheet } from 'react-native';

export function PentagramWheel({ children, style, size = 220 }) {
  return (
    <View style={[styles.root, { width: size, height: size, borderRadius: size / 2 }, style]} pointerEvents="box-none">
      <View pointerEvents="none" style={styles.ring} />
      <View pointerEvents="none" style={styles.starA} />
      <View pointerEvents="none" style={styles.starB} />
      <View pointerEvents="none" style={styles.starC} />
      <View pointerEvents="box-none" style={styles.body}>
        {children}
      </View>
    </View>
  );
}

export default PentagramWheel;

export const MBW_PENTAGRAM_WHEEL_ACTIVE = true;

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(214, 173, 91, 0.035)',
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(214, 173, 91, 0.32)',
  },
  starA: {
    position: 'absolute',
    width: '72%',
    height: 1,
    backgroundColor: 'rgba(214, 173, 91, 0.28)',
    transform: [{ rotate: '0deg' }],
  },
  starB: {
    position: 'absolute',
    width: '72%',
    height: 1,
    backgroundColor: 'rgba(122, 31, 45, 0.30)',
    transform: [{ rotate: '72deg' }],
  },
  starC: {
    position: 'absolute',
    width: '72%',
    height: 1,
    backgroundColor: 'rgba(214, 173, 91, 0.22)',
    transform: [{ rotate: '144deg' }],
  },
  body: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
