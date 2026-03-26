import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function CoinSeekerHall() {
  return (
    <TruthPosterScreen
      title="COIN SEEKER HALL"
      screenPath="app/screens/__compensation/CoinSeekerHall.js"
      screenStem="CoinSeekerHall"
      primaryRoutes={["CoinTraderHall", "MasterOfCoinsMain", "CoinMarket", "HomeHub"]}
      secondaryRoutes={["CoinKeeperHall", "CoinExplorerHall", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/coin_seeker_hall.png')}
    />
  );
}
