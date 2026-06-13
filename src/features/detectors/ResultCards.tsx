import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AppText } from '@/components/ui/AppText';
import { AppBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ResultScoreRing } from '@/components/ui/ResultScoreRing';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { labelize } from '@/utils/formData';
import type { AgeAnalysisResponse, DetectorKind, FeatureAnalysisResponse, StyleReport, SymmetryAnalysisResponse } from '@/types/api';

export type DetectorResult = StyleReport | FeatureAnalysisResponse | AgeAnalysisResponse | SymmetryAnalysisResponse;
interface Detail { title: string; value: string; icon: keyof typeof Ionicons.glyphMap }
const labels: Record<DetectorKind, string> = { face: 'Face Shape', eye: 'Eye Shape', nose: 'Nose Shape', lips: 'Lip Shape', age: 'Apparent Age', symmetry: 'Face Symmetry' };
const icons: Record<DetectorKind, keyof typeof Ionicons.glyphMap> = { face: 'scan-outline', eye: 'eye-outline', nose: 'body-outline', lips: 'happy-outline', age: 'time-outline', symmetry: 'analytics-outline' };
const isStyle = (value: DetectorResult): value is StyleReport => 'face_shape' in value;
const isAge = (value: DetectorResult): value is AgeAnalysisResponse => 'apparent_age' in value;
const isSymmetry = (value: DetectorResult): value is SymmetryAnalysisResponse => 'symmetry_score' in value;
function resultValue(result: DetectorResult) { if (isStyle(result)) return labelize(result.face_shape.primary_shape); if (isAge(result)) return `${result.apparent_age} years`; if (isSymmetry(result)) return result.symmetry_level; return labelize(result.primary_type); }
function resultScore(result: DetectorResult) { if (isStyle(result)) return result.face_shape.confidence; if (isAge(result)) return result.confidence; if (isSymmetry(result)) return result.symmetry_score; return result.confidence; }
function details(result: DetectorResult): Detail[] {
  if (isStyle(result)) return [{ title: 'Secondary Shape', value: labelize(result.face_shape.secondary_shape), icon: 'shapes-outline' }, { title: 'Eye Shape', value: labelize(result.features.eyes_type), icon: 'eye-outline' }, { title: 'Nose Shape', value: labelize(result.features.nose_type), icon: 'body-outline' }, { title: 'Lip Shape', value: labelize(result.features.lips_type), icon: 'happy-outline' }, { title: 'Jawline', value: labelize(result.features.jawline_type), icon: 'resize-outline' }, { title: 'Best Beard Style', value: result.beard.best_style, icon: 'cut-outline' }, { title: 'Glasses Fit', value: result.glasses.frame_width, icon: 'glasses-outline' }];
  if (isAge(result)) return [{ title: 'Estimated Range', value: result.age_range, icon: 'calendar-outline' }, ...result.signals.slice(0, 4).map((item) => ({ title: item.label, value: String(item.value), icon: 'pulse-outline' as const }))];
  if (isSymmetry(result)) return result.regions.map((item) => ({ title: labelize(item.region), value: `${item.score}% symmetry`, icon: 'analytics-outline' as const }));
  return [{ title: 'Confidence', value: `${result.confidence}% match`, icon: 'checkmark-circle-outline' }, ...result.traits.map((item) => ({ title: item.label, value: item.value, icon: 'sparkles-outline' as const }))];
}
function DetailCard({ item, delay }: { item: Detail; delay: number }) {
  const theme = useAppTheme(); return <AnimatedCard delay={delay}><View style={styles.detail}><View style={[styles.detailIcon, { backgroundColor: theme.primarySoft }]}><Ionicons name={item.icon} color={theme.primary} size={20} /></View><View style={styles.detailCopy}><AppText weight="black">{item.title}</AppText><AppText muted>{item.value}</AppText></View></View></AnimatedCard>;
}
export function ResultCards({ result, emptyTitle, kind }: { result: DetectorResult | null; emptyTitle: string; kind: DetectorKind }) {
  const theme = useAppTheme();
  if (!result) return <EmptyState icon="sparkles-outline" title={emptyTitle} message="Choose a clear portrait to reveal your detected features and personalized guidance." />;
  const allDetails = details(result); const quality = result.quality;
  const recommendations = isStyle(result) ? [...result.grooming_tips, ...(result.ai_style?.styling_advice ?? []), ...result.glasses.recommended_frames] : result.recommendations;
  return <View style={styles.wrap}>
    <AnimatedCard><View style={styles.summary}><ResultScoreRing score={resultScore(result)} label="Match" size={102} /><View style={styles.summaryCopy}><AppText variant="caption" color={theme.primary} style={styles.eyebrow}>ANALYSIS COMPLETE</AppText><AppText variant="h3">{labels[kind]}</AppText><AppText variant="h2" color={theme.primary}>{resultValue(result)}</AppText><AppBadge tone={quality.quality_score > 70 ? 'primary' : 'warning'} label={`Photo quality ${quality.quality_score}%`} /></View></View></AnimatedCard>
    <View style={styles.grid}>{allDetails.map((item, index) => <View key={`${item.title}-${index}`} style={styles.gridItem}><DetailCard item={item} delay={70 + index * 45} /></View>)}</View>
    <AnimatedCard delay={200}><View style={styles.sectionTitle}><Ionicons name="shield-checkmark-outline" color={theme.success} size={21} /><AppText variant="h3">Scan quality</AppText></View><View style={styles.badges}><AppBadge label={quality.single_face ? 'Single face' : 'Multiple faces'} tone={quality.single_face ? 'primary' : 'warning'} /><AppBadge label={quality.front_facing ? 'Front facing' : 'Turn forward'} tone={quality.front_facing ? 'primary' : 'warning'} /><AppBadge label={labelize(quality.lighting)} /></View></AnimatedCard>
    <AnimatedCard delay={250}><View style={styles.sectionTitle}><Ionicons name="bulb-outline" color={theme.warning} size={21} /><AppText variant="h3">Personal recommendations</AppText></View>{recommendations.slice(0, 8).map((item) => <View key={item} style={styles.tip}><Ionicons name="checkmark-circle" color={theme.primary} size={17} /><AppText muted style={styles.tipText}>{item}</AppText></View>)}</AnimatedCard>
  </View>;
}
const styles = StyleSheet.create({ wrap: { gap: spacing.md }, summary: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg }, summaryCopy: { flex: 1, alignItems: 'flex-start', gap: spacing.xs }, eyebrow: { letterSpacing: 1.2 }, grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs }, gridItem: { width: '50%', padding: spacing.xs }, detail: { minHeight: 82, flexDirection: 'row', alignItems: 'center', gap: spacing.md }, detailIcon: { width: 40, height: 40, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' }, detailCopy: { flex: 1, gap: spacing.xxs }, sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }, badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, tip: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }, tipText: { flex: 1 } });
