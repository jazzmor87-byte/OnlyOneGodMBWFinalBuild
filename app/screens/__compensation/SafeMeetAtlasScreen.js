import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function SafeMeetAtlasScreen() {
  return (
    <TruthPosterScreen
      title="SAFE MEET ATLAS SCREEN"
      screenPath="app/screens/__compensation/SafeMeetAtlasScreen.js"
      screenStem="SafeMeetAtlasScreen"
      primaryRoutes={["TravelLedgerScreen", "Safe_meet_atlas", "TravelScreen", "TravelInbox", "HomeHub"]}
      secondaryRoutes={["JourneyCompanionScreen", "TravelScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/safe_meet_atlas.png')}
    />
  );
}
