import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const INDEX_KEY = '@mbw/ai-photo-studio/project-vault/v1';
const ROOT = `${FileSystem.documentDirectory}mbw-ai-photo-studio-projects/`;

async function ensureDirectory(path) {
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
  }
}

async function readIndex() {
  try {
    const raw = await AsyncStorage.getItem(INDEX_KEY);
    const value = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value : [];
  } catch (_error) {
    return [];
  }
}

async function writeIndex(entries) {
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(entries.slice(0, 50)));
}

function serializableSubject(subject = {}) {
  return {
    imageUri: subject.imageUri || null,
    imageMeta: subject.imageMeta || null,
    transform: subject.transform || null,
    adjustments: subject.adjustments || null,
    aiStatus: subject.aiStatus === 'READY' ? 'REQUIRES_AI_RELOAD' : subject.aiStatus || 'IDLE',
  };
}

async function persistSubjectImage(projectFolder, slotId, subject = {}) {
  if (!subject.imageUri) {
    return serializableSubject(subject);
  }

  const target = `${projectFolder}${slotId}.source`;
  await FileSystem.copyAsync({ from: subject.imageUri, to: target });
  return {
    ...serializableSubject(subject),
    imageUri: target,
  };
}

export async function savePersistentPosterProject({
  templateId,
  subjectsBySlot,
  exportedUri = null,
}) {
  await ensureDirectory(ROOT);

  const id = `MBW_POSTER_${Date.now()}`;
  const projectFolder = `${ROOT}${id}/`;
  await ensureDirectory(projectFolder);

  const persistedSubjects = {};
  const entries = Object.entries(subjectsBySlot || {});
  for (const [slotId, subject] of entries) {
    persistedSubjects[slotId] = await persistSubjectImage(projectFolder, slotId, subject);
  }

  let persistedExportUri = null;
  if (exportedUri) {
    persistedExportUri = `${projectFolder}final.png`;
    await FileSystem.copyAsync({ from: exportedUri, to: persistedExportUri });
  }

  const project = {
    id,
    templateId,
    createdAt: new Date().toISOString(),
    subjectsBySlot: persistedSubjects,
    exportedUri: persistedExportUri,
    contract: {
      backgroundLocked: true,
      foregroundLocked: true,
      textLocked: true,
      logoLocked: true,
      decorativeLocked: true,
      maleModelSlotsOnly: true,
      maximumModelSlots: 2,
    },
  };

  const projectFile = `${projectFolder}project.json`;
  await FileSystem.writeAsStringAsync(projectFile, JSON.stringify(project, null, 2));

  const index = await readIndex();
  const nextIndex = [
    {
      id,
      templateId,
      projectFile,
      exportedUri: persistedExportUri,
      createdAt: project.createdAt,
    },
    ...index.filter((entry) => entry.id !== id),
  ];
  await writeIndex(nextIndex);

  return {
    ok: true,
    project,
    projectFile,
  };
}

export async function listPersistentPosterProjects() {
  return readIndex();
}

export async function loadPersistentPosterProject(projectFile) {
  const raw = await FileSystem.readAsStringAsync(projectFile);
  return JSON.parse(raw);
}

export async function loadLatestPersistentPosterProject() {
  const index = await readIndex();
  if (!index[0]?.projectFile) {
    return { ok: false, code: 'PROJECT_VAULT_EMPTY' };
  }

  try {
    const project = await loadPersistentPosterProject(index[0].projectFile);
    return { ok: true, project };
  } catch (error) {
    return {
      ok: false,
      code: 'PROJECT_VAULT_READ_FAILED',
      message: String(error?.message || error),
    };
  }
}
