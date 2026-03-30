import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function VaultReserveScreen() {
  return (
    <TruthPosterScreen
      title="VAULT RESERVE SCREEN"
      screenPath="app/screens/__compensation/VaultReserveScreen.js"
      screenStem="VaultReserveScreen"
      primaryRoutes={["ArtMainLux", "GamesMainLux", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["TributeLedgerScreen", "StayCircleScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/main_hub.png')}
    />
  );
}
