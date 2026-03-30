import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function CoinKeeperHall() {
  return (
    <TruthPosterScreen
      title="COIN KEEPER HALL"
      screenPath="app/screens/__compensation/CoinKeeperHall.js"
      screenStem="CoinKeeperHall"
      primaryRoutes={["CoinSeekerHall", "CoinTraderHall", "CoinMarket", "MasterOfCoinsMain", "HomeHub"]}
      secondaryRoutes={["CoinExplorerHall", "CoinVault", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/wallet_main.png')}
    />
  );
}
