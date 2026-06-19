import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppBadge } from '@/components/ui/Badge';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { LoadingSkeleton } from '@/components/ui/SkeletonBlock';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { ResultCards } from '@/features/detectors/ResultCards';
import { facefitApi } from '@/services/facefitApi';
import { spacing } from '@/constants/theme';
import { useResponsive } from '@/utils/responsive';

export function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); const responsive = useResponsive(); const query = useQuery({ queryKey: ['scan', id], queryFn: () => facefitApi.getScan(id), enabled: Boolean(id) });
  return <ProtectedRoute><ScreenWrapper><ScrollView contentContainerStyle={styles.screen}><View style={[styles.content, { maxWidth: responsive.contentWidth }]}><GradientHeader eyebrow="Saved scan" title="Report" description={query.data?.created_at ? new Date(query.data.created_at).toLocaleDateString() : 'Loading'} icon="document-text-outline" />{query.isLoading ? <><LoadingSkeleton height={112} /><LoadingSkeleton height={180} /></> : <><AppBadge label={query.data?.status ?? 'pending'} tone="primary" /><ResultCards kind="face" result={query.data?.report ?? null} emptyTitle="Not ready" scanId={query.data?.id} /></>}</View></ScrollView></ScreenWrapper></ProtectedRoute>;
}
const styles = StyleSheet.create({ screen: { padding: spacing.md, paddingBottom: 40 }, content: { width: '100%', alignSelf: 'center', gap: spacing.md } });
