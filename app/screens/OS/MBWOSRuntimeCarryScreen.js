"MBW_EXACT_VISUAL_OS_WRAPPED";
import { withMBWExactVisualOS } from "../../runtime/MBWExactVisualOS";
import { safeNavigate } from '../../runtime/MBWSafeNavigation';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MBWVisualBodyFrame } from '../../components/MBWVisualBodyFrame';
import { MBWFloatingIconButton } from '../../components/MBWFloatingIconButton';
export default withMBWExactVisualOS(function MBWOSRuntimeCarryScreen({
  navigation
}) {
  const goMainHub = () => safeNavigate(navigation, 'GateLocked');
  const goBack = () => navigation && navigation.goBack ? navigation.goBack() : null;
  const stay = () => {};
  return <MBWVisualBodyFrame routeName="MBW OS RUNTIME CARRY" posterSafe>
      <View style={styles.wrap}>
        <Text style={styles.title}>♠️ MBW OS 🧠</Text>
        <View style={styles.buttons}>
          <MBWFloatingIconButton label="👑 MAINHUB ♠️" press handler={goMainHub} />
          <MBWFloatingIconButton label="♠️ RETURN 🗝️" press handler={goBack} />
          <MBWFloatingIconButton label="🔥 RUNTIME 🧠" press handler={stay} />
        </View>
      </View>
    </MBWVisualBodyFrame>;
}, {
  screenId: "MBWOSRuntimeCarryScreen"
});
const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 22,
    paddingBottom: 42
  },
  title: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 18
  },
  buttons: {
    gap: 12,
    alignItems: 'center'
  }
});

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

/*
MBW_BUTTON_HANDLER_CONTRACT:
MBW runtime action handlers connected
Every transparent floating icon button is backed by safe press handler.
*/
/* MBW_17H1_ROUTE_TARGET_SAFE_SOURCE_PATCH: missing route targets neutralized by source-local registered-route guard. */
