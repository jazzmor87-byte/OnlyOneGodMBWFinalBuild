// MBW_SAFE_NAVIGATION_RUNTIME=HERMES_SAFE
export function safeNavigate(navigation, route, params) {
  if (!navigation || typeof navigation.navigate !== 'function' || !route) {
    return false;
  }
  try {
    if (params === undefined || params === null) {
      navigation.navigate(route);
    } else {
      navigation.navigate(route, params);
    }
    return true;
  } catch (error) {
    globalThis.MBW_SAFE_NAVIGATION_LAST_ERROR = String(error && error.message ? error.message : error);
    return false;
  }
}
