import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function LiveLoungeScreen() {
  return (
    <TruthPosterScreen
      title="LIVE LOUNGE SCREEN"
      screenPath="app/screens/LiveLoungeScreen.js"
      screenStem="LiveLoungeScreen"
      primaryRoutes={["LoungeGoLive", "LoungeHome", "HomeHub"]}
      secondaryRoutes={["HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/finalux/live_lounge.png')}
    />
  );
}
