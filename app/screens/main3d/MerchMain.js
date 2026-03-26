import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function MerchMain() {
  return (
    <TruthPosterScreen
      title="MERCH MAIN"
      screenPath="app/screens/main3d/MerchMain.js"
      screenStem="MerchMain"
      primaryRoutes={["MerchandiseScreen", "MerchHome", "HomeHub"]}
      secondaryRoutes={["merch_main", "MerchMainLux", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/merch_main.png')}
    />
  );
}
