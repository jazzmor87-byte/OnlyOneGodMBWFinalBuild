import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function LocalTrailsScreen() {
  return (
    <TruthPosterScreen
      title="LOCAL TRAILS SCREEN"
      screenPath="app/screens/__compensation/LocalTrailsScreen.js"
      screenStem="LocalTrailsScreen"
      primaryRoutes={["MintStoriesScreen", "NomadCircuitMain", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["HostCircleScreen", "BorderCrossingsScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/chemistry_board.png')}
    />
  );
}
