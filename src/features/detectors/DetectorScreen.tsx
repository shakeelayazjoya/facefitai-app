import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { analytics } from '@/services/analytics';
import { facefitApi } from '@/services/facefitApi';
import { useReportStore } from '@/store/reportStore';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useToast } from '@/hooks/useToast';
import type { ApiError } from '@/services/apiClient';
import type { DetectorKind } from '@/types/api';
import type { ImageAsset } from '@/utils/formData';
import { getDetector } from './detectorConfig';
import { DetectorOverlay } from './DetectorOverlay';
import { ImagePickerPanel } from './ImagePickerPanel';
import { ResultCards, type DetectorResult } from './ResultCards';
interface Props { kind: DetectorKind }
export function DetectorScreen({ kind }: Props) {
  const theme = useAppTheme(); const { showToast } = useToast(); const config = getDetector(kind); const [asset, setAsset] = useState<ImageAsset | null>(null); const addReport = useReportStore((s) => s.addReport);
  const mutation = useMutation<DetectorResult, ApiError, ImageAsset>({ mutationFn: async (asset) => {
    if (kind === 'face') return await facefitApi.analyzeFace(asset);
    if (kind === 'eye') return await facefitApi.analyzeEye(asset);
    if (kind === 'nose') return await facefitApi.analyzeNose(asset);
    if (kind === 'lips') return await facefitApi.analyzeLips(asset);
    if (kind === 'age') return await facefitApi.analyzeAge(asset);
    return await facefitApi.analyzeSymmetry(asset);
  }, onSuccess: (data) => { analytics.track('scan_completed', { kind }); if (kind === 'face' && 'face_shape' in data) addReport(data, asset?.uri); }, onError: (error: ApiError) => { analytics.track('scan_failed', { kind }); showToast(error.message); } });
  const result = useMemo(() => mutation.data ?? null, [mutation.data]);
  function analyze(nextAsset: ImageAsset) { analytics.track('scan_started', { kind }); mutation.reset(); setAsset(nextAsset); mutation.mutate(nextAsset); }
  return <ScreenWrapper><ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}><Animated.View entering={FadeInUp.duration(350)}><Text style={[styles.kicker, { color: theme.primary }]}>FaceShape Detector</Text><Text style={[styles.title, { color: theme.text }]}>{config.title}</Text><Text style={[styles.description, { color: theme.mutedText }]}>{config.description}</Text></Animated.View>{asset ? <DetectorOverlay asset={asset} kind={kind} result={result} /> : null}<ImagePickerPanel disabled={mutation.isPending} title={config.uploadTitle} description={config.uploadDescription} uploadAction={config.uploadAction} cameraAction={config.cameraAction} filePrefix={config.filePrefix} onPick={analyze} />{mutation.isPending ? <LoadingSpinner label={config.loadingLabel} /> : <ResultCards result={result} emptyTitle={config.emptyTitle} />}</ScrollView></ScreenWrapper>;
}
const styles = StyleSheet.create({ content: { padding: 18, gap: 16, paddingBottom: 40 }, kicker: { textAlign: 'center', fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' }, title: { textAlign: 'center', fontSize: 30, lineHeight: 36, fontWeight: '900', marginTop: 10 }, description: { textAlign: 'center', lineHeight: 22, marginTop: 8 } });
