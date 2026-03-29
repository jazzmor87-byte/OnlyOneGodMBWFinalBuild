import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function HomeScreen() {
  return (
    <TruthPosterScreen
      title="HOME SCREEN"
      screenPath="app/screens/HomeScreen.js"
      screenStem="HomeScreen"
      primaryRoutes={["KamaHome", "KamaLessons", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["GamesScreen", "SeepTableScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/finalux/games_main.png')}
    />
  );
}
