import { readMBWExactVisualStandard, assertMBWExactVisualStandard } from "../../core/visual/MBWExactVisualStandard";
import { assertPublicCleanExperience } from "../../core/public/MBWPublicCleanExperience";
import MBWFirstRunJourneyContract from "../../core/runtime/MBWFirstRunJourneyContract";
import MBWPermissionProofContract from "../../core/runtime/MBWPermissionProofContract";
import MBWCompletionCubeBuilder from "../../core/cube/MBWCompletionCubeBuilder";
import TripleCoreSentinel from "../../core/sentinel/TripleCoreSentinel";
import PremiumRuntimeGreenSystem from "../../core/runtime/PremiumRuntimeGreenSystem";
import SelfRepairRuntimeMode from "../../core/runtime/SelfRepairRuntimeMode";
import V16LivingVisualOSMapper from "../../core/visual/V16LivingVisualOSMapper";
import VisualBodyInheritanceCore from "../../core/visual/VisualBodyInheritanceCore";
import APKSealLayer from "../../core/apk/APKSealLayer";
import React, { createContext, useContext, useMemo, useRef } from "react";
import { onScreenMount, onNavigation, validateRoute, readLifecycleState } from "../../core/runtime/lifecycleKernel";
import { readMBWGraph, registerMBWRoute, registerMBWScreen } from "../../core/graph/mbwGraphStore";
import { predictNextScreen, suggestRouteFix, optimizeFlow, detectNavigationRisk } from "../../core/ai/mbwAIConnector";

const MBWRuntimeContext = createContext(null);

export function useMBWRuntimeOS() {
  return useContext(MBWRuntimeContext);
}

export default function MBWRuntimeOS({ children }) {
  const bootRef = useRef({
    booted: true,
    version: "fresh-runtime-os-v2",
    visualLaw: "black-gold-maroon",
    oldRootImportRejected: true,
  });

  const value = useMemo(() => ({
    mbwExactVisualStandard: readMBWExactVisualStandard,
    assertMBWExactVisualStandard,
    assertPublicCleanExperience,
    mbwFirstRunJourneyContract: MBWFirstRunJourneyContract,
    mbwPermissionProofContract: MBWPermissionProofContract,
    mbwCompletionCubeBuilder: MBWCompletionCubeBuilder,
    tripleCoreSentinel: TripleCoreSentinel,
    premiumRuntimeGreenSystem: PremiumRuntimeGreenSystem,
    selfRepairRuntimeMode: SelfRepairRuntimeMode,
    v16LivingVisualOSMapper: V16LivingVisualOSMapper,
    visualBodyInheritanceCore: VisualBodyInheritanceCore,
    apkSealLayer: APKSealLayer,
    boot: bootRef.current,
    onScreenMount,
    onNavigation,
    validateRoute,
    readLifecycleState,
    readMBWGraph,
    registerMBWRoute,
    registerMBWScreen,
    predictNextScreen,
    suggestRouteFix,
    optimizeFlow,
    detectNavigationRisk,
  }), []);

  return (
    <MBWRuntimeContext.Provider value={value}>
      {children}
    </MBWRuntimeContext.Provider>
  );
}

export { MBWRuntimeContext };
