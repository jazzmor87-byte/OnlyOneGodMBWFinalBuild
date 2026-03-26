import React from 'react';
import EntryStaticScreen from './_EntryStaticScreen';

export default function GateLockedScreen() {
  return (
    <EntryStaticScreen
      title="GATE LOCKED"
      subtitle="The realm is sealed until you continue."
      asset={require('../../assets/gate/locked.png')}
      primaryLabel="Open Gate"
      primaryRoutes={['GateOpenAfterUnlock', 'GateOpenCinematic', 'PathSelectionScreen']}
      secondaryLabel="Back"
      secondaryRoutes={['GateCinematic', 'GateScreen']}
    />
  );
}
