export const MBW_PRODUCTION_CONFIG = Object.freeze({
  supabaseUrl: process.env.EXPO_PUBLIC_MBW_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  supabaseKey: process.env.EXPO_PUBLIC_MBW_SUPABASE_PUBLISHABLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  livekitUrl: process.env.EXPO_PUBLIC_MBW_LIVEKIT_URL || '',
  releaseChannel: process.env.EXPO_PUBLIC_MBW_RELEASE_CHANNEL || '',
  products: Object.freeze({
    '111': process.env.EXPO_PUBLIC_MBW_PLAY_PRODUCT_111 || '',
    '222': process.env.EXPO_PUBLIC_MBW_PLAY_PRODUCT_222 || '',
    '333': process.env.EXPO_PUBLIC_MBW_PLAY_PRODUCT_333 || '',
    '444': process.env.EXPO_PUBLIC_MBW_PLAY_PRODUCT_444 || '',
  }),
  legal: Object.freeze({
    operatorName: process.env.EXPO_PUBLIC_MBW_OPERATOR_NAME || '',
    supportEmail: process.env.EXPO_PUBLIC_MBW_SUPPORT_EMAIL || '',
    privacyUrl: process.env.EXPO_PUBLIC_MBW_PRIVACY_URL || '',
    termsUrl: process.env.EXPO_PUBLIC_MBW_TERMS_URL || '',
    communityStandardsUrl: process.env.EXPO_PUBLIC_MBW_COMMUNITY_STANDARDS_URL || '',
    csaeStandardsUrl: process.env.EXPO_PUBLIC_MBW_CSAE_STANDARDS_URL || '',
  }),
});
export function mbwProductionConfigStatus() {
  const status = {
    AUTH: Boolean(MBW_PRODUCTION_CONFIG.supabaseUrl && MBW_PRODUCTION_CONFIG.supabaseKey),
    BILLING: Object.values(MBW_PRODUCTION_CONFIG.products).every(Boolean),
    MATCH_CHAT: Boolean(MBW_PRODUCTION_CONFIG.supabaseUrl),
    LIVE: Boolean(MBW_PRODUCTION_CONFIG.livekitUrl),
    MODERATION: Boolean(MBW_PRODUCTION_CONFIG.supabaseUrl),
    ACCOUNT_DELETE: Boolean(MBW_PRODUCTION_CONFIG.supabaseUrl),
    LEGAL: Object.values(MBW_PRODUCTION_CONFIG.legal).every(Boolean),
    PRODUCTION_CHANNEL: MBW_PRODUCTION_CONFIG.releaseChannel === 'production',
  };
  return { status, ready: Object.values(status).every(Boolean), missing: Object.keys(status).filter(key => !status[key]) };
}
