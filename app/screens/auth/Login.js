import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function Login() {
  return (
    <TruthPosterScreen
      title="LOGIN"
      screenPath="app/screens/auth/Login.js"
      screenStem="Login"
      primaryRoutes={["Subscription", "Signup", "GateScreen", "PathSelectionScreen", "HomeHub"]}
      secondaryRoutes={["LockedScreen", "GateScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/concierge_desk.png')}
    />
  );
}
