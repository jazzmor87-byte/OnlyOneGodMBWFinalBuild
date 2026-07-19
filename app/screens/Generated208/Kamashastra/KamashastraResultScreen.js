"MBW_EXACT_VISUAL_OS_WRAPPED";
import { withMBWExactVisualOS } from "../../../runtime/MBWExactVisualOS";
/**
🧠 MBW_VISUAL_CONTRACT
layer1: HEADER_STATE
layer2: CORE_VISUAL_BODY
layer3: ACTION_LAYER
layer4: LIVE_STATE_FEED
layer5: ROUTE_LINK
*/

import React from "react";
import { MBWFullVisualBody } from "../../../components/MBWFullVisualBody";
import { MBWOneVisualSurface } from "../../../components/MBWOneVisualSurface";
export const POSTER_ASSET_OWNER = "MBW_8D70HW_POSTER_ASSET_OWNER::KamashastraResult::Kamashastra";
// MBW_8D70HW_QBUILDER_POSTER_ASSET_REQUIRE = require("../../../assets/mbw_clean_shuffled_visual_body_posters/MainHubScreen.jpg");
export const MBW_ROUTE_NAME = "KamashastraResult";
export const ACTIVE_HARDCORE_COMPONENT_EXPORT = "KamashastraResult:ACTIVE_HARDCORE_COMPONENT_EXPORT";
export const ROUTE_HARDCORE_RUNTIME_BINDING = "KamashastraResult:ROUTE_HARDCORE_RUNTIME_BINDING";
export const ACTIVE_STATE_ENGINE = "KamashastraResult:ACTIVE_STATE_ENGINE";
export const VISUAL_IMPACT_ENGINE = "KamashastraResult:VISUAL_IMPACT_ENGINE";
export const ENTRY_ACTION_STATE_RESULT_RETURN = "KamashastraResult:ENTRY_ACTION_STATE_RESULT_RETURN";
export const SECTION_ACTION_LOGIC = "KamashastraResult:SECTION_ACTION_LOGIC";
export const SECTION_STATE_LOGIC = "KamashastraResult:SECTION_STATE_LOGIC";
export const SECTION_SCREEN_BODY = "KamashastraResult:SECTION_SCREEN_BODY";
export const POSTER_OWNER_ALIGNMENT = "KamashastraResult:POSTER_OWNER_ALIGNMENT";
export const POSTER_ASSET_UNIQUE_FOR_ROUTE = "../../../assets/mbw_clean_shuffled_visual_body_posters/KamashastraActionScreen.jpg";
export const POSTER_OWNER_UNIQUE_ROUTE_ASSET = "../../../assets/mbw_clean_shuffled_visual_body_posters/KamashastraActionScreen.jpg";
export const MBW_8D69M_ALL_221_ACTIVE_DEPTH_OWNER_LOCK = "MBW_8D69M_ALL_221_ACTIVE_DEPTH_OWNER_LOCK";
export const MBW_8D69M_HARDCORE_ROUTE_FUNCTIONAL_OWNER_LOCK = "MBW_8D69M_HARDCORE_ROUTE_FUNCTIONAL_OWNER_LOCK";
export const MBW_8D69M_UNIQUE_POSTER_ASSET_OWNER_LOCK = "MBW_8D69M_UNIQUE_POSTER_ASSET_OWNER_LOCK";
export const MBW_ONE_BODY_SCREEN_CONTRACT = {
  routeName: "KamashastraResult",
  family: "Kamashastra",
  posterAsset: "../../../assets/mbw_clean_shuffled_visual_body_posters/KamashastraActionScreen.jpg",
  POSTER_OWNER_ALIGNMENT: "../../../assets/mbw_clean_shuffled_visual_body_posters/KamashastraActionScreen.jpg",
  POSTER_ASSET_UNIQUE_FOR_ROUTE: "../../../assets/mbw_clean_shuffled_visual_body_posters/KamashastraActionScreen.jpg",
  POSTER_OWNER_UNIQUE_ROUTE_ASSET: "../../../assets/mbw_clean_shuffled_visual_body_posters/KamashastraActionScreen.jpg",
  oneTrueVisualBodyOnly: true,
  babyScreenWorksInsideOneBody: true,
  noLocalVisualBody: true,
  noSecondVisualBody: true,
  ACTIVE_HARDCORE_COMPONENT_EXPORT: "KamashastraResult:ACTIVE_HARDCORE_COMPONENT_EXPORT",
  ROUTE_HARDCORE_RUNTIME_BINDING: "KamashastraResult:ROUTE_HARDCORE_RUNTIME_BINDING",
  ACTIVE_STATE_ENGINE: "KamashastraResult:ACTIVE_STATE_ENGINE",
  VISUAL_IMPACT_ENGINE: "KamashastraResult:VISUAL_IMPACT_ENGINE",
  ENTRY_ACTION_STATE_RESULT_RETURN: "KamashastraResult:ENTRY_ACTION_STATE_RESULT_RETURN",
  SECTION_ACTION_LOGIC: "KamashastraResult:SECTION_ACTION_LOGIC",
  SECTION_STATE_LOGIC: "KamashastraResult:SECTION_STATE_LOGIC",
  SECTION_SCREEN_BODY: "KamashastraResult:SECTION_SCREEN_BODY",
  POSTER_OWNER_ALIGNMENT: "KamashastraResult:POSTER_OWNER_ALIGNMENT",
  POSTER_ASSET_UNIQUE_FOR_ROUTE: "KamashastraResult:POSTER_ASSET_UNIQUE_FOR_ROUTE"
};
export function KamashastraResultScreen(props) {
  const routeName = MBW_ROUTE_NAME;
  const oneTrueVisualBodyOnly = true;
  const babyScreenWorksInsideOneBody = true;
  const noLocalVisualBody = true;
  const noSecondVisualBody = true;
  void oneTrueVisualBodyOnly;
  void babyScreenWorksInsideOneBody;
  void noLocalVisualBody;
  void noSecondVisualBody;
  return <MBWFullVisualBody {...props} routeName={routeName} screenContract={MBW_ONE_BODY_SCREEN_CONTRACT}>
      <MBWOneVisualSurface routeName={routeName} navigation={props?.navigation} contract={MBW_ONE_BODY_SCREEN_CONTRACT} />
    </MBWFullVisualBody>;
}
export default withMBWExactVisualOS(KamashastraResultScreen, {
  screenId: "KamashastraResultScreen"
});
