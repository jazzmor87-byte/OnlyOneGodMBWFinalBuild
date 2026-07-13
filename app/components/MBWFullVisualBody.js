import React from 'react';
import { View, StyleSheet } from 'react-native';

export function MBWFullVisualBody({ children, style, ...props }) {
  return (
    <View {...props} style={[styles.root, style]}>
      <View pointerEvents="none" style={styles.goldAura} />
      <View pointerEvents="none" style={styles.maroonAura} />
      {children}
    </View>
  );
}

export default MBWFullVisualBody;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070304',
    overflow: 'hidden',
  },
  goldAura: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    alignSelf: 'center',
    top: '18%',
    backgroundColor: 'rgba(214,173,91,0.055)',
  },
  maroonAura: {
    position: 'absolute',
    width: 460,
    height: 460,
    borderRadius: 230,
    alignSelf: 'center',
    top: '8%',
    backgroundColor: 'rgba(91,21,31,0.10)',
  },
});
