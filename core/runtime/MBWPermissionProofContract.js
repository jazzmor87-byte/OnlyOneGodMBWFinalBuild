export const MBW_PERMISSION_PROOF_CONTRACT = {
  name: "MBWPermissionProofContract",
  camera: "ASK_WHEN_NEEDED",
  microphone: "ASK_WHEN_NEEDED",
  storage: "APP_ASSET_ACCESS_ONLY",
  location: "ASK_WHEN_NEEDED",
  contacts: "NOT_REQUIRED_FOR_BASE_FLOW",
  noSilentPermissionEscalation: true,
};

export function MBWPermissionProofContract() {
  return {
    ...MBW_PERMISSION_PROOF_CONTRACT,
    green: MBW_PERMISSION_PROOF_CONTRACT.noSilentPermissionEscalation === true,
  };
}

export default MBWPermissionProofContract;
