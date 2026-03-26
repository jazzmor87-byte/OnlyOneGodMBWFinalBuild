import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function GamesMain() {
  return (
    <TruthPosterScreen
      title="GAMES MAIN"
      screenPath="app/screens/main3d/GamesMain.js"
      screenStem="GamesMain"
      primaryRoutes={["_Main3DFactory", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["ArtMain", "UserHome", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/chemistry_board.png')}
    />
  );
}
