import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function LoungeMain() {
  return (
    <TruthPosterScreen
      title="LOUNGE MAIN"
      screenPath="app/screens/main3d/LoungeMain.js"
      screenStem="LoungeMain"
      primaryRoutes={["LiveLoungeScreen", "LoungeHome", "HomeHub"]}
      secondaryRoutes={["Live_lounge", "LiveLoungeLux", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/live_schedule.png')}
    />
  );
}
