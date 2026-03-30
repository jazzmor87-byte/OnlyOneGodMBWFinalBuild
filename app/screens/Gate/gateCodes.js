const INTERNAL_USER_PASSWORD = "ONLY$1$GOD";
const PUBLIC_USER_PASSWORD = "ONLYONEGOD";
const MBW_PASSWORD = "$ONLY1GOD$";

const gateCodes = {
  USER_INTERNAL: INTERNAL_USER_PASSWORD,
  USER_PUBLIC: PUBLIC_USER_PASSWORD,
  PUBLIC: PUBLIC_USER_PASSWORD,
  MBW: MBW_PASSWORD,
};

export const resolveGateTier = (input = "") => {
  const value = String(input).trim();
  if (value === MBW_PASSWORD) return "MBW";
  if (value === INTERNAL_USER_PASSWORD) return "PUBLIC";
  if (value === PUBLIC_USER_PASSWORD) return "PUBLIC";
  return null;
};

export default gateCodes;
