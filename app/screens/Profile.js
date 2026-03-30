import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function Profile() {
  return (
    <TruthPosterScreen
      title="PROFILE"
      screenPath="app/screens/Profile.js"
      screenStem="Profile"
      primaryRoutes={["ProfileHome", "ProfileSecurity", "HomeHub"]}
      secondaryRoutes={["HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/mbw_luxscreens/profile_main.png')}
    />
  );
}
