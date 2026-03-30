import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function BorderCrossingsScreen() {
  return (
    <TruthPosterScreen
      title="BORDER CROSSINGS SCREEN"
      screenPath="app/screens/__compensation/BorderCrossingsScreen.js"
      screenStem="BorderCrossingsScreen"
      primaryRoutes={["HostCircleScreen", "LocalTrailsScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["SeepScreen", "SeepArena", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/art_main.png')}
    />
  );
}
