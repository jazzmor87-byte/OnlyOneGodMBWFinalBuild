import React from 'react';
import TruthPosterScreen from './_TruthPosterScreen';

export default function MBWHome() {
  return (
    <TruthPosterScreen
      title="MBWHOME"
      screenPath="app/screens/MBWHome.js"
      screenStem="MBWHome"
      primaryRoutes={["RealmHome", "RealmPrivilegesScreen", "HomeHub"]}
      secondaryRoutes={["HomeHub", "RealmHome"]}
      primaryLabel="Continue"
      secondaryLabel="Home"
      fallbackAsset={require("../assets/mbw_luxscreens/mb's_world_entry.png")}
    />
  );
}
