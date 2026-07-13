import React from 'react';
import { View, StyleSheet } from 'react-native';

export function MBWOneVisualSurface({ children, style, ...props }) {
  return (
    <View {...props} style={[styles.surface, style]}>
      {children}
    </View>
  );
}

export default MBWOneVisualSurface;

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
