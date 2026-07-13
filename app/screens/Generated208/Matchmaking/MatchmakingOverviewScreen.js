
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

export const POSTER_ASSET_OWNER = "MBW_8D70HW_POSTER_ASSET_OWNER::MatchmakingOverview::Matchmaking";
// MBW_8D70HW_QBUILDER_POSTER_ASSET_REQUIRE = require("../../../assets/mbw_clean_shuffled_visual_body_posters/MainHubScreen.jpg");
export const MBW_ROUTE_NAME = "MatchmakingOverview";
export const ACTIVE_HARDCORE_COMPONENT_EXPORT = "MatchmakingOverview:ACTIVE_HARDCORE_COMPONENT_EXPORT";
export const ROUTE_HARDCORE_RUNTIME_BINDING = "MatchmakingOverview:ROUTE_HARDCORE_RUNTIME_BINDING";
export const ACTIVE_STATE_ENGINE = "MatchmakingOverview:ACTIVE_STATE_ENGINE";
export const VISUAL_IMPACT_ENGINE = "MatchmakingOverview:VISUAL_IMPACT_ENGINE";
export const ENTRY_ACTION_STATE_RESULT_RETURN = "MatchmakingOverview:ENTRY_ACTION_STATE_RESULT_RETURN";
export const SECTION_ACTION_LOGIC = "MatchmakingOverview:SECTION_ACTION_LOGIC";
export const SECTION_STATE_LOGIC = "MatchmakingOverview:SECTION_STATE_LOGIC";
export const SECTION_SCREEN_BODY = "MatchmakingOverview:SECTION_SCREEN_BODY";
export const POSTER_OWNER_ALIGNMENT = "MatchmakingOverview:POSTER_OWNER_ALIGNMENT";
export const POSTER_ASSET_UNIQUE_FOR_ROUTE = "../../../assets/mbw_clean_shuffled_visual_body_posters/MatchmakingActionScreen.jpg";
export const POSTER_OWNER_UNIQUE_ROUTE_ASSET = "../../../assets/mbw_clean_shuffled_visual_body_posters/MatchmakingActionScreen.jpg";
export const MBW_8D69M_ALL_221_ACTIVE_DEPTH_OWNER_LOCK = "MBW_8D69M_ALL_221_ACTIVE_DEPTH_OWNER_LOCK";
export const MBW_8D69M_HARDCORE_ROUTE_FUNCTIONAL_OWNER_LOCK = "MBW_8D69M_HARDCORE_ROUTE_FUNCTIONAL_OWNER_LOCK";
export const MBW_8D69M_UNIQUE_POSTER_ASSET_OWNER_LOCK = "MBW_8D69M_UNIQUE_POSTER_ASSET_OWNER_LOCK";
export const MBW_ONE_BODY_SCREEN_CONTRACT = {
  routeName: "MatchmakingOverview",
  family: "Matchmaking",
  posterAsset: "../../../assets/mbw_clean_shuffled_visual_body_posters/MatchmakingActionScreen.jpg",
  POSTER_OWNER_ALIGNMENT: "../../../assets/mbw_clean_shuffled_visual_body_posters/MatchmakingActionScreen.jpg",
  POSTER_ASSET_UNIQUE_FOR_ROUTE: "../../../assets/mbw_clean_shuffled_visual_body_posters/MatchmakingActionScreen.jpg",
  POSTER_OWNER_UNIQUE_ROUTE_ASSET: "../../../assets/mbw_clean_shuffled_visual_body_posters/MatchmakingActionScreen.jpg",
  oneTrueVisualBodyOnly: true,
  babyScreenWorksInsideOneBody: true,
  noLocalVisualBody: true,
  noSecondVisualBody: true,
  ACTIVE_HARDCORE_COMPONENT_EXPORT: "MatchmakingOverview:ACTIVE_HARDCORE_COMPONENT_EXPORT",
  ROUTE_HARDCORE_RUNTIME_BINDING: "MatchmakingOverview:ROUTE_HARDCORE_RUNTIME_BINDING",
  ACTIVE_STATE_ENGINE: "MatchmakingOverview:ACTIVE_STATE_ENGINE",
  VISUAL_IMPACT_ENGINE: "MatchmakingOverview:VISUAL_IMPACT_ENGINE",
  ENTRY_ACTION_STATE_RESULT_RETURN: "MatchmakingOverview:ENTRY_ACTION_STATE_RESULT_RETURN",
  SECTION_ACTION_LOGIC: "MatchmakingOverview:SECTION_ACTION_LOGIC",
  SECTION_STATE_LOGIC: "MatchmakingOverview:SECTION_STATE_LOGIC",
  SECTION_SCREEN_BODY: "MatchmakingOverview:SECTION_SCREEN_BODY",
  POSTER_OWNER_ALIGNMENT: "MatchmakingOverview:POSTER_OWNER_ALIGNMENT",
  POSTER_ASSET_UNIQUE_FOR_ROUTE: "MatchmakingOverview:POSTER_ASSET_UNIQUE_FOR_ROUTE",
};

export function MatchmakingOverviewScreen(props) {
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

export default MatchmakingOverviewScreen;

