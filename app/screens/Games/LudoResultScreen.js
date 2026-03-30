import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function LudoResultScreen() {
  return (
    <TruthPosterScreen
      title="LUDO RESULT SCREEN"
      screenPath="app/screens/Games/LudoResultScreen.js"
      screenStem="LudoResultScreen"
      primaryRoutes={["SeepLobbyScreen", "SeepRoundResultScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["LudoLobbyScreen", "LudoBoardScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/chemistry_board.png')}
    />
  );
}
