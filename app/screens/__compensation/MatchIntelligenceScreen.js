import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function MatchIntelligenceScreen() {
  return (
    <TruthPosterScreen
      title="MATCH INTELLIGENCE SCREEN"
      screenPath="app/screens/__compensation/MatchIntelligenceScreen.js"
      screenStem="MatchIntelligenceScreen"
      primaryRoutes={["MatchDetailLux", "MatchExtraLux", "MatchmakingScreen", "MatchmakingHome", "HomeHub"]}
      secondaryRoutes={["DesiredSignalsScreen", "MatchmakingScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/match_found.png')}
    />
  );
}
