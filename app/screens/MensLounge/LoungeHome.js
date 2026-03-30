import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function LoungeHome() {
  return (
    <TruthPosterScreen
      title="LOUNGE HOME"
      screenPath="app/screens/MensLounge/LoungeHome.js"
      screenStem="LoungeHome"
      primaryRoutes={["LoungeStories", "LiveChamberScreen", "LiveLoungeScreen", "HomeHub"]}
      secondaryRoutes={["LoungeGoLive", "LiveLoungeScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/live_schedule.png')}
    />
  );
}
