import * as FileSystem
  from 'expo-file-system/legacy';

const folder =
  `${FileSystem.documentDirectory}mbw-ai-device-proof/`;
const path =
  `${folder}latest.jsonl`;

async function ensureFolder() {
  const info =
    await FileSystem.getInfoAsync(
      folder
    );

  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(
      folder,
      {
        intermediates: true,
      }
    );
  }
}

export async function appendAIProof(
  event,
  detail = {}
) {
  await ensureFolder();

  const row = {
    event,
    detail,
    at:
      new Date()
        .toISOString(),
  };
  const info =
    await FileSystem.getInfoAsync(
      path
    );
  const previous =
    info.exists
      ? await FileSystem
          .readAsStringAsync(
            path
          )
      : '';

  await FileSystem
    .writeAsStringAsync(
      path,
      `${previous}${JSON.stringify(row)}\n`,
      {
        encoding:
          FileSystem
            .EncodingType
            .UTF8,
      }
    );

  return {
    ok: true,
    path,
    row,
  };
}

export async function readAIProof() {
  const info =
    await FileSystem.getInfoAsync(
      path
    );

  if (!info.exists) {
    return {
      ok: true,
      path,
      rows: [],
    };
  }

  const content =
    await FileSystem
      .readAsStringAsync(
        path
      );

  return {
    ok: true,
    path,
    rows: content
      .split('\n')
      .filter(Boolean)
      .map(
        (line) =>
          JSON.parse(line)
      ),
  };
}
