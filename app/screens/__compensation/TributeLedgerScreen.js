import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function TributeLedgerScreen() {
  return (
    <TruthPosterScreen
      title="TRIBUTE LEDGER SCREEN"
      screenPath="app/screens/__compensation/TributeLedgerScreen.js"
      screenStem="TributeLedgerScreen"
      primaryRoutes={["VaultReserveScreen", "ArtMainLux", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["StayCircleScreen", "NomadCircuitMain", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/art_main.png')}
    />
  );
}
