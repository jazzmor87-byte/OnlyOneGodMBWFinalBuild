import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function MatchmakingMain() {
  return (
    <TruthPosterScreen
      title="MATCHMAKING MAIN"
      screenPath="app/screens/main3d/MatchmakingMain.js"
      screenStem="MatchmakingMain"
      primaryRoutes={["MatchmakingScreen", "MatchmakingHome", "HomeHub"]}
      secondaryRoutes={["private_chat", "members_near_you", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/finalux/match_intelligence.png')}
    />
  );
}
