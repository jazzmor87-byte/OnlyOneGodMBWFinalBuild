import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function LockedScreen() {
  return (
    <TruthPosterScreen
      title="LOCKED SCREEN"
      screenPath="app/screens/LockedScreen.js"
      screenStem="LockedScreen"
      primaryRoutes={["Login", "Subscription", "GateScreen", "PathSelectionScreen", "Signup", "HomeHub"]}
      secondaryRoutes={["GateScreen", "GateCinematic", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/mbw_luxscreens/realm_main_alt.png')}
    />
  );
}
