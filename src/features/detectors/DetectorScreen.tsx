import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { spacing } from '@/constants/theme';
import { analytics } from '@/services/analytics';
import { facefitApi } from '@/services/facefitApi';
import { useReportStore } from '@/store/reportStore';
import { useToast } from '@/hooks/useToast';
import type { ApiError } from '@/services/apiClient';
import type { DetectorKind } from '@/types/api';
import type { ImageAsset } from '@/utils/formData';
import { useResponsive } from '@/utils/responsive';
import { getDetector } from './detectorConfig';
import { DetectorOverlay } from './DetectorOverlay';
import { ImagePickerPanel } from './ImagePickerPanel';
import { ResultCards, type DetectorResult } from './ResultCards';

const icons = { face: 'scan-outline', eye: 'eye-outline', nose: 'body-outline', lips: 'happy-outline', age: 'time-outline', symmetry: 'analytics-outline' } as const;
export function DetectorScreen({ kind }: { kind: DetectorKind }) {
  const { showToast } = useToast(); const config = getDetector(kind); const responsive = useResponsive(); const [asset, setAsset] = useState<ImageAsset | null>(null); const addReport = useReportStore((s) => s.addReport);
  const mutation = useMutation<DetectorResult, ApiError, ImageAsset>({ mutationFn: async (image) => {
    if (kind === 'face') return facefitApi.analyzeFace(image); if (kind === 'eye') return facefitApi.analyzeEye(image); if (kind === 'nose') return facefitApi.analyzeNose(image); if (kind === 'lips') return facefitApi.analyzeLips(image); if (kind === 'age') return facefitApi.analyzeAge(image); return facefitApi.analyzeSymmetry(image);
  }, onSuccess: (data) => { analytics.track('scan_completed', { kind }); if (kind === 'face' && 'face_shape' in data) addReport(data, asset?.uri); }, onError: (error) => { analytics.track('scan_failed', { kind }); showToast(error.message); } });
  const analyze = (image: ImageAsset) => { analytics.track('scan_started', { kind }); mutation.reset(); setAsset(image); mutation.mutate(image); };
  return <ScreenWrapper><ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.screen}><View style={[styles.content, { maxWidth: responsive.contentWidth }]}> 
    <GradientHeader eyebrow="AI feature studio" title={config.title} description={config.description} icon={icons[kind]} />
    {asset ? <DetectorOverlay asset={asset} kind={kind} result={mutation.data ?? null} /> : null}
    <ImagePickerPanel disabled={mutation.isPending} processing={mutation.isPending} loadingLabel={config.loadingLabel} title={config.uploadTitle} description={config.uploadDescription} uploadAction={config.uploadAction} cameraAction={config.cameraAction} filePrefix={config.filePrefix} onPick={analyze} />
    {!mutation.isPending ? <ResultCards kind={kind} result={mutation.data ?? null} emptyTitle={config.emptyTitle} /> : null}
  </View></ScrollView></ScreenWrapper>;
}
const styles = StyleSheet.create({ screen: { padding: spacing.md, paddingBottom: 44 }, content: { width: '100%', alignSelf: 'center', gap: spacing.md } });
