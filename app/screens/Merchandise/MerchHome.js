import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function MerchHome() {
  return (
    <TruthPosterScreen
      title="MERCH HOME"
      screenPath="app/screens/Merchandise/MerchHome.js"
      screenStem="MerchHome"
      primaryRoutes={["MerchProduct", "MerchandiseScreen", "HomeHub"]}
      secondaryRoutes={["MerchCheckout", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/merchandise_vault.png')}
    />
  );
}
