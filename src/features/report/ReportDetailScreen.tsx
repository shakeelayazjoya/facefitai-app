import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { facefitApi } from '@/services/facefitApi';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ResultCards } from '@/features/detectors/ResultCards';
export function ReportDetailScreen() { const { id } = useLocalSearchParams<{ id: string }>(); const theme = useAppTheme(); const query = useQuery({ queryKey: ['scan', id], queryFn: () => facefitApi.getScan(id), enabled: Boolean(id) }); return <ProtectedRoute><ScreenWrapper>{query.isLoading ? <LoadingSpinner /> : <ScrollView contentContainerStyle={styles.content}><Text style={[styles.title, { color: theme.text }]}>Scan report</Text><Card><Text style={{ color: theme.mutedText }}>Status: {query.data?.status}</Text><Text style={{ color: theme.mutedText }}>Created: {query.data?.created_at ? new Date(query.data.created_at).toLocaleString() : '-'}</Text></Card><ResultCards result={query.data?.report ?? null} emptyTitle="Report not ready" /></ScrollView>}</ScreenWrapper></ProtectedRoute>; }
const styles = StyleSheet.create({ content: { padding: 18, gap: 16, paddingBottom: 40 }, title: { fontSize: 28, fontWeight: '900' } });
