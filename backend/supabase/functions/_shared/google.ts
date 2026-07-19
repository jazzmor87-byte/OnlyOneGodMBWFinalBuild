import { create } from 'https://deno.land/x/djwt@v3.0.2/mod.ts';
function pemToArrayBuffer(pem: string) {
  const b64 = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, '');
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
}
async function accessToken() {
  const raw = Deno.env.get('GOOGLE_PLAY_SERVICE_ACCOUNT_JSON'); if (!raw) throw new Error('GOOGLE_PLAY_SERVICE_ACCOUNT_MISSING');
  const account = JSON.parse(raw);
  const key = await crypto.subtle.importKey('pkcs8', pemToArrayBuffer(account.private_key), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const now = Math.floor(Date.now() / 1000);
  const jwt = await create({ alg: 'RS256', typ: 'JWT' }, { iss: account.client_email, scope: 'https://www.googleapis.com/auth/androidpublisher', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }, key);
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }) });
  if (!response.ok) throw new Error(`GOOGLE_OAUTH_${response.status}`); return (await response.json()).access_token as string;
}
export async function getSubscriptionV2(purchaseToken: string) {
  const packageName = Deno.env.get('GOOGLE_PLAY_PACKAGE_NAME') || 'com.mbw.app'; const token = await accessToken();
  const response = await fetch(`https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(packageName)}/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`GOOGLE_VERIFY_${response.status}`); return await response.json();
}
export async function acknowledgeSubscription(productId: string, purchaseToken: string) {
  const packageName = Deno.env.get('GOOGLE_PLAY_PACKAGE_NAME') || 'com.mbw.app'; const token = await accessToken();
  const response = await fetch(`https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(packageName)}/purchases/subscriptions/${encodeURIComponent(productId)}/tokens/${encodeURIComponent(purchaseToken)}:acknowledge`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: '{}' });
  if (!response.ok && response.status !== 409) throw new Error(`GOOGLE_ACK_${response.status}`);
}
export async function sha256Hex(value: string) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  return Array.from(digest, b => b.toString(16).padStart(2, '0')).join('');
}
