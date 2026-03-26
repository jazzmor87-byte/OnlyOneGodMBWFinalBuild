import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function CoinsMain() {
  return (
    <TruthPosterScreen
      title="COINS MAIN"
      screenPath="app/screens/main3d/CoinsMain.js"
      screenStem="CoinsMain"
      primaryRoutes={["CoinMarket", "MasterOfCoinsMain", "HomeHub"]}
      secondaryRoutes={["wallet_main", "coin_main", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/mint_stories.png')}
    />
  );
}
