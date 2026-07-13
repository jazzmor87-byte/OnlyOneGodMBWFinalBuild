import React from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import MBWGoldenMasterNavigator from './app/golden/MBWGoldenMasterNavigator';
import { MBWGoldenMasterProvider } from './app/golden/MBWGoldenMasterStore';

const MBW_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#030101',
    card: '#030101',
    primary: '#e4bb62',
    text: '#ffe8aa',
    border: 'rgba(228,187,98,0.24)',
    notification: '#6d1228',
  },
};

export default function App() {
  return (
    <MBWGoldenMasterProvider>
      <StatusBar style="light" hidden={false} />
      <NavigationContainer theme={MBW_THEME}>
        <MBWGoldenMasterNavigator />
      </NavigationContainer>
    </MBWGoldenMasterProvider>
  );
}
