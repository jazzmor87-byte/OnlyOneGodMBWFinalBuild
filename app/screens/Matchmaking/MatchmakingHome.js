import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function MatchmakingHome() {
  return (
    <TruthPosterScreen
      title="MATCHMAKING HOME"
      screenPath="app/screens/Matchmaking/MatchmakingHome.js"
      screenStem="MatchmakingHome"
      primaryRoutes={["MatchmakingResult", "MatchmakingScreen", "HomeHub"]}
      secondaryRoutes={["MatchmakingFilters", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/desired_signals.png')}
    />
  );
}
