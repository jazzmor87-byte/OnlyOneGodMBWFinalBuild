import React, { useMemo } from 'react';
import {
  Blur,
  Canvas,
  ColorMatrix,
  Group,
  Image,
  useImage,
} from '@shopify/react-native-skia';
import { buildColorMatrix } from '../engines/colorMatrixEngine';

export default function SkiaPhotoCanvas({
  uri,
  width = 1080,
  height = 1600,
  adjustments = {},
  transform = {},
}) {
  const image = useImage(uri || null);

  const matrix = useMemo(
    () => buildColorMatrix(adjustments),
    [
      adjustments.brightness,
      adjustments.contrast,
      adjustments.saturation,
      adjustments.warmth,
    ]
  );

  if (!image) return null;

  const scale = Number(transform.scale || 1);
  const rotation = Number(transform.rotation || 0);
  const translateX = Number(transform.translateX || 0);
  const translateY = Number(transform.translateY || 0);
  const blur = Math.max(0, Number(adjustments.blur || 0));

  return (
    <Canvas style={{ width: '100%', height: '100%' }}>
      <Group
        origin={{ x: width / 2, y: height / 2 }}
        transform={[
          { translateX },
          { translateY },
          { scale },
          { rotate: rotation },
        ]}
      >
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="contain"
        >
          {blur > 0 ? (
            <Blur blur={blur} mode="clamp">
              <ColorMatrix matrix={matrix} />
            </Blur>
          ) : (
            <ColorMatrix matrix={matrix} />
          )}
        </Image>
      </Group>
    </Canvas>
  );
}
