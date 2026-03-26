import React from 'react';
import EntryStaticScreen from './_EntryStaticScreen';

export default function GateOpenAfterUnlock() {
  return (
    <EntryStaticScreen
      title="GATE OPEN"
      subtitle="The path is now visible."
      asset={require('../../assets/gate/open.png')}
      primaryLabel="Next"
      primaryRoutes={['GateOpenCinematic', 'PathSelectionScreen', 'Login']}
      secondaryLabel="Back"
      secondaryRoutes={['GateLockedScreen', 'GateScreen']}
    />
  );
}
