import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function MatchmakingScreen() {
  return (
    <TruthPosterScreen
      title="MATCHMAKING SCREEN"
      screenPath="app/screens/MatchmakingScreen.js"
      screenStem="MatchmakingScreen"
      primaryRoutes={["DesiredSignalsScreen", "MatchIntelligenceScreen", "MatchmakingHome", "HomeHub"]}
      secondaryRoutes={["MatchmakingResult", "MatchmakingHome", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../assets/mbw_luxscreens/match_details.png')}
    />
  );
}
