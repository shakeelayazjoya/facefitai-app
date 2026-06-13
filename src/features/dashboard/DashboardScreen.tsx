import { useMutation, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListRow } from '@/components/ui/ListRow';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { SkeletonBlock } from '@/components/ui/SkeletonBlock';
import { queryKeys } from '@/constants/queryKeys';
import { strings } from '@/constants/strings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useToast } from '@/hooks/useToast';
import { analytics } from '@/services/analytics';
import { facefitApi } from '@/services/facefitApi';
import { useAuthStore } from '@/store/authStore';
import type { ApiError } from '@/services/apiClient';
import type { ScanSummary } from '@/types/api';
function date(value: string) { return new Date(value).toLocaleDateString(); }
export function DashboardScreen() {
  const theme = useAppTheme(); const { showToast } = useToast(); const user = useAuthStore((s) => s.user); const [selected, setSelected] = useState<string[]>([]);
  const history = useQuery({ queryKey: queryKeys.scanHistory, queryFn: facefitApi.getScanHistory, enabled: Boolean(user) });
  const favorites = useQuery({ queryKey: queryKeys.favorites, queryFn: facefitApi.getFavorites, enabled: Boolean(user) });
  const sub = useQuery({ queryKey: queryKeys.subscription, queryFn: facefitApi.getSubscription, enabled: Boolean(user) });
  const compare = useMutation({ mutationFn: () => facefitApi.compareScans(selected), onError: (e: ApiError) => showToast(e.message) });
  const fav = useMutation({ mutationFn: (scan: ScanSummary) => facefitApi.createFavorite({ scan_id: scan.id, category: 'style_report', title: `${scan.face_shape ?? 'Style'} report`, notes: `Saved from ${date(scan.created_at)}`, payload_json: { face_shape: scan.face_shape, confidence: scan.confidence } }), onSuccess: async () => { analytics.track('favorite_created'); showToast(strings.scanSaved); await favorites.refetch(); }, onError: (e: ApiError) => showToast(e.message) });
  function toggle(id: string) { setSelected((rows) => rows.includes(id) ? rows.filter((x) => x !== id) : rows.length < 3 ? [...rows, id] : rows); }
  function refresh() { void history.refetch(); void favorites.refetch(); void sub.refetch(); }
  const scans = history.data ?? [];
  return (
    <ProtectedRoute>
      <ScreenWrapper>
        <FlatList
          data={scans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={history.isRefetching} onRefresh={refresh} />}
          ListHeaderComponent={<View style={styles.header}><Text style={[styles.title, { color: theme.text }]}>Account workspace</Text><Card><Text style={[styles.meta, { color: theme.mutedText }]}>Signed in</Text><Text style={[styles.bold, { color: theme.text }]}>{user?.email}</Text><Text style={[styles.meta, { color: theme.mutedText }]}>Plan</Text><View style={styles.row}><Badge tone="primary" label={sub.data?.plan ?? user?.plan ?? 'free'} /><Badge label={sub.data?.status ?? 'active'} /></View></Card><View style={styles.actions}><Button title="Privacy check" variant="secondary" onPress={() => router.push('/privacy-reuse')} /><Button title="Style studio" variant="secondary" onPress={() => router.push('/style-edit')} /></View><Card><Text style={[styles.section, { color: theme.text }]}>Favorites</Text>{favorites.isLoading ? <SkeletonBlock height={60} /> : (favorites.data ?? []).slice(0, 3).map((item) => <ListRow key={item.id} title={item.title} subtitle={item.notes ?? item.category} value={date(item.created_at)} />)}{favorites.data?.length === 0 ? <Text style={{ color: theme.mutedText }}>{strings.noFavorites}</Text> : null}</Card><Text style={[styles.section, { color: theme.text }]}>Previous scans</Text>{history.isLoading ? <LoadingSpinner /> : null}</View>}
          ListEmptyComponent={!history.isLoading ? <EmptyState title="No scan history" message={strings.noHistory} /> : null}
          renderItem={({ item }) => <Card style={styles.scan}><View style={styles.rowBetween}><Text style={[styles.bold, { color: theme.text }]}>{item.face_shape ?? item.status}</Text><Badge tone={selected.includes(item.id) ? 'primary' : 'neutral'} label={selected.includes(item.id) ? 'selected' : `${item.confidence ?? 0}%`} /></View><Text style={{ color: theme.mutedText }}>{date(item.created_at)}</Text>{item.error_message ? <Text style={{ color: theme.danger }}>{item.error_message}</Text> : null}<View style={styles.actions}><Button size="sm" title="Open" variant="secondary" onPress={() => { analytics.track('report_opened', { scan_id: item.id }); router.push(`/reports/${item.id}`); }} /><Button size="sm" title="Favorite" variant="secondary" onPress={() => fav.mutate(item)} /><Button size="sm" title="Compare" variant={selected.includes(item.id) ? 'primary' : 'ghost'} onPress={() => toggle(item.id)} /></View></Card>}
          ListFooterComponent={selected.length >= 2 ? <Card><Button disabled={compare.isPending} title="Compare selected scans" onPress={() => compare.mutate()} />{compare.data ? <Text style={[styles.compare, { color: theme.mutedText }]}>Confidence delta: {compare.data.confidence_delta ?? 'n/a'} · Beard delta: {compare.data.beard_score_delta ?? 'n/a'}</Text> : null}</Card> : null}
        />
      </ScreenWrapper>
    </ProtectedRoute>
  );
}
const styles = StyleSheet.create({ content: { padding: 18, gap: 12, paddingBottom: 40 }, header: { gap: 14 }, title: { fontSize: 28, fontWeight: '900' }, section: { fontSize: 20, fontWeight: '900', marginTop: 8 }, meta: { fontSize: 12, textTransform: 'uppercase', marginTop: 8 }, bold: { fontWeight: '900', marginTop: 3 }, scan: { gap: 8, marginBottom: 12 }, row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 8 }, rowBetween: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, compare: { marginTop: 10, fontWeight: '700' } });
