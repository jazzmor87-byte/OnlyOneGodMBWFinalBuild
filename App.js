import { MBWDarkMatterProductionStage, MBWDarkMatterProductionVisualOS, getMBWActiveRouteName, publishMBWActiveRoute } from "./app/runtime/MBWDarkMatterProductionVisualOS";
import React from 'react';
import { DarkTheme, NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import MBWGoldenMasterNavigator from "./app/production/sovereign/MBWGoldenMasterNavigator";
import { MBWGoldenMasterProvider } from "./app/production/sovereign/MBWGoldenMasterStore";
import { MBWProductionProvider } from './app/production/MBWProductionProvider';
import { MBWProductionErrorBoundary } from './app/production/MBWProductionErrorBoundary';
import { mbwDarkMatterNavigationRef, mbwDarkMatterOnNavigationReady, mbwDarkMatterOnNavigationStateChange } from './app/darkmatter/MBWDarkMatterOmegaPrimeNavigation';
const __mbwProductionNavigationRef = createNavigationContainerRef();
const MBW_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#030101',
    card: '#030101',
    primary: '#e4bb62',
    text: '#ffe8aa',
    border: 'rgba(228,187,98,0.24)',
    notification: '#6d1228'
  }
};
export default function App() {
  return <><MBWGoldenMasterProvider>
      <MBWProductionProvider>
        <MBWProductionErrorBoundary>
      <StatusBar style="light" hidden={false} />
      <MBWDarkMatterProductionStage><NavigationContainer ref={mbwDarkMatterNavigationRef} theme={MBW_THEME} onReady={() => {
              const __mbwOldReadyHandler = mbwDarkMatterOnNavigationReady;
              if (typeof __mbwOldReadyHandler === "function") __mbwOldReadyHandler();
              const __mbwReadyNavigation = mbwDarkMatterNavigationRef && mbwDarkMatterNavigationRef.current ? mbwDarkMatterNavigationRef.current : mbwDarkMatterNavigationRef;
              if (__mbwReadyNavigation && typeof __mbwReadyNavigation.getRootState === "function") {
                publishMBWActiveRoute(getMBWActiveRouteName(__mbwReadyNavigation.getRootState()));
              }
            }} onStateChange={__mbwState => {
              const __mbwOldStateChange = mbwDarkMatterOnNavigationStateChange;
              if (typeof __mbwOldStateChange === "function") __mbwOldStateChange(__mbwState);
              publishMBWActiveRoute(getMBWActiveRouteName(__mbwState));
            }}>
        <MBWGoldenMasterNavigator />
      </NavigationContainer></MBWDarkMatterProductionStage>
        </MBWProductionErrorBoundary>
      </MBWProductionProvider>
    </MBWGoldenMasterProvider>
<MBWDarkMatterProductionVisualOS /></>;
}
