import "react-native-gesture-handler";
import React from "react";
import AppNavigator from "./AppNavigator";
import { SecondMAMBoundary } from "./app/core/SecondMAM";
export default function App(){return <SecondMAMBoundary><AppNavigator /></SecondMAMBoundary>;}