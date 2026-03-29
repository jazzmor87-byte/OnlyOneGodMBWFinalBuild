import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GateOpenCinematic from "./app/screens/Gate/GateOpenCinematic";
import GateLockedScreen from "./app/screens/Gate/GateLockedScreen";
import GateOpenAfterUnlock from "./app/screens/Gate/GateOpenAfterUnlock";
import PathSelectionScreen from "./app/screens/Gate/PathSelectionScreen";
import LoginLux from "./app/screens/finalux/LoginLux";
import SignupLux from "./app/screens/finalux/SignupLux";
import RecoveryHub from "./app/screens/recovery/RecoveryHub";
import { AUTO_REGISTRY } from "./app/screens/recovery/AutoRegistry";

const Stack = createNativeStackNavigator();
const BLOCKED = new Set([
  "GateOpenCinematic","GateLocked","GateLockedScreen","GateOpenAfterUnlock",
  "PathSelection","PathSelectionScreen","Login","Signup","LoginLux","SignupLux","RecoveryHub"
]);
const AUTO_ROUTE_NAMES = Object.keys(AUTO_REGISTRY).filter((n) => !BLOCKED.has(n)).sort();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GateOpenCinematic" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GateOpenCinematic" component={GateOpenCinematic} />
        <Stack.Screen name="GateLocked" component={GateLockedScreen} />
        <Stack.Screen name="GateLockedScreen" component={GateLockedScreen} />
        <Stack.Screen name="GateOpenAfterUnlock" component={GateOpenAfterUnlock} />
        <Stack.Screen name="PathSelection" component={PathSelectionScreen} />
        <Stack.Screen name="PathSelectionScreen" component={PathSelectionScreen} />
        <Stack.Screen name="Login" component={LoginLux} />
        <Stack.Screen name="Signup" component={SignupLux} />
        <Stack.Screen name="LoginLux" component={LoginLux} />
        <Stack.Screen name="SignupLux" component={SignupLux} />
        <Stack.Screen name="RecoveryHub" component={RecoveryHub} />
        {AUTO_ROUTE_NAMES.map((name) => (
          <Stack.Screen key={name} name={name} component={AUTO_REGISTRY[name]} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
