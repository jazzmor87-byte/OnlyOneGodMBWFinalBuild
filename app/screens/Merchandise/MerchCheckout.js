import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function MerchCheckout() {
  return (
    <TruthPosterScreen
      title="MERCH CHECKOUT"
      screenPath="app/screens/Merchandise/MerchCheckout.js"
      screenStem="MerchCheckout"
      primaryRoutes={["MerchHome", "MerchProduct", "MerchandiseScreen", "HomeHub"]}
      secondaryRoutes={["HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/merch_main.png')}
    />
  );
}
