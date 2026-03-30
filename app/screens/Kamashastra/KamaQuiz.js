import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function KamaQuiz() {
  return (
    <TruthPosterScreen
      title="KAMA QUIZ"
      screenPath="app/screens/Kamashastra/KamaQuiz.js"
      screenStem="KamaQuiz"
      primaryRoutes={["KamashastraScreen", "LudoArena", "GamesScreen", "HomeHub"]}
      secondaryRoutes={["KamaLessons", "KamaHome", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/main_hub.png')}
    />
  );
}
