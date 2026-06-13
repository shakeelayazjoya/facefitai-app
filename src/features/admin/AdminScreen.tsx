import { useMutation, useQuery } from '@tanstack/react-query';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListRow } from '@/components/ui/ListRow';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { strings } from '@/constants/strings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useToast } from '@/hooks/useToast';
import { facefitApi } from '@/services/facefitApi';
import type { ApiError } from '@/services/apiClient';
export function AdminScreen() { const theme = useAppTheme(); const { showToast } = useToast(); const analytics = useQuery({ queryKey: ['admin-analytics'], queryFn: facefitApi.adminAnalytics }); const users = useQuery({ queryKey: ['admin-users'], queryFn: facefitApi.adminUsers }); const products = useQuery({ queryKey: ['admin-products'], queryFn: facefitApi.adminProducts }); const feature = useMutation({ mutationFn: facefitApi.adminFeatureProduct, onSuccess: async () => { showToast('Product updated.'); await products.refetch(); }, onError: (e: ApiError) => showToast(e.message) }); function refresh() { void analytics.refetch(); void users.refetch(); void products.refetch(); }
  return <ProtectedRoute adminOnly><ScreenWrapper><FlatList data={products.data ?? []} keyExtractor={(item) => item.id} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={analytics.isRefetching || users.isRefetching || products.isRefetching} onRefresh={refresh} />} ListHeaderComponent={<View style={styles.header}><Text style={[styles.title, { color: theme.text }]}>Admin tools</Text><Card><Text style={[styles.section, { color: theme.text }]}>Analytics</Text><View style={styles.grid}><Badge tone="primary" label={`${analytics.data?.users_count ?? 0} users`} /><Badge tone="primary" label={`${analytics.data?.scans_count ?? 0} scans`} /><Badge label={`${analytics.data?.products_count ?? 0} products`} /><Badge label={`${analytics.data?.featured_products_count ?? 0} featured`} /></View></Card><Card><Text style={[styles.section, { color: theme.text }]}>Recent users</Text>{(users.data ?? []).slice(0, 5).map((item) => <ListRow key={item.id} title={item.name} subtitle={item.email} value={`${item.scans_count}`} />)}</Card><Text style={[styles.section, { color: theme.text }]}>Products</Text></View>} ListEmptyComponent={<EmptyState title="No admin data" message={strings.noAdminData} />} renderItem={({ item }) => <Card style={styles.product}><ListRow title={item.name} subtitle={item.category} value={item.is_featured ? 'Featured' : undefined} /><Button size="sm" title="Toggle featured" variant="secondary" onPress={() => feature.mutate(item.id)} /></Card>} /></ScreenWrapper></ProtectedRoute>;
}
const styles = StyleSheet.create({ content: { padding: 18, gap: 12, paddingBottom: 40 }, header: { gap: 14 }, title: { fontSize: 28, fontWeight: '900' }, section: { fontSize: 18, fontWeight: '900', marginBottom: 8 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, product: { gap: 8, marginBottom: 12 } });
