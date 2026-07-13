// MBW_LOGIC_PRESENTATION_DRIVER
// COMMAND_04_LOGIC_PRESENTATION_DRIVER_PATCH
// BUILD_EXECUTED=false

export const MBW_ENTRY_FLOW_SEQUENCE = [
  'CinematicIntro',
  'GateLocked',
  'GateOpen',
  'PathSelection',
  'SubscriptionSignup',
  'MainHub',
];

export const MBW_RESULT_PRESENTATION_ROUTES = [
  'Matchmaking',
  'Kamashastra',
  'ProfilePoster',
];

export const MBW_LOGIC_PRESENTATION_RULES = {
  entryFlowSequence: MBW_ENTRY_FLOW_SEQUENCE,
  firstRunFlow: 'CinematicIntro->GateLocked->GateOpen->PathSelection->SubscriptionSignup->MainHub',
  returnUserFlow: 'CinematicIntro->GateLocked->GateOpen->MainHub',
  sectionReturnRule: 'ALL_PUBLIC_SECTION_ROUTES_RETURN_TO_MAINHUB',
  resultPresentationRule: 'RESULT_ROUTES_USE_SUCCESS_EMPTY_LOCKED_ERROR_RETURN_NEXT_STATE',
  emptyStateRule: 'PREMIUM_EMPTY_STATE_WITH_NO_DEBUG_NO_PLACEHOLDER',
  lockedStateRule: 'LOCKED_STATE_RETURNS_TO_ACCESS_GATE_OR_MAINHUB',
  successStateRule: 'SUCCESS_PRESENTATION_RETURNS_PROOF_AND_NEXT_STEP',
  errorStateRule: 'SILENT_SAFE_ERROR_PRESENTATION_NO_PUBLIC_STACK_TRACE',
  nextStepState: 'NEXT_ROUTE_FROM_VISUAL_LOGIC_DRIVER_REGISTRY',
  buildExecuted: false,
};

function normalizeRouteName(meta, activeRoute) {
  return activeRoute || meta?.routeName || meta?.currentRoute || 'MainHub';
}

function isEntryRoute(routeName) {
  return MBW_ENTRY_FLOW_SEQUENCE.includes(routeName) && routeName !== 'MainHub';
}

function isResultRoute(routeName) {
  return MBW_RESULT_PRESENTATION_ROUTES.includes(routeName);
}

function resolveEntryIndex(routeName) {
  const index = MBW_ENTRY_FLOW_SEQUENCE.indexOf(routeName);
  return index >= 0 ? index + 1 : 0;
}

export function getMBWActionTarget(meta, actionKind = 'primary') {
  if (actionKind === 'secondary') {
    return meta?.returnRoute || 'MainHub';
  }

  return (
    meta?.iconActionTarget ||
    meta?.nextRoute ||
    meta?.primaryActionTarget ||
    'MainHub'
  );
}

export function getMBWLogicPresentation(meta, activeRoute) {
  const currentRoute = normalizeRouteName(meta, activeRoute);
  const primaryActionTarget = getMBWActionTarget(meta, 'primary');
  const secondaryActionTarget = getMBWActionTarget(meta, 'secondary');
  const entryStepNumber = resolveEntryIndex(currentRoute);
  const entryRoute = isEntryRoute(currentRoute);
  const resultRoute = isResultRoute(currentRoute);

  return {
    currentRoute,
    routePhase: meta?.routePhase || meta?.phase || 'SECTION_FLOW',
    routeFamily: meta?.routeFamily || 'SECTION',
    screenFamily: meta?.screenFamily || 'SECTION',

    entryFlowSequence: MBW_ENTRY_FLOW_SEQUENCE,
    entryFlowStep: meta?.entryFlowStep || (entryStepNumber ? `${entryStepNumber}_OF_6` : 'SECTION_DIRECT'),
    firstRunFlow: MBW_LOGIC_PRESENTATION_RULES.firstRunFlow,
    returnUserFlow: MBW_LOGIC_PRESENTATION_RULES.returnUserFlow,

    nextRoute: primaryActionTarget,
    returnRoute: secondaryActionTarget,
    primaryAction: meta?.primaryAction || `NAVIGATE_TO_${primaryActionTarget}`,
    secondaryAction: meta?.secondaryAction || `RETURN_TO_${secondaryActionTarget}`,
    primaryActionTarget,
    secondaryActionTarget,

    sectionReturnRule: meta?.sectionReturnRule || MBW_LOGIC_PRESENTATION_RULES.sectionReturnRule,

    accessGateState: {
      firstRunState: meta?.firstRunState || (entryRoute ? 'ENTRY_FIRST_RUN_FLOW_READY' : 'NOT_ENTRY_FIRST_RUN'),
      gateLockedState: meta?.gateLockedState || 'NOT_LOCKED_GATE',
      gateOpenState: meta?.gateOpenState || 'NOT_OPEN_GATE',
      subscriptionState: meta?.subscriptionState || 'NOT_SUBSCRIPTION_SCREEN',
      signupState: meta?.signupState || 'NOT_SIGNUP_SCREEN',
      returnUserState: meta?.returnUserState || 'RETURN_USER_CAN_ENTER_MAINHUB',
    },

    resultPresentation: {
      resultState: meta?.resultState || (resultRoute ? 'RESULT_VISUAL_READY' : 'STANDARD_ROUTE_STATE'),
      successState: meta?.successState || 'SUCCESS_PRESENTATION_READY',
      emptyState: meta?.emptyState || 'PREMIUM_EMPTY_STATE_READY',
      lockedState: meta?.lockedState || 'LOCKED_PRESENTATION_READY',
      errorState: meta?.errorState || 'SILENT_SAFE_ERROR_PRESENTATION_READY',
      returnState: meta?.returnState || `RETURN_TO_${secondaryActionTarget}`,
      nextStepState: meta?.nextStepState || `NEXT_TO_${primaryActionTarget}`,
    },

    resultPresentationRule: MBW_LOGIC_PRESENTATION_RULES.resultPresentationRule,
    emptyStateRule: MBW_LOGIC_PRESENTATION_RULES.emptyStateRule,
    lockedStateRule: MBW_LOGIC_PRESENTATION_RULES.lockedStateRule,
    successStateRule: MBW_LOGIC_PRESENTATION_RULES.successStateRule,
    errorStateRule: MBW_LOGIC_PRESENTATION_RULES.errorStateRule,
    nextStepState: meta?.nextStepState || `NEXT_TO_${primaryActionTarget}`,

    logicalPresentationReady: true,
    publicClean: meta?.publicClean !== false,
    tapSafe: meta?.tapSafe !== false,
    buildExecuted: false,
  };
}

export function isMBWLogicPresentationReady(meta, activeRoute) {
  const logic = getMBWLogicPresentation(meta, activeRoute);

  return Boolean(
    logic.currentRoute &&
    logic.primaryActionTarget &&
    logic.secondaryActionTarget &&
    logic.entryFlowSequence.length === 6 &&
    logic.firstRunFlow &&
    logic.returnUserFlow &&
    logic.sectionReturnRule &&
    logic.resultPresentation.resultState &&
    logic.resultPresentation.successState &&
    logic.resultPresentation.emptyState &&
    logic.resultPresentation.lockedState &&
    logic.resultPresentation.errorState &&
    logic.resultPresentation.returnState &&
    logic.resultPresentation.nextStepState &&
    logic.logicalPresentationReady &&
    logic.publicClean &&
    logic.tapSafe
  );
}

export const MBW_LOGIC_PRESENTATION_DRIVER_CONTRACT = {
  entryFlowSequence: true,
  firstRunFlow: true,
  returnUserFlow: true,
  sectionReturnRule: true,
  resultPresentationRule: true,
  emptyStateRule: true,
  lockedStateRule: true,
  successStateRule: true,
  errorStateRule: true,
  nextStepState: true,
  primaryActionTarget: true,
  secondaryActionTarget: true,
  logicalPresentationReady: true,
  buildExecuted: false,
};
