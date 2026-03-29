import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function CoinVault() {
  return (
    <TruthPosterScreen
      title="COIN VAULT"
      screenPath="app/screens/Coins/CoinVault.js"
      screenStem="CoinVault"
      primaryRoutes={["CoinExplorerHall", "CoinKeeperHall", "CoinMarket", "MasterOfCoinsMain", "HomeHub"]}
      secondaryRoutes={["CoinTrade", "CoinMarket", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/wallet_main.png')}
    />
  );
}
