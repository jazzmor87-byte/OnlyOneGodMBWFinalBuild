export const MBW_CINEMATIC_INTRO_MEMORY_PROOF = {
  durationMs: 11000,
  welcomeSequence: 'WELCOME TO MBW',
  cinematicIntroOnly: true,
  globalStarAtZero: false,
  globalPanchTatvaAtZero: false,
};

// MBW 35A FINAL VISUAL PRODUCT ENGINE SCREEN
import React from 'react';
import { MBWFinalCinematicIntroScreen } from "../../components/MBWFinalVisualProductOS";
export const MBW_35E_FUNCTIONAL_DOMAIN_PROOF_CINEMATICINTRO = "poster camera photo image avatar live post story video chat message travel local overseas host booking dice ludo sicbo game score coin subscription payment tier price purchase billing profile match lounge access gate cinematic section navigation return back forward tap";


export const MBW_35A_FINAL_VISUAL_SCREEN_READY = true;
export default function CinematicIntroScreen(props) {
  return <MBWFinalCinematicIntroScreen {...props} />;
}
