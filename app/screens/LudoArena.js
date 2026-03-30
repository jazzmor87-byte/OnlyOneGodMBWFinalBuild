import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function LudoArena() {
  return (
    <TruthPosterScreen
      title="LUDO ARENA"
      screenPath="app/screens/LudoArena.js"
      screenStem="LudoArena"
      primaryRoutes={["SeepArena", "SeepScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["KamashastraScreen", "KamaQuiz", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/mbw_luxscreens/art_main.png')}
    />
  );
}
