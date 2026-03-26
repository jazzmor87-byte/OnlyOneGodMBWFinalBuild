import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function RealmHome() {
  return (
    <TruthPosterScreen
      title="REALM HOME"
      screenPath="app/screens/RealmHome.js"
      screenStem="RealmHome"
      primaryRoutes={["RealmPrivilegesScreen", "RealmMainLux", "MBWHome", "HomeHub"]}
      secondaryRoutes={["MBWHome", "HomeHub"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/finalux/realm_main_alt.png')}
    />
  );
}
