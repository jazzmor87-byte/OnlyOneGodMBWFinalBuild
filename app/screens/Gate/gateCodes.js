export const MBW_PASSWORD = "$ONLY1GOD$";
export const USER_PASSWORD = "ONLY$1$GOD";

export const resolveGateTier = (raw) => {
  const s = String(raw ?? "").trim();
  if (s === MBW_PASSWORD) return "MBW";
  if (s === USER_PASSWORD) return "PUBLIC";
  return null;
};
