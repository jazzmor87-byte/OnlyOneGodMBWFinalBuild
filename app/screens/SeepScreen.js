import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function SeepScreen() {
  return (
    <TruthPosterScreen
      title="SEEP SCREEN"
      screenPath="app/screens/SeepScreen.js"
      screenStem="SeepScreen"
      primaryRoutes={["BorderCrossingsScreen", "HostCircleScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["SeepArena", "LudoArena", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/mbw_luxscreens/chemistry_board.png')}
    />
  );
}
