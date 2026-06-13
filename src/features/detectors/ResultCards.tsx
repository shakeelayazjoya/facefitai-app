import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListRow } from '@/components/ui/ListRow';
import { labelize } from '@/utils/formData';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { AgeAnalysisResponse, FeatureAnalysisResponse, StyleReport, SymmetryAnalysisResponse } from '@/types/api';
export type DetectorResult = StyleReport | FeatureAnalysisResponse | AgeAnalysisResponse | SymmetryAnalysisResponse;
type Result = DetectorResult;
function isStyle(value: Result): value is StyleReport { return 'face_shape' in value; }
function isAge(value: Result): value is AgeAnalysisResponse { return 'apparent_age' in value; }
function isSymmetry(value: Result): value is SymmetryAnalysisResponse { return 'symmetry_score' in value; }
function rows(result: Result): Array<{ key: string; value: string }> {
  if (isStyle(result)) return [{ key: 'Primary shape', value: `${labelize(result.face_shape.primary_shape)} · ${result.face_shape.confidence}%` }, { key: 'Secondary shape', value: labelize(result.face_shape.secondary_shape) }, { key: 'Mixed summary', value: result.face_shape.mixed_shape_summary }, { key: 'Beard style', value: result.beard.best_style }, { key: 'Frame width', value: result.glasses.frame_width }, ...Object.entries(result.features.ratings).map(([key, item]) => ({ key: labelize(key), value: `${item.score}% · ${item.recommendation ?? item.notes[0] ?? ''}` }))];
  if (isAge(result)) return [{ key: 'Apparent age', value: `${result.apparent_age}` }, { key: 'Age range', value: result.age_range }, { key: 'Confidence', value: `${result.confidence}%` }, ...result.range_scores.map((item) => ({ key: item.range, value: `${item.score}%` })), ...result.signals.map((item) => ({ key: item.label, value: String(item.value) }))];
  if (isSymmetry(result)) return [{ key: 'Symmetry score', value: `${result.symmetry_score}%` }, { key: 'Level', value: result.symmetry_level }, { key: 'Confidence', value: `${result.confidence}%` }, ...result.regions.map((item) => ({ key: item.region, value: `${item.score}%` }))];
  return [{ key: 'Primary type', value: `${result.primary_type} · ${result.confidence}%` }, ...result.type_scores.map((item) => ({ key: item.type, value: `${item.score}%` })), ...result.traits.map((item) => ({ key: item.label, value: item.value }))];
}
function quality(result: Result) { return result.quality; }
export function ResultCards({ result, emptyTitle }: { result: Result | null; emptyTitle: string }) {
  const theme = useAppTheme(); if (!result) return <EmptyState title={emptyTitle} message="The model returns confidence, geometry, quality checks, and personalized guidance." />;
  const q = quality(result); const data = rows(result); const recommendations = isStyle(result) ? [...result.grooming_tips, ...(result.ai_style?.styling_advice ?? []), ...result.glasses.recommended_frames, ...result.glasses.avoid.map((x) => `Avoid: ${x}`)] : result.recommendations;
  return <View style={styles.wrap}><Card><View style={styles.header}><Text style={[styles.heading, { color: theme.text }]}>Analysis result</Text><Badge tone={q.quality_score > 70 ? 'primary' : 'warning'} label={`Quality ${q.quality_score}%`} /></View><FlatList scrollEnabled={false} data={data} keyExtractor={(item, index) => `${item.key}-${index}`} renderItem={({ item }) => <ListRow title={item.key} subtitle={item.value} />} /></Card><Card><Text style={[styles.heading, { color: theme.text }]}>Quality checks</Text><ListRow title="Single face" value={q.single_face ? 'Yes' : 'No'} /><ListRow title="Front facing" value={q.front_facing ? 'Yes' : 'No'} /><ListRow title="Lighting" value={labelize(q.lighting)} />{q.warnings.map((item) => <Text key={item} style={[styles.warn, { color: theme.warning }]}>• {item}</Text>)}</Card><Card><Text style={[styles.heading, { color: theme.text }]}>Guidance</Text>{recommendations.slice(0, 12).map((item) => <Text key={item} style={[styles.bullet, { color: theme.mutedText }]}>• {item}</Text>)}</Card></View>;
}
const styles = StyleSheet.create({ wrap: { gap: 14 }, header: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 8 }, heading: { fontSize: 18, fontWeight: '900' }, bullet: { lineHeight: 22, marginTop: 6 }, warn: { lineHeight: 21, marginTop: 5, fontWeight: '700' } });
