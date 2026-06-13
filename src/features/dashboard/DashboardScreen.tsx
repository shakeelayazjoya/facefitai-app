import { useMutation, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AppText } from '@/components/ui/AppText';
import { AppBadge } from '@/components/ui/Badge';
import { AppButton } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { ListRow } from '@/components/ui/ListRow';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { LoadingSkeleton } from '@/components/ui/SkeletonBlock';
import { queryKeys } from '@/constants/queryKeys';
import { spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useToast } from '@/hooks/useToast';
import { facefitApi } from '@/services/facefitApi';
import { useAuthStore } from '@/store/authStore';
import type { ApiError } from '@/services/apiClient';
import type { ScanSummary } from '@/types/api';

const date = (value: string) => new Date(value).toLocaleDateString();
export function DashboardScreen() {
  const theme = useAppTheme(); const { showToast } = useToast(); const user = useAuthStore((s) => s.user); const [selected, setSelected] = useState<string[]>([]);
  const history = useQuery({ queryKey: queryKeys.scanHistory, queryFn: facefitApi.getScanHistory, enabled: Boolean(user) }); const favorites = useQuery({ queryKey: queryKeys.favorites, queryFn: facefitApi.getFavorites, enabled: Boolean(user) });
  const compare = useMutation({ mutationFn: () => facefitApi.compareScans(selected), onError: (error: ApiError) => showToast(error.message) });
  const favorite = useMutation({ mutationFn: (scan: ScanSummary) => facefitApi.createFavorite({ scan_id: scan.id, category: 'style_report', title: `${scan.face_shape ?? 'Style'} report`, notes: date(scan.created_at), payload_json: { face_shape: scan.face_shape, confidence: scan.confidence } }), onSuccess: async () => { showToast('Saved'); await favorites.refetch(); }, onError: (error: ApiError) => showToast(error.message) });
  const toggle = (id: string) => setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : items.length < 3 ? [...items, id] : items);
  const scans = history.data ?? [];
  return <ProtectedRoute><ScreenWrapper><FlatList data={scans} keyExtractor={(item) => item.id} contentContainerStyle={styles.content} refreshControl={<RefreshControl tintColor={theme.primary} refreshing={history.isRefetching} onRefresh={() => { void history.refetch(); void favorites.refetch(); }} />}
    ListHeaderComponent={<View style={styles.header}><GradientHeader eyebrow="Your library" title="History" description="Scans and favorites." icon="time-outline" /><AnimatedCard><View style={styles.rowBetween}><View><AppText variant="h3">Favorites</AppText><AppText muted>{favorites.data?.length ?? 0} saved</AppText></View><AppButton size="sm" title="Style" variant="secondary" onPress={() => router.push('/style-edit')} /></View>{favorites.isLoading ? <LoadingSkeleton height={48} /> : (favorites.data ?? []).slice(0, 2).map((item) => <ListRow key={item.id} title={item.title} value={date(item.created_at)} />)}</AnimatedCard><AppText variant="h3">Scans</AppText>{history.isLoading ? <LoadingSkeleton height={120} /> : null}</View>}
    ListEmptyComponent={!history.isLoading ? <EmptyState title="No scans" message="Start a face scan." /> : null}
    renderItem={({ item, index }) => <AnimatedCard delay={index * 45}><View style={styles.rowBetween}><View><AppText weight="black">{item.face_shape ?? item.status}</AppText><AppText variant="small" muted>{date(item.created_at)}</AppText></View><AppBadge tone={selected.includes(item.id) ? 'primary' : 'neutral'} label={selected.includes(item.id) ? 'Selected' : `${item.confidence ?? 0}%`} /></View><View style={styles.actions}><AppButton size="sm" title="Open" variant="secondary" onPress={() => router.push(`/reports/${item.id}`)} /><AppButton size="sm" title="Save" variant="ghost" onPress={() => favorite.mutate(item)} /><AppButton size="sm" title="Compare" variant={selected.includes(item.id) ? 'primary' : 'ghost'} onPress={() => toggle(item.id)} /></View></AnimatedCard>}
    ItemSeparatorComponent={() => <View style={styles.separator} />} ListFooterComponent={selected.length >= 2 ? <View style={styles.footer}><AppButton loading={compare.isPending} title="Compare scans" onPress={() => compare.mutate()} /></View> : null} />
  </ScreenWrapper></ProtectedRoute>;
}
const styles = StyleSheet.create({ content: { padding: spacing.md, paddingBottom: 120 }, header: { gap: spacing.md, marginBottom: spacing.md }, separator: { height: spacing.md }, footer: { paddingTop: spacing.md }, rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md } });
