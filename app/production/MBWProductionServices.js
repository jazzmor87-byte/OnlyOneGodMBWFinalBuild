import { MBW_PRODUCTION_CONFIG, mbwProductionConfigStatus } from './MBWProductionConfig';

async function request(endpoint, path, options = {}) {
  if (!endpoint) throw new Error('MBW production endpoint is not configured');
  const response = await fetch(`${endpoint.replace(/\/$/, '')}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.message || `MBW service failed: ${response.status}`);
  return body;
}

export const MBWProductionServices = Object.freeze({
  status: () => mbwProductionConfigStatus(),
  createSession: (payload) => request(MBW_PRODUCTION_CONFIG.authEndpoint, '/session', { method: 'POST', body: JSON.stringify(payload) }),
  revokeSession: (token) => request(MBW_PRODUCTION_CONFIG.authEndpoint, '/session/revoke', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }),
  verifyPurchase: (payload, token) => request(MBW_PRODUCTION_CONFIG.billingVerifyEndpoint, '/google-play/verify', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }),
  sendChat: (payload, token) => request(MBW_PRODUCTION_CONFIG.chatEndpoint, '/messages', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }),
  createLiveSession: (payload, token) => request(MBW_PRODUCTION_CONFIG.liveEndpoint, '/sessions', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }),
  reportContent: (payload, token) => request(MBW_PRODUCTION_CONFIG.moderationEndpoint, '/reports', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }),
  deleteAccount: (token) => request(MBW_PRODUCTION_CONFIG.accountDeleteEndpoint, '/account', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }),
});
