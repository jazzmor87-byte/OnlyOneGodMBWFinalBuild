import React from 'react';
import EntryStaticScreen from './Gate/_EntryStaticScreen';

export default function Login() {
  return (
    <EntryStaticScreen
      title="LOG IN"
      subtitle="Return to your place inside MBW."
      asset={require('../assets/finalux/login_main.png')}
      primaryLabel="Continue"
      primaryRoutes={['Subscription', 'MBWHome', 'HomeHub']}
      secondaryLabel="Sign Up"
      secondaryRoutes={['Signup', 'PathSelectionScreen']}
    />
  );
}
