import React from 'react';
import { View } from 'react-native';

export default function MBWScreenGuard({ children, style }) {
  return (
    <View style={[{ flex: 1, backgroundColor: '#070304' }, style]} pointerEvents="box-none">
      {children}
    </View>
  );
}

export function ScreenGuard(props) {
  return <MBWScreenGuard {...props} />;
}

export const MBW_SCREEN_GUARD_ACTIVE = true;
export const MBW_SCREEN_GUARD_BLOCKING = false;

export function MBWScreenBoundary({ children, style }) {
  return <MBWScreenGuard style={style}>{children}</MBWScreenGuard>;
}
