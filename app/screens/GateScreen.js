import React from 'react';
import EntryStaticScreen from './Gate/_EntryStaticScreen';

export default function GateScreen() {
  return (
    <EntryStaticScreen
      title="THE GATE"
      subtitle="The threshold before your path is chosen."
      asset={require('../assets/gate/locked.png')}
      primaryLabel="Unlock"
      primaryRoutes={['GateLockedScreen', 'LockedScreen', 'PathSelectionScreen']}
      secondaryLabel="Cinematic"
      secondaryRoutes={['GateCinematic', 'GateOpenCinematic']}
    />
  );
}
