import { Platform } from 'react-native';
import {
  initConnection,
  endConnection,
  fetchProducts,
  requestPurchase,
  getAvailablePurchases,
  finishTransaction,
} from 'expo-iap';
import { MBW_PRODUCTION_CONFIG } from './MBWProductionConfig';
import { MBWProductionRepository } from './MBWProductionRepository';

let connected = false;

export async function mbwBillingConnect() {
  if (!connected) connected = Boolean(await initConnection());
  return connected;
}

export async function mbwBillingProducts() {
  await mbwBillingConnect();
  const skus = Object.values(MBW_PRODUCTION_CONFIG.products);
  return fetchProducts({ skus, type: 'subs' });
}

function tokenFromPurchase(purchase) {
  return purchase?.purchaseToken
    || purchase?.purchaseTokenAndroid
    || purchase?.transactionReceipt
    || null;
}

export async function mbwPurchaseTier(tier, offerToken) {
  await mbwBillingConnect();
  const sku = MBW_PRODUCTION_CONFIG.products[tier];
  if (!sku) throw new Error('PRODUCT_ID_MISSING');
  const request = Platform.OS === 'android'
    ? {
        request: {
          google: {
            skus: [sku],
            subscriptionOffers: offerToken ? [{ sku, offerToken }] : [],
          },
        },
        type: 'subs',
      }
    : { request: { apple: { sku } }, type: 'subs' };
  const purchase = await requestPurchase(request);
  const chosen = Array.isArray(purchase) ? purchase[0] : purchase;
  const token = tokenFromPurchase(chosen);
  if (!token) throw new Error('PURCHASE_TOKEN_MISSING');
  const verified = await MBWProductionRepository.verifyPurchase(token, sku);
  if (!verified?.active) throw new Error(`ENTITLEMENT_${verified?.entitlementState || 'INVALID'}`);
  await finishTransaction({ purchase: chosen, isConsumable: false });
  return verified;
}

export async function mbwRestorePurchases() {
  await mbwBillingConnect();
  const purchases = await getAvailablePurchases();
  const restored = [];
  for (const purchase of purchases || []) {
    const token = tokenFromPurchase(purchase);
    const sku = purchase?.productId || purchase?.id;
    if (!token || !sku) continue;
    const verified = await MBWProductionRepository.verifyPurchase(token, sku);
    restored.push(verified);
    if (verified?.active) await finishTransaction({ purchase, isConsumable: false });
  }
  return restored;
}

export async function mbwBillingDisconnect() {
  if (connected) await endConnection();
  connected = false;
}
