import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function ProfileCrownScreen() {
  return (
    <TruthPosterScreen
      title="PROFILE CROWN SCREEN"
      screenPath="app/screens/__compensation/ProfileCrownScreen.js"
      screenStem="ProfileCrownScreen"
      primaryRoutes={["ProfileMainLux", "profile_main", "Profile", "ProfileHome", "HomeHub"]}
      secondaryRoutes={["ProfileSettings", "ProfileSecurity", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/profile_main.png')}
    />
  );
}
