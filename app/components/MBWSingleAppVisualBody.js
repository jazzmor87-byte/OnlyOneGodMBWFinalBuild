import React from 'react';
import { View } from 'react-native';

export default function MBWSingleAppVisualBody({ children, style }) {
  return (
    <View style={[{ flex: 1, backgroundColor: '#070304' }, style]} pointerEvents="box-none">
      {children}
    </View>
  );
}

export const MBW_SINGLE_APP_VISUAL_BODY_ACTIVE = true;
export const MBW_SINGLE_APP_VISUAL_BODY_BLOCKING = false;
