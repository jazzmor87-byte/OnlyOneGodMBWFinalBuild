import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function MerchandiseScreen() {
  return (
    <TruthPosterScreen
      title="MERCHANDISE SCREEN"
      screenPath="app/screens/MerchandiseScreen.js"
      screenStem="MerchandiseScreen"
      primaryRoutes={["MerchMainLux", "merch_main", "MerchHome", "HomeHub"]}
      secondaryRoutes={["MerchProduct", "MerchHome", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/finalux/merch_main.png')}
    />
  );
}
