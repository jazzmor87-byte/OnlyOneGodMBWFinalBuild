import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function CoinTrade() {
  return (
    <TruthPosterScreen
      title="COIN TRADE"
      screenPath="app/screens/Coins/CoinTrade.js"
      screenStem="CoinTrade"
      primaryRoutes={["CoinVault", "CoinExplorerHall", "CoinMarket", "MasterOfCoinsMain", "HomeHub"]}
      secondaryRoutes={["CoinMarket", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/coin_oracle.png')}
    />
  );
}
