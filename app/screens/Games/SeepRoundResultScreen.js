import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function SeepRoundResultScreen() {
  return (
    <TruthPosterScreen
      title="SEEP ROUND RESULT SCREEN"
      screenPath="app/screens/Games/SeepRoundResultScreen.js"
      screenStem="SeepRoundResultScreen"
      primaryRoutes={["SeepTableScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["SeepLobbyScreen", "LudoResultScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/games_main.png')}
    />
  );
}
