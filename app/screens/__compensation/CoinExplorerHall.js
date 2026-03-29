import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function CoinExplorerHall() {
  return (
    <TruthPosterScreen
      title="COIN EXPLORER HALL"
      screenPath="app/screens/__compensation/CoinExplorerHall.js"
      screenStem="CoinExplorerHall"
      primaryRoutes={["CoinKeeperHall", "CoinSeekerHall", "CoinMarket", "MasterOfCoinsMain", "HomeHub"]}
      secondaryRoutes={["CoinVault", "CoinTrade", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/coin_explorer_hall.png')}
    />
  );
}
