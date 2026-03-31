import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function GamesScreen() {
  return (
    <TruthPosterScreen
      title="GAMES SCREEN"
      screenPath="app/screens/GamesScreen.js"
      screenStem="GamesScreen"
      primaryRoutes={["HomeScreen", "KamaHome", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["SeepTableScreen", "SeepRoundResultScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/mbw_luxscreens/art_main.png')}
    />
  );
}
