import React from 'react';
import EntryStaticScreen from './Gate/_EntryStaticScreen';

export default function Subscription() {
  return (
    <EntryStaticScreen
      title="SUBSCRIPTION"
      subtitle="Choose your access and continue into the app."
      asset={require('../assets/mbw_luxscreens/subscription_main.png')}
      primaryLabel="Enter"
      primaryRoutes={['MBWHome', 'HomeHub', 'RealmHome']}
      secondaryLabel="Back"
      secondaryRoutes={['Login', 'Signup', 'PathSelectionScreen']}
    />
  );
}
