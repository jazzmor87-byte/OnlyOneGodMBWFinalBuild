import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function MintStoriesScreen() {
  return (
    <TruthPosterScreen
      title="MINT STORIES SCREEN"
      screenPath="app/screens/__compensation/MintStoriesScreen.js"
      screenStem="MintStoriesScreen"
      primaryRoutes={["NomadCircuitMain", "StayCircleScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["LocalTrailsScreen", "HostCircleScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/art_main.png')}
    />
  );
}
