import React from 'react';
import { View } from 'react-native';

export type MBWVisualBoundaryProps = {
  children?: React.ReactNode;
};

export function MBWVisualBoundary({ children }: MBWVisualBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: '#070304' }} pointerEvents="box-none">
      {children}
    </View>
  );
}

export default MBWVisualBoundary;
