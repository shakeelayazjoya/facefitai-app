import { useMutation, useQuery } from '@tanstack/react-query';
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
import { spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useToast } from '@/hooks/useToast';
import { facefitApi } from '@/services/facefitApi';
import type { ApiError } from '@/services/apiClient';

export function AdminScreen() {
  const theme = useAppTheme(); const { showToast } = useToast(); const analytics = useQuery({ queryKey: ['admin-analytics'], queryFn: facefitApi.adminAnalytics }); const users = useQuery({ queryKey: ['admin-users'], queryFn: facefitApi.adminUsers }); const products = useQuery({ queryKey: ['admin-products'], queryFn: facefitApi.adminProducts });
  const feature = useMutation({ mutationFn: facefitApi.adminFeatureProduct, onSuccess: async () => { showToast('Updated'); await products.refetch(); }, onError: (error: ApiError) => showToast(error.message) });
  const refresh = () => { void analytics.refetch(); void users.refetch(); void products.refetch(); };
  return <ProtectedRoute adminOnly><ScreenWrapper><FlatList data={products.data ?? []} keyExtractor={(item) => item.id} contentContainerStyle={styles.content} refreshControl={<RefreshControl tintColor={theme.primary} refreshing={analytics.isRefetching || users.isRefetching || products.isRefetching} onRefresh={refresh} />}
    ListHeaderComponent={<View style={styles.header}><GradientHeader eyebrow="Workspace" title="Admin" description="Users and products." icon="settings-outline" /><AnimatedCard><AppText variant="h3">Overview</AppText><View style={styles.grid}><AppBadge tone="primary" label={`${analytics.data?.users_count ?? 0} users`} /><AppBadge tone="primary" label={`${analytics.data?.scans_count ?? 0} scans`} /><AppBadge label={`${analytics.data?.products_count ?? 0} products`} /></View></AnimatedCard><AnimatedCard delay={55}><AppText variant="h3">Recent users</AppText>{(users.data ?? []).slice(0, 4).map((item) => <ListRow key={item.id} title={item.name} subtitle={item.email} value={`${item.scans_count}`} />)}</AnimatedCard><AppText variant="h3">Products</AppText></View>}
    ListEmptyComponent={<EmptyState title="No data" message="Pull to refresh." />} renderItem={({ item, index }) => <AnimatedCard delay={index * 40}><ListRow title={item.name} subtitle={item.category} value={item.is_featured ? 'Featured' : undefined} /><AppButton size="sm" title="Toggle" variant="secondary" onPress={() => feature.mutate(item.id)} /></AnimatedCard>} ItemSeparatorComponent={() => <View style={styles.separator} />} />
  </ScreenWrapper></ProtectedRoute>;
}
const styles = StyleSheet.create({ content: { padding: spacing.md, paddingBottom: 40 }, header: { gap: spacing.md, marginBottom: spacing.md }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }, separator: { height: spacing.md } });
