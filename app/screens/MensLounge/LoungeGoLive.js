import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function LoungeGoLive() {
  return (
    <TruthPosterScreen
      title="LOUNGE GO LIVE"
      screenPath="app/screens/MensLounge/LoungeGoLive.js"
      screenStem="LoungeGoLive"
      primaryRoutes={["LoungeHome", "LoungeStories", "LiveLoungeScreen", "HomeHub"]}
      secondaryRoutes={["LiveLoungeScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/live_chamber.png')}
    />
  );
}
