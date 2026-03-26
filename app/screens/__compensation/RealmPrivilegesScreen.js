import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function RealmPrivilegesScreen() {
  return (
    <TruthPosterScreen
      title="REALM PRIVILEGES SCREEN"
      screenPath="app/screens/__compensation/RealmPrivilegesScreen.js"
      screenStem="RealmPrivilegesScreen"
      primaryRoutes={["RealmMainLux", "main_hub", "MBWHome", "RealmHome", "HomeHub"]}
      secondaryRoutes={["RealmHome", "MBWHome", "HomeHub"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/realm_council.png')}
    />
  );
}
