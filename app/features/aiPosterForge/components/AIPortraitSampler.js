import React, {
  useEffect,
  useRef,
} from 'react';
import {
  AlphaType,
  ColorType,
  Skia,
  useImage,
} from '@shopify/react-native-skia';
import {
  cancelPortraitRequest,
  createPortraitRequestToken,
  runPortraitMatting,
} from '../runtime/aiPortraitMattingEngine';

function matteToImage(
  alpha,
  width,
  height
) {
  const rgba =
    new Uint8Array(
      width *
      height *
      4
    );

  for (
    let index = 0;
    index < alpha.length;
    index += 1
  ) {
    const value =
      Math.round(
        Math.max(
          0,
          Math.min(
            1,
            alpha[index]
          )
        ) * 255
      );
    const offset =
      index * 4;

    rgba[offset] = value;
    rgba[
      offset + 1
    ] = value;
    rgba[
      offset + 2
    ] = value;
    rgba[
      offset + 3
    ] = 255;
  }

  return Skia.Image.MakeImage(
    {
      width,
      height,
      alphaType:
        AlphaType.Unpremul,
      colorType:
        ColorType.RGBA_8888,
    },
    Skia.Data.fromBytes(
      rgba
    ),
    width * 4
  );
}

export default function AIPortraitSampler({
  uri,
  requestId,
  active,
  onSuccess,
  onError,
  onStatus,
}) {
  const image =
    useImage(uri || null);
  const consumed =
    useRef(null);
  const tokenRef =
    useRef(null);

  useEffect(() => {
    let mounted = true;

    const execute =
      async () => {
        if (
          !active ||
          !image ||
          !uri ||
          consumed.current ===
            requestId
        ) {
          return;
        }

        consumed.current =
          requestId;
        const token =
          createPortraitRequestToken(
            requestId
          );
        tokenRef.current =
          token;

        try {
          onStatus?.(
            'READING_PIXELS'
          );

          const info =
            image.getImageInfo();
          const pixels =
            image.readPixels(
              0,
              0,
              info
            );

          if (!pixels) {
            throw new Error(
              'SKIA_PIXEL_READ_FAILED'
            );
          }

          onStatus?.(
            'RUNNING_ON_DEVICE_AI'
          );

          const result =
            await runPortraitMatting({
              pixels,
              width:
                info.width,
              height:
                info.height,
              token,
            });
          const maskImage =
            matteToImage(
              result.alpha,
              result.width,
              result.height
            );

          if (!maskImage) {
            throw new Error(
              'AI_MASK_IMAGE_CREATION_FAILED'
            );
          }

          if (
            mounted &&
            !token.cancelled
          ) {
            onSuccess?.({
              maskImage,
              maskMeta: {
                width:
                  result.width,
                height:
                  result.height,
                preprocessing:
                  result.preprocessing,
                elapsedMs:
                  result.elapsedMs,
                hardCancelSupported:
                  result.hardCancelSupported,
                inputName:
                  result.inputName,
                outputNames:
                  result.outputNames,
              },
            });
          }
        } catch (error) {
          if (
            mounted &&
            !token.cancelled
          ) {
            onError?.(
              String(
                error?.message ||
                error
              )
            );
          }
        }
      };

    execute();

    return () => {
      mounted = false;
      cancelPortraitRequest(
        tokenRef.current
      );
    };
  }, [
    active,
    image,
    onError,
    onStatus,
    onSuccess,
    requestId,
    uri,
  ]);

  return null;
}
