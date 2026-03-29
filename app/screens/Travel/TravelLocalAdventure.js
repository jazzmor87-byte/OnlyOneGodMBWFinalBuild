import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function TravelLocalAdventure() {
  return (
    <TruthPosterScreen
      title="TRAVEL LOCAL ADVENTURE"
      screenPath="app/screens/Travel/TravelLocalAdventure.js"
      screenStem="TravelLocalAdventure"
      primaryRoutes={["TravelOverseasHost", "TravelScreen", "TravelInbox", "HomeHub"]}
      secondaryRoutes={["TravelInbox", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/journey_companion.png')}
    />
  );
}
