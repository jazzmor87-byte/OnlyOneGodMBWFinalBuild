import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function KamaHome() {
  return (
    <TruthPosterScreen
      title="KAMA HOME"
      screenPath="app/screens/Kamashastra/KamaHome.js"
      screenStem="KamaHome"
      primaryRoutes={["KamaLessons", "KamaQuiz", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["HomeScreen", "GamesScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/chemistry_board.png')}
    />
  );
}
