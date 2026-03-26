import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function LoungeStories() {
  return (
    <TruthPosterScreen
      title="LOUNGE STORIES"
      screenPath="app/screens/MensLounge/LoungeStories.js"
      screenStem="LoungeStories"
      primaryRoutes={["LiveChamberScreen", "LoungePulseScreen", "LiveLoungeScreen", "LoungeHome", "HomeHub"]}
      secondaryRoutes={["LoungeHome", "LoungeGoLive", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/lounge_pulse.png')}
    />
  );
}
