import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function LoungePulseScreen() {
  return (
    <TruthPosterScreen
      title="LOUNGE PULSE SCREEN"
      screenPath="app/screens/__compensation/LoungePulseScreen.js"
      screenStem="LoungePulseScreen"
      primaryRoutes={["LiveLoungeLux", "Live_lounge", "LiveLoungeScreen", "LoungeHome", "HomeHub"]}
      secondaryRoutes={["LiveChamberScreen", "LoungeStories", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/lounge_stories.png')}
    />
  );
}
