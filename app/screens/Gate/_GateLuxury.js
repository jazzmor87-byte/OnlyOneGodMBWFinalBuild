import React from 'react';
import TruthPosterScreen from '../_TruthPosterScreen';

export default function _GateLuxury() {
  return (
    <TruthPosterScreen
      title="GATE LUXURY"
      screenPath="app/screens/Gate/_GateLuxury.js"
      screenStem="_GateLuxury"
      primaryRoutes={["GateCinematic", "GateScreen", "PathSelectionScreen", "Login", "Signup", "Subscription"]}
      secondaryRoutes={["_EntryStaticScreen", "PathSelectionScreen", "HomeHub", "MBWHome", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require('../../assets/mbw_luxscreens/main_hub.png')}
    />
  );
}
