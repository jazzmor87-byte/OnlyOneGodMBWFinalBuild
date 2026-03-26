import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function UserHome() {
  return (
    <TruthPosterScreen
      title="USER HOME"
      screenPath="app/screens/home/UserHome.js"
      screenStem="UserHome"
      primaryRoutes={["ArtMain", "GamesMain", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["subscription_main", "signup_main", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/art_main.png')}
    />
  );
}
