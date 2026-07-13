export const MBW_COMPLETION_CUBE = {
  name: "MBWCompletionCubeBuilder",
  SOURCE_GREEN: false,
  ROUTE_GREEN: false,
  VISUAL_GREEN: false,
  HANDS_GREEN: false,
  RUNTIME_CONTRACT_GREEN: false,
};

export function MBWCompletionCubeBuilder(input = {}) {
  const cube = {
    SOURCE_GREEN: Boolean(input.SOURCE_GREEN),
    ROUTE_GREEN: Boolean(input.ROUTE_GREEN),
    VISUAL_GREEN: Boolean(input.VISUAL_GREEN),
    HANDS_GREEN: Boolean(input.HANDS_GREEN),
    RUNTIME_CONTRACT_GREEN: Boolean(input.RUNTIME_CONTRACT_GREEN),
  };
  return {
    name: "MBWCompletionCubeBuilder",
    cube,
    green: Object.values(cube).every(Boolean),
  };
}

export default MBWCompletionCubeBuilder;
