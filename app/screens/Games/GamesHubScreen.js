import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function GamesHubScreen() {
  return (
    <TruthPosterScreen
      title="GAMES HUB SCREEN"
      screenPath="app/screens/Games/GamesHubScreen.js"
      screenStem="GamesHubScreen"
      primaryRoutes={["LudoBoardScreen", "LudoLobbyScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["ChallengesScreen", "AllScreensHub", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/chemistry_board.png')}
    />
  );
}
