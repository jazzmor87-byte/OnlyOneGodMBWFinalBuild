import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function TravelScreen() {
  return (
    <TruthPosterScreen
      title="TRAVEL SCREEN"
      screenPath="app/screens/TravelScreen.js"
      screenStem="TravelScreen"
      primaryRoutes={["JourneyCompanionScreen", "SafeMeetAtlasScreen", "TravelInbox", "HomeHub"]}
      secondaryRoutes={["TravelOverseasHost", "TravelLocalAdventure", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/finalux/border_crossings.png')}
    />
  );
}
