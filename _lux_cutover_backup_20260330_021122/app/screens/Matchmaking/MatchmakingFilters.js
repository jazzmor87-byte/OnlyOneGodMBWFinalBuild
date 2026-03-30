import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function MatchmakingFilters() {
  return (
    <TruthPosterScreen
      title="MATCHMAKING FILTERS"
      screenPath="app/screens/Matchmaking/MatchmakingFilters.js"
      screenStem="MatchmakingFilters"
      primaryRoutes={["MatchmakingHome", "MatchmakingResult", "MatchmakingScreen", "HomeHub"]}
      secondaryRoutes={["HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/desire_compass.png')}
    />
  );
}
