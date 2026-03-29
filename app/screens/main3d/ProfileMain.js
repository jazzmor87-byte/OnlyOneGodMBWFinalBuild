import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function ProfileMain() {
  return (
    <TruthPosterScreen
      title="PROFILE MAIN"
      screenPath="app/screens/main3d/ProfileMain.js"
      screenStem="ProfileMain"
      primaryRoutes={["Profile", "ProfileHome", "HomeHub"]}
      secondaryRoutes={["profile_main", "ProfileMainLux", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/profile_crown.png')}
    />
  );
}
