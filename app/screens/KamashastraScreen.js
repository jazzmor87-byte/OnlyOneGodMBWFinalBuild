import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function KamashastraScreen() {
  return (
    <TruthPosterScreen
      title="KAMASHASTRA SCREEN"
      screenPath="app/screens/KamashastraScreen.js"
      screenStem="KamashastraScreen"
      primaryRoutes={["LudoArena", "SeepArena", "GamesScreen", "HomeHub"]}
      secondaryRoutes={["KamaQuiz", "KamaLessons", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/mbw_luxscreens/chemistry_board.png')}
    />
  );
}
