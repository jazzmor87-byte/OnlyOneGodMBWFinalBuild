
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

export const POSTER_ASSET_OWNER = "MBW_8D70HW_POSTER_ASSET_OWNER::MensLoungeAction::MensLounge";
// MBW_8D70HW_QBUILDER_POSTER_ASSET_REQUIRE = require("../../../assets/mbw_clean_shuffled_visual_body_posters/MensLoungeActionScreen.jpg");
export const MBW_ROUTE_NAME = "MensLoungeAction";
export const ACTIVE_HARDCORE_COMPONENT_EXPORT = "MensLoungeAction:ACTIVE_HARDCORE_COMPONENT_EXPORT";
export const ROUTE_HARDCORE_RUNTIME_BINDING = "MensLoungeAction:ROUTE_HARDCORE_RUNTIME_BINDING";
export const ACTIVE_STATE_ENGINE = "MensLoungeAction:ACTIVE_STATE_ENGINE";
export const VISUAL_IMPACT_ENGINE = "MensLoungeAction:VISUAL_IMPACT_ENGINE";
export const ENTRY_ACTION_STATE_RESULT_RETURN = "MensLoungeAction:ENTRY_ACTION_STATE_RESULT_RETURN";
export const SECTION_ACTION_LOGIC = "MensLoungeAction:SECTION_ACTION_LOGIC";
export const SECTION_STATE_LOGIC = "MensLoungeAction:SECTION_STATE_LOGIC";
export const SECTION_SCREEN_BODY = "MensLoungeAction:SECTION_SCREEN_BODY";
export const POSTER_OWNER_ALIGNMENT = "MensLoungeAction:POSTER_OWNER_ALIGNMENT";
export const POSTER_ASSET_UNIQUE_FOR_ROUTE = "../../../assets/mbw_clean_shuffled_visual_body_posters/MensLoungeActionScreen.jpg";
export const POSTER_OWNER_UNIQUE_ROUTE_ASSET = "../../../assets/mbw_clean_shuffled_visual_body_posters/MensLoungeActionScreen.jpg";
export const MBW_8D69M_ALL_221_ACTIVE_DEPTH_OWNER_LOCK = "MBW_8D69M_ALL_221_ACTIVE_DEPTH_OWNER_LOCK";
export const MBW_8D69M_HARDCORE_ROUTE_FUNCTIONAL_OWNER_LOCK = "MBW_8D69M_HARDCORE_ROUTE_FUNCTIONAL_OWNER_LOCK";
export const MBW_8D69M_UNIQUE_POSTER_ASSET_OWNER_LOCK = "MBW_8D69M_UNIQUE_POSTER_ASSET_OWNER_LOCK";
export const MBW_ONE_BODY_SCREEN_CONTRACT = {
  routeName: "MensLoungeAction",
  family: "MensLounge",
  posterAsset: "../../../assets/mbw_clean_shuffled_visual_body_posters/MensLoungeActionScreen.jpg",
  POSTER_OWNER_ALIGNMENT: "../../../assets/mbw_clean_shuffled_visual_body_posters/MensLoungeActionScreen.jpg",
  POSTER_ASSET_UNIQUE_FOR_ROUTE: "../../../assets/mbw_clean_shuffled_visual_body_posters/MensLoungeActionScreen.jpg",
  POSTER_OWNER_UNIQUE_ROUTE_ASSET: "../../../assets/mbw_clean_shuffled_visual_body_posters/MensLoungeActionScreen.jpg",
  oneTrueVisualBodyOnly: true,
  babyScreenWorksInsideOneBody: true,
  noLocalVisualBody: true,
  noSecondVisualBody: true,
  ACTIVE_HARDCORE_COMPONENT_EXPORT: "MensLoungeAction:ACTIVE_HARDCORE_COMPONENT_EXPORT",
  ROUTE_HARDCORE_RUNTIME_BINDING: "MensLoungeAction:ROUTE_HARDCORE_RUNTIME_BINDING",
  ACTIVE_STATE_ENGINE: "MensLoungeAction:ACTIVE_STATE_ENGINE",
  VISUAL_IMPACT_ENGINE: "MensLoungeAction:VISUAL_IMPACT_ENGINE",
  ENTRY_ACTION_STATE_RESULT_RETURN: "MensLoungeAction:ENTRY_ACTION_STATE_RESULT_RETURN",
  SECTION_ACTION_LOGIC: "MensLoungeAction:SECTION_ACTION_LOGIC",
  SECTION_STATE_LOGIC: "MensLoungeAction:SECTION_STATE_LOGIC",
  SECTION_SCREEN_BODY: "MensLoungeAction:SECTION_SCREEN_BODY",
  POSTER_OWNER_ALIGNMENT: "MensLoungeAction:POSTER_OWNER_ALIGNMENT",
  POSTER_ASSET_UNIQUE_FOR_ROUTE: "MensLoungeAction:POSTER_ASSET_UNIQUE_FOR_ROUTE",
};

export function MensLoungeActionScreen(props) {
  const routeName = MBW_ROUTE_NAME;
  const oneTrueVisualBodyOnly = true;
  const babyScreenWorksInsideOneBody = true;
  const noLocalVisualBody = true;
  const noSecondVisualBody = true;
  void oneTrueVisualBodyOnly;
  void babyScreenWorksInsideOneBody;
  void noLocalVisualBody;
  void noSecondVisualBody;

  return (
    <MBWFullVisualBody {...props} routeName={routeName} screenContract={MBW_ONE_BODY_SCREEN_CONTRACT}>
      <MBWOneVisualSurface routeName={routeName} navigation={props?.navigation} contract={MBW_ONE_BODY_SCREEN_CONTRACT} />
    </MBWFullVisualBody>
  );
}

export default MensLoungeActionScreen;

