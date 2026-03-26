import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function TravelMain() {
  return (
    <TruthPosterScreen
      title="TRAVEL MAIN"
      screenPath="app/screens/main3d/TravelMain.js"
      screenStem="TravelMain"
      primaryRoutes={["TravelScreen", "TravelInbox", "HomeHub"]}
      secondaryRoutes={["travel_overseas", "travel", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/nomad_circuit.png')}
    />
  );
}
