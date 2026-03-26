import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function AllScreensHub() {
  return (
    <TruthPosterScreen
      title="ALL SCREENS HUB"
      screenPath="app/screens/AllScreensHub.js"
      screenStem="AllScreensHub"
      primaryRoutes={["ChallengesScreen", "GamesHubScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/finalux/art_main.png')}
    />
  );
}
