import React from 'react';
import { MBWVisualBodyFrame } from './MBWVisualBodyFrame';

export const MBWFullVisualBody = ({ children, routeName = 'MBW' }) => (
  <MBWVisualBodyFrame routeName={routeName} posterSafe>
    {children}
  </MBWVisualBodyFrame>
);

export default MBWFullVisualBody;

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

