import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function TravelLedgerScreen() {
  return (
    <TruthPosterScreen
      title="TRAVEL LEDGER SCREEN"
      screenPath="app/screens/__compensation/TravelLedgerScreen.js"
      screenStem="TravelLedgerScreen"
      primaryRoutes={["Safe_meet_atlas", "TravelOverseasLux", "TravelScreen", "TravelInbox", "HomeHub"]}
      secondaryRoutes={["SafeMeetAtlasScreen", "JourneyCompanionScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/host_circle.png')}
    />
  );
}
