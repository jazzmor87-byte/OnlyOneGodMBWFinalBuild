import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function TravelOverseasHost() {
  return (
    <TruthPosterScreen
      title="TRAVEL OVERSEAS HOST"
      screenPath="app/screens/Travel/TravelOverseasHost.js"
      screenStem="TravelOverseasHost"
      primaryRoutes={["TravelScreen", "JourneyCompanionScreen", "TravelInbox", "HomeHub"]}
      secondaryRoutes={["TravelLocalAdventure", "TravelInbox", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/journey_map.png')}
    />
  );
}
