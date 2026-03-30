import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function ProfileSecurity() {
  return (
    <TruthPosterScreen
      title="PROFILE SECURITY"
      screenPath="app/screens/Profile/ProfileSecurity.js"
      screenStem="ProfileSecurity"
      primaryRoutes={["ProfileSettings", "ProfileCrownScreen", "Profile", "ProfileHome", "HomeHub"]}
      secondaryRoutes={["ProfileHome", "Profile", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/crown_archive.png')}
    />
  );
}
