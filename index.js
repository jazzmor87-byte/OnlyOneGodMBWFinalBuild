import 'react-native-url-polyfill/auto';
// MBW_SOVEREIGN_ROOT_V14
import React from 'react';
import { registerRootComponent } from 'expo';
import App from './App';
import { MBWSovereignBoundary } from './app/sovereign/MBWSovereignBoundary';
import { getMBWSovereignRuntimeSnapshot } from './app/sovereign/MBWSovereignRuntime';
import { MBWUserSeedProvider } from './app/runtime/MBWUserSeedProvider';
import { MBWUniversalSeedProviderV21 } from './app/runtime/MBWUniversalSeedProviderV21';
/* MBW_APK_EXTRACTED_SEED_UNIVERSAL_V21 */

function MBWSovereignRoot() {
  getMBWSovereignRuntimeSnapshot();
  return (
    <MBWUniversalSeedProviderV21>
      <MBWUserSeedProvider>
      <MBWSovereignBoundary>
        <App />
      </MBWSovereignBoundary>
    </MBWUserSeedProvider>
    </MBWUniversalSeedProviderV21>
  );
}

registerRootComponent(MBWSovereignRoot);
