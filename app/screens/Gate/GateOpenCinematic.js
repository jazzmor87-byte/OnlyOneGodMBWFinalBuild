import React from 'react';
import EntryStaticScreen from './_EntryStaticScreen';

export default function GateOpenCinematic() {
  return (
    <EntryStaticScreen
      title="ASCENSION"
      subtitle="The gate has opened. Choose your path."
      asset={require('../../assets/gate/open.png')}
      primaryLabel="Choose Path"
      primaryRoutes={['PathSelectionScreen', 'Login', 'Signup']}
      secondaryLabel="Back"
      secondaryRoutes={['GateOpenAfterUnlock', 'GateLockedScreen']}
    />
  );
}
