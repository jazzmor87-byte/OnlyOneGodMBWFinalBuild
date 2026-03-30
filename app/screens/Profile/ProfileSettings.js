import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function ProfileSettings() {
  return (
    <TruthPosterScreen
      title="PROFILE SETTINGS"
      screenPath="app/screens/Profile/ProfileSettings.js"
      screenStem="ProfileSettings"
      primaryRoutes={["ProfileCrownScreen", "ProfileMainLux", "Profile", "ProfileHome", "HomeHub"]}
      secondaryRoutes={["ProfileSecurity", "ProfileHome", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/profile_main.png')}
    />
  );
}
