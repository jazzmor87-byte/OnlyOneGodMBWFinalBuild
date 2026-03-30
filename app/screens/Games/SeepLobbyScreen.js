import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function SeepLobbyScreen() {
  return (
    <TruthPosterScreen
      title="SEEP LOBBY SCREEN"
      screenPath="app/screens/Games/SeepLobbyScreen.js"
      screenStem="SeepLobbyScreen"
      primaryRoutes={["SeepRoundResultScreen", "SeepTableScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["LudoResultScreen", "LudoLobbyScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/art_main.png')}
    />
  );
}
