import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function LiveChamberScreen() {
  return (
    <TruthPosterScreen
      title="LIVE CHAMBER SCREEN"
      screenPath="app/screens/__compensation/LiveChamberScreen.js"
      screenStem="LiveChamberScreen"
      primaryRoutes={["LoungePulseScreen", "LiveLoungeLux", "LiveLoungeScreen", "LoungeHome", "HomeHub"]}
      secondaryRoutes={["LoungeStories", "LoungeHome", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/lounge_ranking.png')}
    />
  );
}
