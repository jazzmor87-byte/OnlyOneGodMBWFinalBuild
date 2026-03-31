import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function HomeHub() {
  return (
    <TruthPosterScreen
      title="HOME HUB"
      screenPath="app/screens/HomeHub.js"
      screenStem="HomeHub"
      primaryRoutes={["MBWHome", "RealmHome"]}
      secondaryRoutes={["MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/mbw_luxscreens/main_hub.png')}
    />
  );
}
