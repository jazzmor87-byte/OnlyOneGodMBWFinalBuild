import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function TravelInbox() {
  return (
    <TruthPosterScreen
      title="TRAVEL INBOX"
      screenPath="app/screens/Travel/TravelInbox.js"
      screenStem="TravelInbox"
      primaryRoutes={["TravelLocalAdventure", "TravelOverseasHost", "TravelScreen", "HomeHub"]}
      secondaryRoutes={["HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/nomad_circuit.png')}
    />
  );
}
