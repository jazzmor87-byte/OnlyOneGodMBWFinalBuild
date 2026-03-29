import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function SeepArena() {
  return (
    <TruthPosterScreen
      title="SEEP ARENA"
      screenPath="app/screens/SeepArena.js"
      screenStem="SeepArena"
      primaryRoutes={["SeepScreen", "BorderCrossingsScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["LudoArena", "KamashastraScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/finalux/games_main.png')}
    />
  );
}
