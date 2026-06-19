import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { AppButton } from '@/components/ui/Button';
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
  const { showToast } = useToast(); const config = getDetector(kind); const responsive = useResponsive(); const [asset, setAsset] = useState<ImageAsset | null>(null); const [imageReady, setImageReady] = useState(false); const addReport = useReportStore((s) => s.addReport);
  const mutation = useMutation<DetectorResult, ApiError, ImageAsset>({ mutationFn: async (image) => {
    if (kind === 'face') return facefitApi.analyzeFace(image); if (kind === 'eye') return facefitApi.analyzeEye(image); if (kind === 'nose') return facefitApi.analyzeNose(image); if (kind === 'lips') return facefitApi.analyzeLips(image); if (kind === 'age') return facefitApi.analyzeAge(image); return facefitApi.analyzeSymmetry(image);
  }, onSuccess: (data, image) => { analytics.track('scan_completed', { kind }); if (kind === 'face' && 'face_shape' in data) addReport(data, image.uri); }, onError: (error) => { analytics.track('scan_failed', { kind }); showToast(error.message); } });
  const analyze = (image: ImageAsset) => { analytics.track('scan_started', { kind }); mutation.reset(); setImageReady(false); setAsset(image); mutation.mutate(image); };
  const reset = () => { mutation.reset(); setImageReady(false); setAsset(null); };
  return <ScreenWrapper><ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.screen}><View style={[styles.content, { maxWidth: responsive.contentWidth }]}> 
    <GradientHeader eyebrow="AI studio" title={config.title} description={config.description} icon={icons[kind]} />
    {asset ? <DetectorOverlay asset={asset} kind={kind} result={mutation.data ?? null} processing={mutation.isPending || !imageReady} loadingLabel={imageReady ? config.loadingLabel : 'Preparing photo'} onImageReady={() => setImageReady(true)} /> : null}
    {!asset ? <ImagePickerPanel kind={kind} disabled={mutation.isPending} title={config.uploadTitle} description={config.uploadDescription} uploadAction={config.uploadAction} cameraAction={config.cameraAction} filePrefix={config.filePrefix} onPick={analyze} /> : null}
    {mutation.isError && !mutation.isPending ? <AppButton title="Choose another photo" icon="refresh-outline" variant="secondary" onPress={reset} /> : null}
    {!mutation.isPending ? <ResultCards kind={kind} result={mutation.data ?? null} emptyTitle={config.emptyTitle} onReset={mutation.data ? reset : undefined} scanId={kind === 'face' && mutation.data && 'scan_id' in mutation.data ? mutation.data.scan_id : undefined} /> : null}
  </View></ScrollView></ScreenWrapper>;
}
const styles = StyleSheet.create({ screen: { padding: spacing.md, paddingBottom: 44 }, content: { width: '100%', alignSelf: 'center', gap: spacing.md } });
