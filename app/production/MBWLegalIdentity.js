import { MBW_PRODUCTION_CONFIG } from './MBWProductionConfig';
export const MBW_LEGAL_IDENTITY = MBW_PRODUCTION_CONFIG.legal;
export function mbwLegalIdentityReady() {
  return Object.values(MBW_LEGAL_IDENTITY).every(Boolean);
}
