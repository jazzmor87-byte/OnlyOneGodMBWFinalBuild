import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function MerchProduct() {
  return (
    <TruthPosterScreen
      title="MERCH PRODUCT"
      screenPath="app/screens/Merchandise/MerchProduct.js"
      screenStem="MerchProduct"
      primaryRoutes={["MerchandiseScreen", "MerchMainLux", "MerchHome", "HomeHub"]}
      secondaryRoutes={["MerchHome", "MerchCheckout", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/vault_gallery.png')}
    />
  );
}
