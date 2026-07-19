import { mbwProductionConfigStatus } from "../MBWProductionConfig";
export const MBW_LEGAL_VERSION = '2026-07-13-v1';
export const MBW_ROUTE_LABELS = Object.freeze({
  MasterOfLife: 'MASTER OF LIFE',
  Matchmaking: 'MATCHMAKING',
  Games: 'MASTER OF GAMES',
  MasterOfGames: 'MASTER OF GAMES',
  MasterOfCoins: 'MASTER OF COINS',
  TravelLocal: 'TRAVEL LOCAL',
  TravelOverseas: 'TRAVEL OVERSEAS',
  Merchandise: 'MERCHANDISE',
  Kamashastra: 'KAMASHASTRA',
  LiveLounge: 'LIVE LOUNGE',
  MensLounge: 'MEN’S LOUNGE',
  Nearby: 'NEARBY',
  AIPoster: 'AI POSTER',
  Settings: 'SETTINGS'
});
export const MBW_MASTER_OF_LIFE_ROUTES = Object.freeze(['MasterOfLife', 'Games', 'MasterOfGames', 'MasterOfCoins', 'TravelLocal', 'TravelOverseas', 'Merchandise', 'AIPoster', 'ProfilePoster', 'Settings', 'SeedProfile', 'Privacy', 'Terms', 'Consent', 'Safety', 'AccountControl', 'GameRoom', 'TravelBooking', 'CommerceReceipt']);
export const MBW_FULL_ACCESS_ROUTES = Object.freeze([...Object.keys(MBW_ROUTE_LABELS), 'ProfilePoster', 'MatchChat', 'GameRoom', 'TravelBooking', 'CommerceReceipt', 'Privacy', 'Terms', 'Safety', 'AccountControl', 'SeedProfile', 'Consent']);
const TIER_RANK = Object.freeze({
  '111': 1,
  '222': 2,
  '333': 3,
  '444': 4,
  '555': 5
});
export const MBW_ROUTE_MIN_TIER = Object.freeze({
  LiveLounge: '444'
});
export function mbwTierAllows(currentTier, requiredTier = '111') {
  return (TIER_RANK[currentTier] || 0) >= (TIER_RANK[requiredTier] || 1);
}
export function mbwPathAllows(path, routeName) {
  if (!routeName || ['CinematicIntro', 'GateLocked', 'GateOpen', 'PathSelection', 'SubscriptionSignup', 'MainHub'].includes(routeName)) return true;
  if (path === 'MASTER_OF_LIFE') return MBW_MASTER_OF_LIFE_ROUTES.includes(routeName);
  return MBW_FULL_ACCESS_ROUTES.includes(routeName);
}
export function mbwRouteAccess(state, routeName) {
  const pathAllowed = mbwPathAllows(state?.userSeed?.path, routeName);
  const requiredTier = MBW_ROUTE_MIN_TIER[routeName] || '111';
  const remoteTier = ['ACTIVE', 'GRACE', 'SOVEREIGN'].includes(state?.subscription?.status) ? state?.subscription?.tier : '111';
  const tierAllowed = mbwTierAllows(remoteTier, requiredTier);
  return {
    allowed: pathAllowed && tierAllowed,
    pathAllowed,
    tierAllowed,
    requiredTier
  };
}
export function mbwVisibleMainRoutes(state, mainRoutes) {
  return mainRoutes.filter(([route]) => mbwRouteAccess(state, route).allowed);
}
export const MBW_PRIVACY_SECTIONS = Object.freeze([['DATA OWNER', 'The local User Seed, profile, conversations, bookings, poster history, safety records, and settings remain under the account holder’s control.'], ['LOCAL STORAGE', 'Production data is encrypted before persistence. The encryption key is stored through the device keystore. Android backup is disabled for MBW application data.'], ['LOCATION', 'Foreground location is requested only after the Nearby action. MBW does not request background location. Denial leaves the remaining app usable.'], ['AI POSTER', 'Selected images are copied into the MBW private document vault for editing and history. Account deletion removes the vault and associated local records.'], ['PERMISSIONS', 'MBW does not require camera, microphone, contacts, SMS, call-log, or broad external-storage permissions for the APK certification workflow.'], ['RETENTION', 'Local records remain until the account holder removes individual content or executes Account Control deletion. Production-server retention requires the production service policy.'], ['CHILD SAFETY', 'The release lane requires an adults-only access declaration, reporting tools, blocking, moderation escalation, and store-age disclosures.'], ['PRODUCTION NOTICE', 'Remote service processing, international transfer terms, operator identity, legal contact, and regulator-specific rights must be published before public production release.']]);
export const MBW_TERMS_SECTIONS = Object.freeze([['ACCESS', 'Users must provide truthful age, identity, tier, and profile information and must follow the selected access path and tier restrictions.'], ['CONDUCT', 'Harassment, exploitation, impersonation, non-consensual content, unlawful trade, threats, and attempts to bypass safety controls are prohibited.'], ['MATCHING', 'Compatibility indicators and discovery results are informational. Users remain responsible for consent, communication, travel, and in-person safety decisions.'], ['GAMES AND COINS', 'MBW coins have no cash value. Production games, rewards, and purchases require published rules, fairness controls, and territory eligibility.'], ['TRAVEL', 'Travel bookings follow the published host, cancellation, safety and dispute terms. Production hosting requires identity checks, cancellation rules, safety escalation, and local-law compliance.'], ['MERCHANDISE', 'Orders require confirmed payment, inventory allocation, fulfilment and refund handling. Production checkout requires final pricing, taxes, delivery, refund, and seller information.'], ['LIVE AND SOCIAL', 'Content can be reported or blocked. Production publishing requires remote moderation, removal, appeal, copyright, and emergency escalation processes.'], ['ACCOUNT', 'The account holder may update the User Seed and delete local data. Remote deletion becomes binding only after the production account service is connected.'], ['AVAILABILITY', 'Service availability is monitored through the production support channel. Public release requires a service-status process and support channel.'], ['PRODUCTION NOTICE', 'Operator identity, governing law, dispute process, store billing terms, and official contact information must be approved before public release.']]);
export const MBW_CONSENT_SECTIONS = Object.freeze([['PROFILE', 'Create and display the public-safe User Seed fields selected by the account holder.'], ['LOCATION', 'Use foreground coordinates only after a Nearby request.'], ['MEDIA', 'Import and edit a selected image inside the private AI Poster vault.'], ['SOCIAL', 'Process posts, stories, reports, blocks and chats through authenticated production services.'], ['ANALYTICS', 'No production analytics consent is enabled in the APK certification build.'], ['WITHDRAWAL', 'Consent can be withdrawn in Settings. Account deletion removes local data and copied poster files.']]);
export const MBW_PRODUCTION_SERVICE_REQUIREMENTS = Object.freeze({
  AUTH: 'Remote account authentication, recovery, abuse defense, session revocation, and cross-device identity.',
  BILLING: 'Google Play Billing products, server purchase verification, refunds, subscription lifecycle, and entitlement sync.',
  MATCH_CHAT: 'Authenticated remote discovery, matching, message transport, blocking, retention, and deletion.',
  LIVE: 'Streaming transport, broadcaster permissions, viewer controls, recording policy, reporting, and moderation.',
  MODERATION: 'Remote report queue, human review, enforcement, appeal, emergency escalation, and transparency records.',
  ACCOUNT_DELETE: 'Server-side account deletion, downstream processor deletion, and completion receipt.',
  LEGAL: 'Approved operator identity, privacy notice, terms, contact details, age policy, and jurisdiction disclosures.'
});
export const MBW_PRODUCTION_SERVICE_STATUS = Object.freeze(mbwProductionConfigStatus().status);
export function mbwProductionReady(status = MBW_PRODUCTION_SERVICE_STATUS) {
  const missing = Object.entries(status).filter(([, value]) => value !== true).map(([key]) => key);
  return {
    ready: missing.length === 0,
    missing
  };
}
