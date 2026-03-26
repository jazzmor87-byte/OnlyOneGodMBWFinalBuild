import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function NomadCircuitMain() {
  return (
    <TruthPosterScreen
      title="NOMAD CIRCUIT MAIN"
      screenPath="app/screens/__compensation/NomadCircuitMain.js"
      screenStem="NomadCircuitMain"
      primaryRoutes={["StayCircleScreen", "TributeLedgerScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["MintStoriesScreen", "LocalTrailsScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/games_main.png')}
    />
  );
}
