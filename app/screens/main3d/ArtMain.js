import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function ArtMain() {
  return (
    <TruthPosterScreen
      title="ART MAIN"
      screenPath="app/screens/main3d/ArtMain.js"
      screenStem="ArtMain"
      primaryRoutes={["GamesMain", "_Main3DFactory", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["UserHome", "subscription_main", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/games_main.png')}
    />
  );
}
