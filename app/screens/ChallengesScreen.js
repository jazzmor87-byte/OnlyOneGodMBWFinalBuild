import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function ChallengesScreen() {
  return (
    <TruthPosterScreen
      title="CHALLENGES SCREEN"
      screenPath="app/screens/ChallengesScreen.js"
      screenStem="ChallengesScreen"
      primaryRoutes={["GamesHubScreen", "LudoBoardScreen", "GamesScreen", "KamashastraScreen", "HomeHub"]}
      secondaryRoutes={["AllScreensHub", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/finalux/games_main.png')}
    />
  );
}
