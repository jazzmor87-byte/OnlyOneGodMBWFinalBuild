import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function ProfileHome() {
  return (
    <TruthPosterScreen
      title="PROFILE HOME"
      screenPath="app/screens/Profile/ProfileHome.js"
      screenStem="ProfileHome"
      primaryRoutes={["ProfileSecurity", "ProfileSettings", "Profile", "HomeHub"]}
      secondaryRoutes={["Profile", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/profile_crown.png')}
    />
  );
}
