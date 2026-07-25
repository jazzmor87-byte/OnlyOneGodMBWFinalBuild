import {
  captureRef,
} from 'react-native-view-shot';
import {
  EDITOR_HEIGHT,
  EDITOR_WIDTH,
} from '../geometry/editorGeometry';

export async function captureMeasuredEditor(
  ref
) {
  if (!ref?.current) {
    throw new Error(
      'EDITOR_CAPTURE_REF_MISSING'
    );
  }

  const uri =
    await captureRef(
      ref,
      {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
        width:
          EDITOR_WIDTH,
        height:
          EDITOR_HEIGHT,
        handleGLSurfaceViewOnAndroid:
          true,
      }
    );

  return {
    ok: true,
    uri,
    width:
      EDITOR_WIDTH,
    height:
      EDITOR_HEIGHT,
  };
}
