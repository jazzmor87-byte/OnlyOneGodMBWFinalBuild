import React from 'react';
import MBWSingleAppVisualBody from './MBWSingleAppVisualBody';
import { MBWScreenBoundary } from './MBWScreenGuard';

export function MBWVisualBodyFrame({
  children,
  screenName = 'MBW LIVE BODY',
  headline,
  posterSource,
}) {
  return (
    <MBWScreenBoundary screenName={screenName}>
      <MBWSingleAppVisualBody
        screenName={screenName}
        headline={headline}
        posterSource={posterSource}
      >
        {children}
      </MBWSingleAppVisualBody>
    </MBWScreenBoundary>
  );
}

export default MBWVisualBodyFrame;
