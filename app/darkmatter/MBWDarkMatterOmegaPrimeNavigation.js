import { createNavigationContainerRef } from '@react-navigation/native';
import {
  mbwDarkMatterInitialize,
  mbwDarkMatterObserve,
  mbwDarkMatterRecordRoute,
  mbwDarkMatterProve,
} from './MBWDarkMatterOmegaPrimeEngine';

export const mbwDarkMatterNavigationRef = createNavigationContainerRef();

function currentRouteName() {
  return mbwDarkMatterNavigationRef.isReady()
    ? mbwDarkMatterNavigationRef.getCurrentRoute()?.name || null
    : null;
}

export function mbwDarkMatterOnNavigationReady() {
  mbwDarkMatterInitialize();
  const route = currentRouteName();
  mbwDarkMatterRecordRoute(route);
  mbwDarkMatterProve('NAVIGATION_READY', { route });
}

export function mbwDarkMatterOnNavigationStateChange() {
  const route = currentRouteName();
  mbwDarkMatterRecordRoute(route);
  mbwDarkMatterObserve('NAVIGATION_STATE', { route });
}
