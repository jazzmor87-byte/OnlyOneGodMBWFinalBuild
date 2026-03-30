import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function StayCircleScreen() {
  return (
    <TruthPosterScreen
      title="STAY CIRCLE SCREEN"
      screenPath="app/screens/__compensation/StayCircleScreen.js"
      screenStem="StayCircleScreen"
      primaryRoutes={["TributeLedgerScreen", "VaultReserveScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["NomadCircuitMain", "MintStoriesScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/chemistry_board.png')}
    />
  );
}
