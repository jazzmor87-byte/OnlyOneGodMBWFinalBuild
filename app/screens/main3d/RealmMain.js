import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function RealmMain() {
  return (
    <TruthPosterScreen
      title="REALM MAIN"
      screenPath="app/screens/main3d/RealmMain.js"
      screenStem="RealmMain"
      primaryRoutes={["MBWHome","RealmHome","HomeHub"]}
      secondaryRoutes={["HomeHub","Login","GateScreen"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/realm_council.png')}
    />
  );
}
