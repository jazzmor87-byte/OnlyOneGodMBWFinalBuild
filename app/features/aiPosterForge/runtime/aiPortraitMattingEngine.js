import { MODNET_MODEL_ASSET_MODULE } from './modnetAssetRegistry';
import {
  Asset,
} from 'expo-asset';
import * as ort
  from 'onnxruntime-react-native';

const MODEL_SIZE = 512;

export function createPortraitRequestToken(
  requestId
) {
  return {
    requestId,
    cancelled: false,
    timedOut: false,
    startedAt: Date.now(),
  };
}

export function cancelPortraitRequest(
  token
) {
  if (token) {
    token.cancelled = true;
  }
}

function ensureActive(
  token,
  code
) {
  if (token?.cancelled) {
    throw new Error(
      code ||
      'AI_REQUEST_CANCELLED'
    );
  }
}

async function loadModelUri() {
  const [asset] =
    await Asset.loadAsync(
      require(
        '../models/modnet_photographic.onnx'
      )
    );

  const uri =
    asset.localUri ||
    asset.uri;

  if (!uri) {
    throw new Error(
      'AI_MODEL_LOCAL_URI_MISSING'
    );
  }

  return uri;
}

function validateSession(
  session
) {
  if (
    !session ||
    !Array.isArray(
      session.inputNames
    ) ||
    session.inputNames.length !== 1
  ) {
    throw new Error(
      'AI_MODEL_INPUT_CONTRACT_INVALID'
    );
  }

  if (
    !Array.isArray(
      session.outputNames
    ) ||
    !session.outputNames.length
  ) {
    throw new Error(
      'AI_MODEL_OUTPUT_CONTRACT_INVALID'
    );
  }

  const metadata =
    Array.isArray(
      session.inputMetadata
    )
      ? session.inputMetadata[0]
      : null;

  if (
    metadata?.type &&
    metadata.type !==
      'float32'
  ) {
    throw new Error(
      `AI_MODEL_INPUT_TYPE_${metadata.type}`
    );
  }
}

function channel255(
  pixels,
  index
) {
  const value =
    Number(
      pixels[index] || 0
    );

  return (
    pixels instanceof
      Float32Array &&
    value >= 0 &&
    value <= 1
  )
    ? value * 255
    : value;
}

function bilinearSample(
  pixels,
  width,
  height,
  x,
  y,
  channel
) {
  const x0 = Math.max(
    0,
    Math.min(
      width - 1,
      Math.floor(x)
    )
  );
  const y0 = Math.max(
    0,
    Math.min(
      height - 1,
      Math.floor(y)
    )
  );
  const x1 = Math.min(
    width - 1,
    x0 + 1
  );
  const y1 = Math.min(
    height - 1,
    y0 + 1
  );
  const fx = x - x0;
  const fy = y - y0;

  const at = (
    px,
    py
  ) =>
    channel255(
      pixels,
      (
        py * width +
        px
      ) * 4 +
      channel
    );

  const top =
    at(x0, y0) *
      (1 - fx) +
    at(x1, y0) *
      fx;
  const bottom =
    at(x0, y1) *
      (1 - fx) +
    at(x1, y1) *
      fx;

  return (
    top * (1 - fy) +
    bottom * fy
  );
}

export function prepareLetterboxedPixels({
  pixels,
  width,
  height,
  token,
}) {
  ensureActive(
    token,
    'AI_CANCELLED_BEFORE_PREPROCESS'
  );

  const sourceWidth =
    Number(width);
  const sourceHeight =
    Number(height);

  if (
    !Number.isFinite(
      sourceWidth
    ) ||
    !Number.isFinite(
      sourceHeight
    ) ||
    sourceWidth <= 0 ||
    sourceHeight <= 0
  ) {
    throw new Error(
      'AI_SOURCE_DIMENSIONS_INVALID'
    );
  }

  if (
    !pixels ||
    pixels.length <
      sourceWidth *
      sourceHeight *
      4
  ) {
    throw new Error(
      'AI_SOURCE_PIXEL_BUFFER_INVALID'
    );
  }

  const scale = Math.min(
    MODEL_SIZE /
      sourceWidth,
    MODEL_SIZE /
      sourceHeight
  );
  const contentWidth =
    Math.max(
      1,
      Math.round(
        sourceWidth *
        scale
      )
    );
  const contentHeight =
    Math.max(
      1,
      Math.round(
        sourceHeight *
        scale
      )
    );
  const padX =
    Math.floor(
      (
        MODEL_SIZE -
        contentWidth
      ) / 2
    );
  const padY =
    Math.floor(
      (
        MODEL_SIZE -
        contentHeight
      ) / 2
    );
  const output =
    new Uint8Array(
      MODEL_SIZE *
      MODEL_SIZE *
      4
    );

  for (
    let index = 0;
    index <
      MODEL_SIZE *
      MODEL_SIZE;
    index += 1
  ) {
    output[
      index * 4 + 3
    ] = 255;
  }

  for (
    let y = 0;
    y < contentHeight;
    y += 1
  ) {
    ensureActive(
      token,
      'AI_CANCELLED_DURING_PREPROCESS'
    );

    const sourceY =
      (
        (y + 0.5) /
        contentHeight
      ) *
      sourceHeight -
      0.5;

    for (
      let x = 0;
      x < contentWidth;
      x += 1
    ) {
      const sourceX =
        (
          (x + 0.5) /
          contentWidth
        ) *
        sourceWidth -
        0.5;
      const offset =
        (
          (
            y + padY
          ) *
          MODEL_SIZE +
          x +
          padX
        ) * 4;

      output[offset] =
        Math.round(
          bilinearSample(
            pixels,
            sourceWidth,
            sourceHeight,
            sourceX,
            sourceY,
            0
          )
        );
      output[
        offset + 1
      ] =
        Math.round(
          bilinearSample(
            pixels,
            sourceWidth,
            sourceHeight,
            sourceX,
            sourceY,
            1
          )
        );
      output[
        offset + 2
      ] =
        Math.round(
          bilinearSample(
            pixels,
            sourceWidth,
            sourceHeight,
            sourceX,
            sourceY,
            2
          )
        );
      output[
        offset + 3
      ] = 255;
    }
  }

  return {
    pixels: output,
    width: MODEL_SIZE,
    height: MODEL_SIZE,
    meta: {
      sourceWidth,
      sourceHeight,
      modelWidth:
        MODEL_SIZE,
      modelHeight:
        MODEL_SIZE,
      contentWidth,
      contentHeight,
      padX,
      padY,
      scale,
    },
  };
}

function rgbaToTensor(
  pixels,
  width,
  height,
  token
) {
  const pixelCount =
    width * height;
  const data =
    new Float32Array(
      pixelCount * 3
    );

  for (
    let pixel = 0;
    pixel < pixelCount;
    pixel += 1
  ) {
    if (
      pixel % 8192 === 0
    ) {
      ensureActive(
        token,
        'AI_CANCELLED_DURING_TENSOR'
      );
    }

    const offset =
      pixel * 4;
    const red =
      Number(
        pixels[offset]
      ) / 255;
    const green =
      Number(
        pixels[
          offset + 1
        ]
      ) / 255;
    const blue =
      Number(
        pixels[
          offset + 2
        ]
      ) / 255;

    data[pixel] =
      (red - 0.5) / 0.5;
    data[
      pixelCount +
      pixel
    ] =
      (green - 0.5) / 0.5;
    data[
      pixelCount * 2 +
      pixel
    ] =
      (blue - 0.5) / 0.5;
  }

  return new ort.Tensor(
    'float32',
    data,
    [
      1,
      3,
      height,
      width,
    ]
  );
}

function selectMatte(
  session,
  outputs
) {
  const preferred = [
    'output',
    'matte',
    'pha',
    'output_0',
  ];

  for (
    const name of preferred
  ) {
    if (
      outputs[name]?.data
    ) {
      return outputs[name];
    }
  }

  for (
    let index =
      session.outputNames
        .length - 1;
    index >= 0;
    index -= 1
  ) {
    const output =
      outputs[
        session.outputNames[
          index
        ]
      ];

    if (output?.data) {
      return output;
    }
  }

  throw new Error(
    'AI_MATTE_OUTPUT_NOT_FOUND'
  );
}

function validateMatte(
  matte,
  fallbackWidth,
  fallbackHeight
) {
  const dimensions =
    matte?.dims || [];
  const width =
    Number(
      dimensions[
        dimensions.length - 1
      ] ||
      fallbackWidth
    );
  const height =
    Number(
      dimensions[
        dimensions.length - 2
      ] ||
      fallbackHeight
    );

  if (
    width <= 0 ||
    height <= 0 ||
    !matte?.data ||
    matte.data.length <
      width * height
  ) {
    throw new Error(
      'AI_MATTE_SHAPE_INVALID'
    );
  }

  return {
    width,
    height,
  };
}

function cropLetterboxAlpha(
  alpha,
  matteWidth,
  matteHeight,
  meta
) {
  const scaleX =
    matteWidth /
    meta.modelWidth;
  const scaleY =
    matteHeight /
    meta.modelHeight;
  const cropX =
    Math.max(
      0,
      Math.round(
        meta.padX *
        scaleX
      )
    );
  const cropY =
    Math.max(
      0,
      Math.round(
        meta.padY *
        scaleY
      )
    );
  const cropWidth =
    Math.max(
      1,
      Math.round(
        meta.contentWidth *
        scaleX
      )
    );
  const cropHeight =
    Math.max(
      1,
      Math.round(
        meta.contentHeight *
        scaleY
      )
    );
  const cropped =
    new Float32Array(
      cropWidth *
      cropHeight
    );

  for (
    let y = 0;
    y < cropHeight;
    y += 1
  ) {
    for (
      let x = 0;
      x < cropWidth;
      x += 1
    ) {
      const sourceIndex =
        (
          Math.min(
            matteHeight - 1,
            y + cropY
          ) *
          matteWidth
        ) +
        Math.min(
          matteWidth - 1,
          x + cropX
        );
      const value =
        Number(
          alpha[sourceIndex] ||
          0
        );

      cropped[
        y * cropWidth + x
      ] =
        Math.max(
          0,
          Math.min(
            1,
            value
          )
        );
    }
  }

  return {
    alpha: cropped,
    width: cropWidth,
    height: cropHeight,
  };
}

export async function runPortraitMatting({
  pixels,
  width,
  height,
  token,
  timeoutMs = 45000,
}) {
  ensureActive(
    token,
    'AI_CANCELLED_BEFORE_SESSION'
  );

  const prepared =
    prepareLetterboxedPixels({
      pixels,
      width,
      height,
      token,
    });
  const modelUri =
    await loadModelUri();

  ensureActive(
    token,
    'AI_CANCELLED_BEFORE_MODEL_LOAD'
  );

  const session =
    await ort.InferenceSession.create(
      modelUri,
      {
        executionMode:
          'sequential',
        graphOptimizationLevel:
          'all',
        enableCpuMemArena:
          true,
        enableMemPattern:
          true,
        intraOpNumThreads:
          2,
        interOpNumThreads:
          1,
        logSeverityLevel:
          3,
      }
    );

  validateSession(
    session
  );

  const tensor =
    rgbaToTensor(
      prepared.pixels,
      prepared.width,
      prepared.height,
      token
    );
  const inputName =
    session.inputNames[0];
  let timer = null;
  let timeoutTriggered =
    false;

  const inference =
    session.run(
      {
        [inputName]:
          tensor,
      },
      {
        tag:
          'MBW_AI_PORTRAIT_CUTOUT',
        logSeverityLevel:
          3,
      }
    );

  const timeout =
    new Promise(
      (_, reject) => {
        timer =
          setTimeout(
            () => {
              timeoutTriggered =
                true;

              if (token) {
                token.timedOut =
                  true;
              }

              reject(
                new Error(
                  'AI_INFERENCE_SOFT_TIMEOUT'
                )
              );
            },
            timeoutMs
          );
      }
    );

  try {
    const outputs =
      await Promise.race([
        inference,
        timeout,
      ]);

    clearTimeout(timer);

    ensureActive(
      token,
      'AI_CANCELLED_AFTER_INFERENCE'
    );

    const matte =
      selectMatte(
        session,
        outputs
      );
    const shape =
      validateMatte(
        matte,
        prepared.width,
        prepared.height
      );
    const alpha =
      new Float32Array(
        shape.width *
        shape.height
      );

    for (
      let index = 0;
      index < alpha.length;
      index += 1
    ) {
      const value =
        Number(
          matte.data[index]
        );

      alpha[index] =
        Number.isFinite(value)
          ? Math.max(
              0,
              Math.min(
                1,
                value
              )
            )
          : 0;
    }

    const cropped =
      cropLetterboxAlpha(
        alpha,
        shape.width,
        shape.height,
        prepared.meta
      );

    const outputNames = [
      ...session.outputNames,
    ];

    await session.release();

    return {
      ...cropped,
      preprocessing:
        prepared.meta,
      inputName,
      outputNames,
      elapsedMs:
        Date.now() -
        token.startedAt,
      hardCancelSupported:
        false,
    };
  } catch (error) {
    clearTimeout(timer);

    if (timeoutTriggered) {
      inference
        .catch(
          () => null
        )
        .finally(
          () =>
            session.release()
        );
    } else {
      await session.release();
    }

    throw error;
  }
}

// Keeps MODNet in Metro's static asset graph.
void MODNET_MODEL_ASSET_MODULE;
