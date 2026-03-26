import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function KamaLessons() {
  return (
    <TruthPosterScreen
      title="KAMA LESSONS"
      screenPath="app/screens/Kamashastra/KamaLessons.js"
      screenStem="KamaLessons"
      primaryRoutes={["KamaQuiz", "KamashastraScreen", "GamesScreen", "HomeHub"]}
      secondaryRoutes={["KamaHome", "HomeScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/art_main.png')}
    />
  );
}
