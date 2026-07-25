export const EDITOR_WIDTH = 1080;
export const EDITOR_HEIGHT = 1600;
export const EDITOR_ASPECT =
  EDITOR_WIDTH / EDITOR_HEIGHT;

const finite = (
  value,
  fallback = 0
) => {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

export function createEditorGeometry({
  width,
  height,
} = {}) {
  const viewWidth = Math.max(
    1,
    finite(width, 1)
  );
  const viewHeight = Math.max(
    1,
    finite(height, 1)
  );

  return {
    designWidth: EDITOR_WIDTH,
    designHeight: EDITOR_HEIGHT,
    viewWidth,
    viewHeight,
    scaleX:
      viewWidth / EDITOR_WIDTH,
    scaleY:
      viewHeight / EDITOR_HEIGHT,
    ready:
      viewWidth > 1 &&
      viewHeight > 1,
  };
}

export function viewToDesign(
  point,
  geometry
) {
  return {
    x:
      finite(point?.x) /
      Math.max(
        geometry?.scaleX || 1,
        0.000001
      ),
    y:
      finite(point?.y) /
      Math.max(
        geometry?.scaleY || 1,
        0.000001
      ),
  };
}

export function designToView(
  point,
  geometry
) {
  return {
    x:
      finite(point?.x) *
      (geometry?.scaleX || 1),
    y:
      finite(point?.y) *
      (geometry?.scaleY || 1),
  };
}

export function clampDesignPoint(
  point
) {
  return {
    x: Math.max(
      0,
      Math.min(
        EDITOR_WIDTH,
        finite(point?.x)
      )
    ),
    y: Math.max(
      0,
      Math.min(
        EDITOR_HEIGHT,
        finite(point?.y)
      )
    ),
  };
}

export function subjectScaleX(
  transform = {}
) {
  return Math.max(
    0.05,
    finite(transform.scale, 1)
  ) * (
    finite(
      transform.flipX,
      1
    ) < 0
      ? -1
      : 1
  );
}

export function subjectScaleY(
  transform = {}
) {
  return Math.max(
    0.05,
    finite(transform.scale, 1)
  ) * (
    finite(
      transform.flipY,
      1
    ) < 0
      ? -1
      : 1
  );
}

export function subjectTransformList(
  transform = {}
) {
  return [
    {
      translateX:
        finite(
          transform.translateX
        ),
    },
    {
      translateY:
        finite(
          transform.translateY
        ),
    },
    {
      rotate:
        (
          finite(
            transform.rotation
          ) * Math.PI
        ) / 180,
    },
    {
      scaleX:
        subjectScaleX(
          transform
        ),
    },
    {
      scaleY:
        subjectScaleY(
          transform
        ),
    },
  ];
}

export function designToSubjectPoint(
  point,
  transform = {}
) {
  const centerX =
    EDITOR_WIDTH / 2;
  const centerY =
    EDITOR_HEIGHT / 2;
  const translatedX =
    finite(point?.x) -
    centerX -
    finite(
      transform.translateX
    );
  const translatedY =
    finite(point?.y) -
    centerY -
    finite(
      transform.translateY
    );
  const angle =
    (
      finite(
        transform.rotation
      ) * Math.PI
    ) / 180;
  const cosine =
    Math.cos(-angle);
  const sine =
    Math.sin(-angle);
  const rotatedX =
    translatedX * cosine -
    translatedY * sine;
  const rotatedY =
    translatedX * sine +
    translatedY * cosine;

  return clampDesignPoint({
    x:
      centerX +
      rotatedX /
        subjectScaleX(
          transform
        ),
    y:
      centerY +
      rotatedY /
        subjectScaleY(
          transform
        ),
  });
}

export function viewToSubjectPoint(
  point,
  geometry,
  transform
) {
  return designToSubjectPoint(
    viewToDesign(
      point,
      geometry
    ),
    transform
  );
}
