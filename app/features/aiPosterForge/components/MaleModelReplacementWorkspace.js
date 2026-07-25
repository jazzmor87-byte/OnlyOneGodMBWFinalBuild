import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AIPortraitSampler from './AIPortraitSampler';
import AIProcessingCourt from './AIProcessingCourt';
import PhotoStudioCanvas from './PhotoStudioCanvas';
import {
  MBW_POSTER_MODEL_SLOT_REGISTRY,
  getPosterTemplateById,
  posterSupportsReplacement,
  validatePosterTemplateRegistry,
} from '../templates/MBWPosterModelSlotRegistry';
import {
  appendAIProof,
} from '../runtime/aiDeviceProofLedger';
import {
  captureMeasuredEditor,
} from '../runtime/measuredExportRuntime';
import {
  choosePersonalImage,
  exportToGallery,
  saveToMBWVault,
} from '../runtime/photoStudioRuntime';
import {
  loadLatestPersistentPosterProject,
  savePersistentPosterProject,
} from '../runtime/persistentPosterProjectVault';

const defaultTransform = Object.freeze({
  scale: 1,
  rotation: 0,
  translateX: 0,
  translateY: 0,
  flipX: 1,
  flipY: 1,
});

const defaultAdjustments = Object.freeze({
  brightness: 0,
  contrast: 1,
  saturation: 1,
  warmth: 0,
  blur: 0,
});

function freshSubject() {
  return {
    imageUri: null,
    imageMeta: null,
    aiMaskImage: null,
    aiMaskMeta: null,
    aiStatus: 'IDLE',
    transform: { ...defaultTransform },
    adjustments: { ...defaultAdjustments },
  };
}

function ActionButton({ label, onPress, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        disabled && styles.actionDisabled,
        pressed && !disabled && styles.actionPressed,
      ]}
    >
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

export default function MaleModelReplacementWorkspace({ navigation }) {
  const registryProof = useMemo(() => validatePosterTemplateRegistry(), []);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [subjectsByTemplate, setSubjectsByTemplate] = useState({});
  const [activeSlotId, setActiveSlotId] = useState(null);
  const [requestId, setRequestId] = useState(0);
  const [requestContext, setRequestContext] = useState(null);
  const [aiPhase, setAIPhase] = useState('IDLE');
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const canvasRef = useRef(null);

  const template = MBW_POSTER_MODEL_SLOT_REGISTRY[templateIndex];
  const subjectsBySlot = subjectsByTemplate[template.id] || {};
  const activeSlot = template.modelSlots.find((item) => item.id === activeSlotId)
    || template.modelSlots[0]
    || null;
  const activeSubject = activeSlot
    ? (subjectsBySlot[activeSlot.id] || freshSubject())
    : null;

  useEffect(() => {
    setActiveSlotId(template.modelSlots[0]?.id || null);
  }, [template.id]);

  const updateSubject = useCallback((templateId, slotId, patch) => {
    setSubjectsByTemplate((current) => {
      const currentTemplate = current[templateId] || {};
      const currentSubject = currentTemplate[slotId] || freshSubject();
      return {
        ...current,
        [templateId]: {
          ...currentTemplate,
          [slotId]: {
            ...currentSubject,
            ...patch,
          },
        },
      };
    });
  }, []);

  const selectImage = useCallback(async () => {
    if (!activeSlot) {
      return;
    }

    try {
      setBusy(true);
      const result = await choosePersonalImage();
      if (!result.ok) {
        if (result.code !== 'IMAGE_SELECTION_CANCELLED') {
          Alert.alert('MBW AI PHOTO STUDIO', result.code);
        }
        return;
      }

      const nextRequest = requestId + 1;
      updateSubject(template.id, activeSlot.id, {
        imageUri: result.uri,
        imageMeta: { width: result.width, height: result.height },
        aiMaskImage: null,
        aiMaskMeta: null,
        aiStatus: 'PROCESSING',
        transform: { ...defaultTransform },
        adjustments: { ...defaultAdjustments },
      });
      setRequestId(nextRequest);
      setRequestContext({
        templateId: template.id,
        slotId: activeSlot.id,
        requestId: nextRequest,
        uri: result.uri,
      });
      setAIPhase('REQUESTED');

      await appendAIProof('POSTER_SLOT_IMAGE_READY', {
        templateId: template.id,
        slotId: activeSlot.id,
        width: result.width,
        height: result.height,
      });
    } catch (error) {
      Alert.alert('MBW AI PHOTO STUDIO', String(error?.message || error));
    } finally {
      setBusy(false);
    }
  }, [activeSlot, requestId, template.id, updateSubject]);

  const onAISuccess = useCallback(async (result) => {
    if (!requestContext) {
      return;
    }
    updateSubject(requestContext.templateId, requestContext.slotId, {
      aiMaskImage: result.maskImage,
      aiMaskMeta: result.maskMeta,
      aiStatus: 'READY',
    });
    setAIPhase('READY');
    await appendAIProof('POSTER_SLOT_AI_READY', {
      templateId: requestContext.templateId,
      slotId: requestContext.slotId,
      ...result.maskMeta,
    });
  }, [requestContext, updateSubject]);

  const onAIError = useCallback(async (message) => {
    if (requestContext) {
      updateSubject(requestContext.templateId, requestContext.slotId, {
        aiStatus: 'ERROR',
      });
    }
    setAIPhase('ERROR');
    await appendAIProof('POSTER_SLOT_AI_ERROR', {
      templateId: requestContext?.templateId,
      slotId: requestContext?.slotId,
      message,
    });
    Alert.alert('MBW AI CUTOUT', message);
  }, [requestContext, updateSubject]);

  const transformActive = useCallback((patch) => {
    if (!activeSlot || !activeSubject) {
      return;
    }
    updateSubject(template.id, activeSlot.id, {
      transform: {
        ...activeSubject.transform,
        ...patch,
      },
    });
  }, [activeSlot, activeSubject, template.id, updateSubject]);

  const moveTemplate = useCallback((delta) => {
    setTemplateIndex((current) => {
      const length = MBW_POSTER_MODEL_SLOT_REGISTRY.length;
      return (current + delta + length) % length;
    });
  }, []);

  const exportPoster = useCallback(async (toGallery) => {
    try {
      setBusy(true);
      setExporting(true);
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const captured = await captureMeasuredEditor(canvasRef);
      const result = toGallery
        ? await exportToGallery(captured.uri)
        : await saveToMBWVault(captured.uri);

      if (!result.ok) {
        throw new Error(result.code || 'EXPORT_FAILED');
      }

      const vaultResult = await savePersistentPosterProject({
        templateId: template.id,
        subjectsBySlot,
        exportedUri: captured.uri,
      });

      await appendAIProof('POSTER_TRANSPLANT_EXPORT', {
        templateId: template.id,
        modelSlotCount: template.modelSlots.length,
        populatedSlotCount: Object.values(subjectsBySlot).filter((item) => item?.imageUri).length,
        width: captured.width,
        height: captured.height,
        persistentProjectId: vaultResult.project.id,
        destination: toGallery ? 'GALLERY' : 'MBW_VAULT',
      });

      Alert.alert('MBW POSTER TRANSPLANT', 'EXPORT COMPLETE');
    } catch (error) {
      Alert.alert('MBW POSTER TRANSPLANT', String(error?.message || error));
    } finally {
      setExporting(false);
      setBusy(false);
    }
  }, [subjectsBySlot, template]);

  const saveProject = useCallback(async () => {
    try {
      setBusy(true);
      const result = await savePersistentPosterProject({
        templateId: template.id,
        subjectsBySlot,
      });
      await appendAIProof('POSTER_PROJECT_SAVED', {
        templateId: template.id,
        projectId: result.project.id,
      });
      Alert.alert('MBW PROJECT VAULT', 'PROJECT SAVED');
    } catch (error) {
      Alert.alert('MBW PROJECT VAULT', String(error?.message || error));
    } finally {
      setBusy(false);
    }
  }, [subjectsBySlot, template.id]);

  const restoreLatest = useCallback(async () => {
    try {
      setBusy(true);
      const result = await loadLatestPersistentPosterProject();
      if (!result.ok) {
        Alert.alert('MBW PROJECT VAULT', result.code);
        return;
      }

      const restoredTemplate = getPosterTemplateById(result.project.templateId);
      const restoredIndex = MBW_POSTER_MODEL_SLOT_REGISTRY.findIndex((item) => item.id === restoredTemplate.id);
      setTemplateIndex(Math.max(0, restoredIndex));
      setSubjectsByTemplate((current) => ({
        ...current,
        [restoredTemplate.id]: Object.fromEntries(
          Object.entries(result.project.subjectsBySlot || {}).map(([slotId, subject]) => [
            slotId,
            {
              ...freshSubject(),
              ...subject,
              aiMaskImage: null,
              aiMaskMeta: null,
              aiStatus: subject.imageUri ? 'REQUIRES_AI_RELOAD' : 'IDLE',
            },
          ])
        ),
      }));
      Alert.alert('MBW PROJECT VAULT', 'LATEST PROJECT RESTORED');
    } catch (error) {
      Alert.alert('MBW PROJECT VAULT', String(error?.message || error));
    } finally {
      setBusy(false);
    }
  }, []);

  const replacementEnabled = posterSupportsReplacement(template);
  const populatedSlots = template.modelSlots.filter((modelSlot) => subjectsBySlot[modelSlot.id]?.imageUri).length;
  const exportReady = replacementEnabled && populatedSlots === template.modelSlots.length && !busy;

  return (
    <SafeAreaView style={styles.root}>
      <AIPortraitSampler
        uri={requestContext?.uri || null}
        requestId={requestContext?.requestId || 0}
        active={Boolean(requestContext && aiPhase !== 'READY' && aiPhase !== 'ERROR')}
        onStatus={setAIPhase}
        onSuccess={onAISuccess}
        onError={onAIError}
      />

      <AIProcessingCourt
        visible={Boolean(requestContext && aiPhase !== 'READY' && aiPhase !== 'ERROR')}
        message={aiPhase}
      />

      <View style={styles.topBar}>
        <ActionButton
          label="←"
          onPress={() => navigation?.canGoBack?.() ? navigation.goBack() : navigation?.navigate?.('MainHub')}
        />
        <View style={styles.heading}>
          <Text style={styles.title}>MBW AI POSTER TRANSPLANT</Text>
          <Text style={styles.status}>
            {registryProof.ok ? `${template.title} · ${template.modelCount} MODEL SLOT${template.modelCount === 1 ? '' : 'S'}` : 'REGISTRY BLOCKED'}
          </Text>
        </View>
        <ActionButton label="AI" onPress={selectImage} disabled={!activeSlot || busy} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.templateRail}>
          <ActionButton label="‹" onPress={() => moveTemplate(-1)} disabled={busy} />
          <Text style={styles.templateName}>{template.title}</Text>
          <ActionButton label="›" onPress={() => moveTemplate(1)} disabled={busy} />
        </View>

        <PhotoStudioCanvas
          ref={canvasRef}
          template={template}
          subjectsBySlot={subjectsBySlot}
          activeSlotId={activeSlot?.id || null}
          onSelectSlot={setActiveSlotId}
          exporting={exporting}
        />

        {!replacementEnabled ? (
          <Text style={styles.blockedText}>NO MALE MODEL SLOT · REPLACEMENT DISABLED</Text>
        ) : (
          <>
            <View style={styles.slotRail}>
              {template.modelSlots.map((modelSlot) => (
                <ActionButton
                  key={modelSlot.id}
                  label={modelSlot.id.replace('MODEL_', 'M')}
                  onPress={() => setActiveSlotId(modelSlot.id)}
                  disabled={busy}
                />
              ))}
              <ActionButton label="IMPORT" onPress={selectImage} disabled={!activeSlot || busy} />
            </View>

            <View style={styles.slotRail}>
              <ActionButton
                label="←"
                onPress={() => transformActive({ translateX: activeSubject.transform.translateX - 20 })}
                disabled={!activeSubject?.imageUri || busy}
              />
              <ActionButton
                label="→"
                onPress={() => transformActive({ translateX: activeSubject.transform.translateX + 20 })}
                disabled={!activeSubject?.imageUri || busy}
              />
              <ActionButton
                label="↑"
                onPress={() => transformActive({ translateY: activeSubject.transform.translateY - 20 })}
                disabled={!activeSubject?.imageUri || busy}
              />
              <ActionButton
                label="↓"
                onPress={() => transformActive({ translateY: activeSubject.transform.translateY + 20 })}
                disabled={!activeSubject?.imageUri || busy}
              />
              <ActionButton
                label="＋"
                onPress={() => transformActive({ scale: Math.min(3, activeSubject.transform.scale + 0.05) })}
                disabled={!activeSubject?.imageUri || busy}
              />
              <ActionButton
                label="−"
                onPress={() => transformActive({ scale: Math.max(0.35, activeSubject.transform.scale - 0.05) })}
                disabled={!activeSubject?.imageUri || busy}
              />
              <ActionButton
                label="↻"
                onPress={() => transformActive({ rotation: activeSubject.transform.rotation + 2 })}
                disabled={!activeSubject?.imageUri || busy}
              />
            </View>
          </>
        )}

        <View style={styles.slotRail}>
          <ActionButton label="SAVE PROJECT" onPress={saveProject} disabled={busy} />
          <ActionButton label="RESTORE" onPress={restoreLatest} disabled={busy} />
          <ActionButton label="VAULT" onPress={() => exportPoster(false)} disabled={!exportReady} />
          <ActionButton label="GALLERY" onPress={() => exportPoster(true)} disabled={!exportReady} />
        </View>

        <Text style={styles.proofLine}>
          BACKGROUND · FOREGROUND · TEXT · LOGO · DECORATIVE LAYERS LOCKED
        </Text>
        <Text style={styles.proofLine}>
          {populatedSlots}/{template.modelSlots.length} MODEL SLOTS READY · EXPORT 1080×1600
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#030202',
  },
  topBar: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  heading: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#D6A643',
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  status: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 1,
    textAlign: 'center',
  },
  scroll: {
    paddingHorizontal: 12,
    paddingBottom: 44,
    gap: 12,
  },
  templateRail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  templateName: {
    minWidth: 160,
    color: '#F2E7D3',
    textAlign: 'center',
    letterSpacing: 1,
  },
  slotRail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  action: {
    minWidth: 48,
    minHeight: 48,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(214,166,67,0.62)',
    backgroundColor: 'rgba(15,4,6,0.78)',
  },
  actionPressed: {
    transform: [{ scale: 0.96 }],
  },
  actionDisabled: {
    opacity: 0.28,
  },
  actionText: {
    color: '#D6A643',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  blockedText: {
    color: '#A44A4A',
    textAlign: 'center',
    letterSpacing: 1,
  },
  proofLine: {
    color: 'rgba(255,255,255,0.52)',
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: 0.8,
  },
});
