import React from 'react';
import EntryStaticScreen from './Gate/_EntryStaticScreen';

export default function Subscription() {
  return (
    <EntryStaticScreen
      title="SUBSCRIPTION"
      subtitle="Choose your access and continue into the app."
      asset={require('../assets/finalux/sign_up_main.png')}
      primaryLabel="Enter"
      primaryRoutes={['MBWHome', 'HomeHub', 'RealmHome']}
      secondaryLabel="Back"
      secondaryRoutes={['Login', 'Signup', 'PathSelectionScreen']}
    />
  );
}
