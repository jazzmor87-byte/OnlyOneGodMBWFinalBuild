import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function MasterOfCoinsMain() {
  return (
    <TruthPosterScreen
      title="MASTER OF COINS MAIN"
      screenPath="app/screens/__compensation/MasterOfCoinsMain.js"
      screenStem="MasterOfCoinsMain"
      primaryRoutes={["CoinsMainLux", "MBW_CoinOracleScreen_Poster_02", "CoinMarket", "HomeHub"]}
      secondaryRoutes={["CoinTraderHall", "CoinSeekerHall", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/master_of_coins.png')}
    />
  );
}
