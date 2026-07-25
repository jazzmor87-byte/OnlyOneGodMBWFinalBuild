import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

export async function choosePersonalImage() {
  const permission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    return {
      ok: false,
      code: 'MEDIA_PERMISSION_DENIED',
    };
  }

  const result =
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

  if (result.canceled || !result.assets?.[0]?.uri) {
    return {
      ok: false,
      code: 'IMAGE_SELECTION_CANCELLED',
    };
  }

  return {
    ok: true,
    uri: result.assets[0].uri,
    width: result.assets[0].width || 0,
    height: result.assets[0].height || 0,
  };
}

export async function capturePersonalImage() {
  const permission =
    await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    return {
      ok: false,
      code: 'CAMERA_PERMISSION_DENIED',
    };
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    quality: 1,
  });

  if (result.canceled || !result.assets?.[0]?.uri) {
    return {
      ok: false,
      code: 'CAMERA_CAPTURE_CANCELLED',
    };
  }

  return {
    ok: true,
    uri: result.assets[0].uri,
    width: result.assets[0].width || 0,
    height: result.assets[0].height || 0,
  };
}

export async function transformImage(
  uri,
  operations = [],
  options = {}
) {
  const result =
    await ImageManipulator.manipulateAsync(
      uri,
      operations,
      {
        compress: options.compress ?? 1,
        format:
          options.format ??
          ImageManipulator.SaveFormat.PNG,
      }
    );

  return {
    ok: true,
    uri: result.uri,
    width: result.width,
    height: result.height,
  };
}

export async function captureStudioCanvas(ref) {
  const uri = await captureRef(ref, {
    format: 'png',
    quality: 1,
    result: 'tmpfile',
  });

  return {
    ok: true,
    uri,
  };
}

export async function saveToMBWVault(
  uri,
  name = `mbw-photo-studio-${Date.now()}.png`
) {
  const folder =
    `${FileSystem.documentDirectory}mbw-photo-studio/`;

  const info = await FileSystem.getInfoAsync(folder);

  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(folder, {
      intermediates: true,
    });
  }

  const target = `${folder}${name}`;
  await FileSystem.copyAsync({
    from: uri,
    to: target,
  });

  return {
    ok: true,
    uri: target,
  };
}

export async function exportToGallery(uri) {
  const permission =
    await MediaLibrary.requestPermissionsAsync(
      true,
      ['photo']
    );

  if (!permission.granted) {
    return {
      ok: false,
      code: 'GALLERY_WRITE_PERMISSION_DENIED',
    };
  }

  await MediaLibrary.saveToLibraryAsync(uri);

  return {
    ok: true,
    uri,
  };
}
