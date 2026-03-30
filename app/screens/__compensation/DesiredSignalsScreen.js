import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function DesiredSignalsScreen() {
  return (
    <TruthPosterScreen
      title="DESIRED SIGNALS SCREEN"
      screenPath="app/screens/__compensation/DesiredSignalsScreen.js"
      screenStem="DesiredSignalsScreen"
      primaryRoutes={["MatchIntelligenceScreen", "MatchDetailLux", "MatchmakingScreen", "MatchmakingHome", "HomeHub"]}
      secondaryRoutes={["MatchmakingScreen", "MatchmakingResult", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/match_extra.png')}
    />
  );
}
