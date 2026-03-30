import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function _Main3DFactory() {
  return (
    <TruthPosterScreen
      title="MAIN3DFACTORY"
      screenPath="app/screens/main3d/_Main3DFactory.js"
      screenStem="_Main3DFactory"
      primaryRoutes={["GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["GamesMain", "ArtMain", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/art_main.png')}
    />
  );
}
