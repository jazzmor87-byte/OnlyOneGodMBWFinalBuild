import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function CoinMarket() {
  return (
    <TruthPosterScreen
      title="COIN MARKET"
      screenPath="app/screens/Coins/CoinMarket.js"
      screenStem="CoinMarket"
      primaryRoutes={["CoinTrade", "CoinVault", "MasterOfCoinsMain", "HomeHub"]}
      secondaryRoutes={["HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/coin_main.png')}
    />
  );
}
