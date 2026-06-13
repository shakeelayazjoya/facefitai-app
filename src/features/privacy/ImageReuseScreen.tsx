import { useMutation } from '@tanstack/react-query';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AppText } from '@/components/ui/AppText';
import { AppBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { ImagePickerPanel } from '@/features/detectors/ImagePickerPanel';
import { spacing } from '@/constants/theme';
import { facefitApi } from '@/services/facefitApi';
import { useToast } from '@/hooks/useToast';
import type { ApiError } from '@/services/apiClient';
import type { ImageAsset } from '@/utils/formData';
import { useResponsive } from '@/utils/responsive';

export function ImageReuseScreen() {
  const { showToast } = useToast(); const responsive = useResponsive(); const mutation = useMutation({ mutationFn: (asset: ImageAsset) => facefitApi.scanImageReuse(asset), onError: (error: ApiError) => showToast(error.message) });
  return <ProtectedRoute><ScreenWrapper><ScrollView contentContainerStyle={styles.screen}><View style={[styles.content, { maxWidth: responsive.contentWidth }]}><GradientHeader eyebrow="Privacy" title="Image check" description="Find possible reuse." icon="shield-checkmark-outline" /><ImagePickerPanel title="Check photo" description="Upload one image." processing={mutation.isPending} loadingLabel="Checking image" disabled={mutation.isPending} onPick={(asset) => mutation.mutate(asset)} />{mutation.data ? <AnimatedCard><AppText variant="h3">Check complete</AppText><View style={styles.badges}><AppBadge tone="primary" label={`${mutation.data.internal_matches.length} internal`} /><AppBadge label={`${mutation.data.external_matches.length} external`} /><AppBadge label={mutation.data.external_status} /></View></AnimatedCard> : !mutation.isPending ? <EmptyState title="No check yet" message="Upload a photo." /> : null}</View></ScrollView></ScreenWrapper></ProtectedRoute>;
}
const styles = StyleSheet.create({ screen: { padding: spacing.md, paddingBottom: 40 }, content: { width: '100%', alignSelf: 'center', gap: spacing.md }, badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md } });
