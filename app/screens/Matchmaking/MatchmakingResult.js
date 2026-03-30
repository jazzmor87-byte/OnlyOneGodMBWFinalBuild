import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function MatchmakingResult() {
  return (
    <TruthPosterScreen
      title="MATCHMAKING RESULT"
      screenPath="app/screens/Matchmaking/MatchmakingResult.js"
      screenStem="MatchmakingResult"
      primaryRoutes={["MatchmakingScreen", "DesiredSignalsScreen", "MatchmakingHome", "HomeHub"]}
      secondaryRoutes={["MatchmakingHome", "MatchmakingFilters", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/matchmaking_main.png')}
    />
  );
}
