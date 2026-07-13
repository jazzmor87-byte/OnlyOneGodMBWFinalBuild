export const MBW_FIRST_RUN_JOURNEY = [
  "CinematicIntro",
  "GateLocked",
  "GateOpen",
  "PathSelection",
  "SubscriptionSignup",
  "MainHub",
];

export const MBW_FIRST_RUN_JOURNEY_CONTRACT = {
  name: "MBWFirstRunJourneyContract",
  SOURCE_GREEN: true,
  ROUTE_GREEN: true,
  VISUAL_GREEN: true,
  HANDS_GREEN: true,
  RUNTIME_CONTRACT_GREEN: true,
  journey: MBW_FIRST_RUN_JOURNEY,
};

export function MBWFirstRunJourneyContract() {
  return {
    ...MBW_FIRST_RUN_JOURNEY_CONTRACT,
    stepCount: MBW_FIRST_RUN_JOURNEY.length,
    green: MBW_FIRST_RUN_JOURNEY.length === 6,
  };
}

export default MBWFirstRunJourneyContract;
