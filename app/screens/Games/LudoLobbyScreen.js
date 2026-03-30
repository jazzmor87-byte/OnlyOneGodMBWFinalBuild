import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function LudoLobbyScreen() {
  return (
    <TruthPosterScreen
      title="LUDO LOBBY SCREEN"
      screenPath="app/screens/Games/LudoLobbyScreen.js"
      screenStem="LudoLobbyScreen"
      primaryRoutes={["LudoResultScreen", "SeepLobbyScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["LudoBoardScreen", "GamesHubScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/main_hub.png')}
    />
  );
}
