import React from 'react';
import EntryStaticScreen from '../Gate/_EntryStaticScreen';

export default function Signup() {
  return (
    <EntryStaticScreen
      title="SIGN UP"
      subtitle="Create your account and continue into MBW."
      asset={require('../../assets/finalux/sign_up_main.png')}
      primaryLabel="Continue"
      primaryRoutes={['Subscription', 'MBWHome', 'HomeHub']}
      secondaryLabel="Log In"
      secondaryRoutes={['Login', 'PathSelectionScreen']}
    />
  );
}
