import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GateCinematic from './app/screens/GateCinematic';
import GateLockedScreen from './app/screens/Gate/GateLockedScreen';
import GateOpenAfterUnlock from './app/screens/Gate/GateOpenAfterUnlock';
import PathSelectionScreen from './app/screens/Gate/PathSelectionScreen';
import UserHome from './app/screens/home/UserHome';
import MBWHome from './app/screens/home/MBWHome';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GateCinematic" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GateCinematic" component={GateCinematic} />
        <Stack.Screen name="GateLockedScreen" component={GateLockedScreen} />
        <Stack.Screen name="GateOpenAfterUnlock" component={GateOpenAfterUnlock} />
        <Stack.Screen name="PathSelectionScreen" component={PathSelectionScreen} />
        <Stack.Screen name="UserHome" component={UserHome} />
        <Stack.Screen name="MBWHome" component={MBWHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
