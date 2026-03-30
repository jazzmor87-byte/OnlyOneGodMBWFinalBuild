import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function CoinTraderHall() {
  return (
    <TruthPosterScreen
      title="COIN TRADER HALL"
      screenPath="app/screens/__compensation/CoinTraderHall.js"
      screenStem="CoinTraderHall"
      primaryRoutes={["MasterOfCoinsMain", "CoinsMainLux", "CoinMarket", "HomeHub"]}
      secondaryRoutes={["CoinSeekerHall", "CoinKeeperHall", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/coin_main.png')}
    />
  );
}
