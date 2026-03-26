import React from 'react';
import EntryStaticScreen from './Gate/_EntryStaticScreen';

export default function GateCinematic() {
  return (
    <EntryStaticScreen
      title="MEN BEHIND WALL"
      subtitle="Cinematic entry into the realm."
      asset={require('../assets/images/dragon_gate.png')}
      primaryLabel="Continue"
      primaryRoutes={['GateLockedScreen', 'LockedScreen', 'GateScreen']}
      secondaryLabel="Gate"
      secondaryRoutes={['GateScreen', 'GateLockedScreen']}
    />
  );
}
