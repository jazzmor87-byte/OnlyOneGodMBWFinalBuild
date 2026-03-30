import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function JourneyCompanionScreen() {
  return (
    <TruthPosterScreen
      title="JOURNEY COMPANION SCREEN"
      screenPath="app/screens/__compensation/JourneyCompanionScreen.js"
      screenStem="JourneyCompanionScreen"
      primaryRoutes={["SafeMeetAtlasScreen", "TravelLedgerScreen", "TravelScreen", "TravelInbox", "HomeHub"]}
      secondaryRoutes={["TravelScreen", "TravelOverseasHost", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/travel_overseas.png')}
    />
  );
}
