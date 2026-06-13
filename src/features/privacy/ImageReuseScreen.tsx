import { useMutation } from '@tanstack/react-query';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { ImagePickerPanel } from '@/features/detectors/ImagePickerPanel';
import { facefitApi } from '@/services/facefitApi';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useToast } from '@/hooks/useToast';
import type { ApiError } from '@/services/apiClient';
import type { ImageAsset } from '@/utils/formData';
export function ImageReuseScreen() { const theme = useAppTheme(); const { showToast } = useToast(); const mutation = useMutation({ mutationFn: (asset: ImageAsset) => facefitApi.scanImageReuse(asset), onError: (e: ApiError) => showToast(e.message) }); return <ProtectedRoute><ScreenWrapper><ScrollView contentContainerStyle={styles.content}><Text style={[styles.title, { color: theme.text }]}>Privacy image reuse</Text><Text style={[styles.desc, { color: theme.mutedText }]}>Check whether an uploaded image matches your previous internal scans or configured external visual search provider.</Text><ImagePickerPanel title="Check image reuse" disabled={mutation.isPending} onPick={(asset) => mutation.mutate(asset)} />{mutation.isPending ? <LoadingSpinner /> : null}{mutation.data ? <Card><Text style={[styles.cardTitle, { color: theme.text }]}>Status: {mutation.data.external_status}</Text>{mutation.data.notes.map((note) => <Text key={note} style={{ color: theme.mutedText }}>• {note}</Text>)}<Text style={[styles.cardTitle, { color: theme.text }]}>Internal matches: {mutation.data.internal_matches.length}</Text><Text style={[styles.cardTitle, { color: theme.text }]}>External matches: {mutation.data.external_matches.length}</Text></Card> : <EmptyState title="No check yet" message="Upload an image to run a reuse scan." />}</ScrollView></ScreenWrapper></ProtectedRoute>; }
const styles = StyleSheet.create({ content: { padding: 18, gap: 16, paddingBottom: 40 }, title: { fontSize: 28, fontWeight: '900' }, desc: { lineHeight: 22 }, cardTitle: { fontWeight: '900', marginTop: 8 } });
