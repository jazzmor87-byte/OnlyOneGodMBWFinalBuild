import { Asset } from 'expo-asset';

export const MODNET_MODEL_ASSET_MODULE =
  require('../models/modnet_photographic.onnx');

export function getModnetModelAsset() {
  return Asset.fromModule(MODNET_MODEL_ASSET_MODULE);
}

export async function resolveModnetModelUri() {
  const asset = getModnetModelAsset();

  if (!asset.localUri) {
    await asset.downloadAsync();
  }

  return asset.localUri || asset.uri;
}
