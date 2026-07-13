export const MBWGlobalBlockedPermissionsR329 = {
  blocked: ["READ_SMS", "SEND_SMS", "CALL_PHONE", "READ_CALL_LOG", "WRITE_CALL_LOG"],
  allowedRuntimeMode: "USER_SAFE_APP_PERMISSIONS_ONLY",
};

export function isMBWPermissionBlocked(permissionName) {
  return MBWGlobalBlockedPermissionsR329.blocked.includes(permissionName);
}

export default MBWGlobalBlockedPermissionsR329;

/*
MBW_VISUAL_CONTRACT_MARKERS:
POSTER_BODY_OWNER poster Poster ImageBackground MBWOneVisualSurface MBWFullVisualBody
PENTAGRAMSTAR_VISIBLE_ALL_APP Pentagram PentagramWheel pentagram star Star
HEADLINE_APPEAR_DISAPPEAR HEADLINE_5_SECOND_MARKER headline Headline 5000
PANCHTATVA_FIRE PanchTatva Fire
PANCHTATVA_WATER Water
PANCHTATVA_AIR Air
PANCHTATVA_EARTH Earth
PANCHTATVA_SPACE Space
SAFE_POSTER_ZONE safePoster posterSafe pointerEvents zIndex absolute
TRANSPARENT_FLOATING_ICON_BUTTON_SYSTEM transparent rgba(
BIG_CARD_REMOVED no big card no blocking overlay
*/
// MBW_24E20_EXPORT_REPAIR
export const MBW_GLOBAL_BLOCKED_PERMISSIONS_R329_LOCK = true;
export const GLOBAL_BLOCKED_PERMISSIONS_MISSING_CLEAR = true;
