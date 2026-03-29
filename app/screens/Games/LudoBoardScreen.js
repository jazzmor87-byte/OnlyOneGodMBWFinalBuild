import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function LudoBoardScreen() {
  return (
    <TruthPosterScreen
      title="LUDO BOARD SCREEN"
      screenPath="app/screens/Games/LudoBoardScreen.js"
      screenStem="LudoBoardScreen"
      primaryRoutes={["LudoLobbyScreen", "LudoResultScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["GamesHubScreen", "ChallengesScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/art_main.png')}
    />
  );
}
