import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function HostCircleScreen() {
  return (
    <TruthPosterScreen
      title="HOST CIRCLE SCREEN"
      screenPath="app/screens/__compensation/HostCircleScreen.js"
      screenStem="HostCircleScreen"
      primaryRoutes={["LocalTrailsScreen", "MintStoriesScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["BorderCrossingsScreen", "SeepScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/games_main.png')}
    />
  );
}
