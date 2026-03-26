import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function SeepTableScreen() {
  return (
    <TruthPosterScreen
      title="SEEP TABLE SCREEN"
      screenPath="app/screens/Games/SeepTableScreen.js"
      screenStem="SeepTableScreen"
      primaryRoutes={["GamesScreen", "HomeScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["SeepRoundResultScreen", "SeepLobbyScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/chemistry_board.png')}
    />
  );
}
