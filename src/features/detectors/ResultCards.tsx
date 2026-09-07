import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AppText } from '@/components/ui/AppText';
import { AppBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ResultScoreRing } from '@/components/ui/ResultScoreRing';
import { AppButton } from '@/components/ui/Button';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { labelize } from '@/utils/formData';
import type { AgeAnalysisResponse, DetectorKind, ExpressionAnalysisResponse, FeatureAnalysisResponse, StyleReport, SymmetryAnalysisResponse } from '@/types/api';
import type { ImageAsset } from '@/utils/formData';
import { ResultScoreSection, type ScoreMetric } from './ResultScoreSection';
import { ExportReportActions } from '@/features/report/ExportReportActions';

export type DetectorResult = StyleReport | FeatureAnalysisResponse | AgeAnalysisResponse | SymmetryAnalysisResponse | ExpressionAnalysisResponse;
interface Detail { title: string; value: string; icon: keyof typeof Ionicons.glyphMap }
const EMOTION_EMOJI: Record<string, string> = {
  Happy: '😊', Sad: '😢', Angry: '😠', Surprised: '😲',
  Fear: '😨', Disgust: '🤢', Neutral: '😐', Contempt: '😒',
};
const labels: Record<DetectorKind, string> = { face: 'Face Shape', eye: 'Eye Shape', nose: 'Nose Shape', lips: 'Lip Shape', age: 'Apparent Age', symmetry: 'Face Symmetry', emotion: 'Emotion & Smile' };
const icons: Record<DetectorKind, keyof typeof Ionicons.glyphMap> = { face: 'scan-outline', eye: 'eye-outline', nose: 'body-outline', lips: 'happy-outline', age: 'time-outline', symmetry: 'analytics-outline', emotion: 'sparkles-outline' };
const isStyle = (value: DetectorResult): value is StyleReport => 'face_shape' in value;
const isAge = (value: DetectorResult): value is AgeAnalysisResponse => 'apparent_age' in value;
const isSymmetry = (value: DetectorResult): value is SymmetryAnalysisResponse => 'symmetry_score' in value;
const isExpression = (value: DetectorResult): value is ExpressionAnalysisResponse => 'smile' in value;
function resultValue(result: DetectorResult) {
  if (isStyle(result)) return labelize(result.face_shape.primary_shape);
  if (isAge(result)) return `${result.apparent_age} years`;
  if (isSymmetry(result)) return result.symmetry_level;
  if (isExpression(result)) {
    const emoji = result.emotion?.label ? (EMOTION_EMOJI[result.emotion.label] ?? '🙂') : '🙂';
    return result.emotion ? `${emoji} ${result.emotion.label}` : result.smile.label;
  }
  return labelize(result.primary_type);
}
function resultScore(result: DetectorResult) {
  if (isStyle(result)) return result.face_shape.confidence;
  if (isAge(result)) return result.confidence;
  if (isSymmetry(result)) return result.symmetry_score;
  if (isExpression(result)) return result.emotion ? result.emotion.confidence : result.smile.score;
  return result.confidence;
}
function details(result: DetectorResult): Detail[] {
  if (isStyle(result)) return [{ title: 'Secondary Shape', value: labelize(result.face_shape.secondary_shape), icon: 'shapes-outline' }, { title: 'Eye Shape', value: labelize(result.features.eyes_type), icon: 'eye-outline' }, { title: 'Nose Shape', value: labelize(result.features.nose_type), icon: 'body-outline' }, { title: 'Lip Shape', value: labelize(result.features.lips_type), icon: 'happy-outline' }, { title: 'Jawline', value: labelize(result.features.jawline_type), icon: 'resize-outline' }, { title: 'Best Beard Style', value: result.beard.best_style, icon: 'cut-outline' }, { title: 'Glasses Fit', value: result.glasses.frame_width, icon: 'glasses-outline' }];
  if (isAge(result)) return [{ title: 'Estimated Range', value: result.age_range, icon: 'calendar-outline' }, ...result.signals.slice(0, 4).map((item) => ({ title: item.label, value: String(item.value), icon: 'pulse-outline' as const }))];
  if (isSymmetry(result)) return result.regions.map((item) => ({ title: labelize(item.region), value: `${item.score}% symmetry`, icon: 'analytics-outline' as const }));
  if (isExpression(result)) {
    const items: Detail[] = [
      { title: 'Smile Meter', value: `${result.smile.label} (${Math.round(result.smile.score)}%)`, icon: 'happy-outline' },
    ];
    if (result.emotion) {
      items.push({ title: 'Dominant Emotion', value: `${EMOTION_EMOJI[result.emotion.label] ?? ''} ${result.emotion.label}`, icon: 'sparkles-outline' });
    }
    if (result.age) {
      items.push({ title: 'Apparent Age', value: `~${Math.round(result.age.value)} yrs (${Math.round(result.age.low)}–${Math.round(result.age.high)})`, icon: 'time-outline' });
    }
    if (result.gender) {
      items.push({ title: 'Gender', value: result.gender.label, icon: 'person-outline' });
    }
    return items;
  }
  return [{ title: 'Confidence', value: `${result.confidence}% match`, icon: 'checkmark-circle-outline' }, ...result.traits.map((item) => ({ title: item.label, value: item.value, icon: 'sparkles-outline' as const }))];
}
const ranked = (values: Record<string, number>): ScoreMetric[] => Object.entries(values).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label: labelize(label), value }));
function matchScores(result: DetectorResult): ScoreMetric[] {
  if (isStyle(result)) return ranked(result.face_shape.shape_scores);
  if (isAge(result)) return result.range_scores.map((item) => ({ label: item.range, value: item.score }));
  if (isSymmetry(result)) return result.regions.map((item) => ({ label: labelize(item.region), value: item.score }));
  if (isExpression(result)) {
    if (!result.emotion?.scores) return [{ label: result.smile.label, value: result.smile.score }];
    return result.emotion.scores.map((s) => ({ label: `${EMOTION_EMOJI[s.label] ?? ''} ${s.label}`, value: s.score }));
  }
  return result.type_scores.map((item) => ({ label: labelize(item.type), value: item.score }));
}
function featureScores(result: DetectorResult): ScoreMetric[] {
  if (isStyle(result)) return [...Object.entries(result.features.ratings).map(([label, item]) => ({ label: labelize(label), value: item.score })), { label: 'Eye symmetry', value: result.features.eyes_symmetry }, { label: 'Beard fit', value: result.beard.beard_score }, { label: 'Clean shave fit', value: result.beard.clean_shave_score }];
  if (isAge(result)) return result.signals.map((item) => ({ label: item.label, value: item.confidence }));
  if (isSymmetry(result)) return result.regions.map((item) => ({ label: `${labelize(item.region)} confidence`, value: item.confidence }));
  if (isExpression(result)) {
    return [
      { label: 'Smile intensity', value: result.smile.score },
      { label: 'Left lip corner', value: result.smile.left },
      { label: 'Right lip corner', value: result.smile.right },
    ];
  }
  return result.traits.map((item) => ({ label: item.label, value: item.confidence }));
}
function qualityScores(result: DetectorResult): ScoreMetric[] {
  const quality = result.quality ?? { quality_score: 90, head_pose_score: 90, blur_score: 90 };
  return [{ label: 'Photo quality', value: quality.quality_score }, { label: 'Head pose', value: quality.head_pose_score }, { label: 'Blur score', value: quality.blur_score }];
}
function DetailCard({ item, delay }: { item: Detail; delay: number }) {
  const theme = useAppTheme();
  return (
    <AnimatedCard delay={delay}>
      <View style={styles.detail}>
        <View style={[styles.detailIcon, { backgroundColor: theme.primarySoft }]}>
          <Ionicons name={item.icon} color={theme.primary} size={20} />
        </View>
        <View style={styles.detailCopy}>
          <AppText
            variant="caption"
            weight="bold"
            color={theme.mutedText}
            style={styles.detailLabel}
          >
            {item.title}
          </AppText>
          <AppText
            variant="body"
            weight="black"
            color={theme.textStrong}
            numberOfLines={2}
            style={styles.detailValue}
          >
            {item.value}
          </AppText>
        </View>
      </View>
    </AnimatedCard>
  );
}

export function ResultCards({
  result,
  emptyTitle,
  kind,
  onReset,
  scanId,
  asset,
}: {
  result: DetectorResult | null;
  emptyTitle: string;
  kind: DetectorKind;
  onReset?: () => void;
  scanId?: string;
  asset?: ImageAsset | null;
}) {
  const theme = useAppTheme();
  if (!result) return <EmptyState icon="sparkles-outline" title={emptyTitle} message="Upload to see results." />;

  const allDetails = details(result);
  const quality = result.quality ?? {
    quality_score: 90,
    head_pose_score: 90,
    blur_score: 90,
    single_face: true,
    front_facing: true,
    lighting: 'good' as const,
    warnings: [],
  };
  const recommendations = isStyle(result)
    ? [...result.grooming_tips, ...(result.ai_style?.styling_advice ?? []), ...result.glasses.recommended_frames]
    : result.recommendations;
  const smileEmoji = isExpression(result)
    ? (result.smile.score >= 30 ? '😄' : result.smile.score >= 12 ? '🙂' : '😐')
    : null;

  return (
    <View style={styles.wrap}>
      {/* Top Executive Summary Card */}
      <AnimatedCard>
        <View style={styles.summary}>
          <ResultScoreRing score={resultScore(result)} label="Match" size={106} />
          <View style={styles.summaryCopy}>
            <View style={styles.eyebrowRow}>
              <Ionicons name="sparkles" size={12} color={theme.primary} />
              <AppText variant="caption" weight="black" color={theme.primary} style={styles.eyebrow}>
                AI BIOMETRIC VERIFIED
              </AppText>
            </View>
            <AppText variant="caption" weight="bold" color={theme.mutedText} style={styles.categoryLabel}>
              {labels[kind]}
            </AppText>
            <AppText variant="h2" weight="black" color={theme.primary} style={styles.resultTitle}>
              {resultValue(result)}
            </AppText>
            <View style={styles.badges}>
              <AppBadge
                tone={quality.quality_score > 70 ? 'success' : 'warning'}
                label={`Quality ${quality.quality_score}%`}
              />
              <AppBadge tone="neutral" label={`${result.processing_ms} ms`} />
            </View>
          </View>
        </View>
      </AnimatedCard>

      {isExpression(result) ? (
        <AnimatedCard delay={35}>
          <View style={styles.sectionTitle}>
            <View style={[styles.sectionIconWrap, { backgroundColor: theme.primarySoft }]}>
              <Ionicons name="happy-outline" color={theme.primary} size={18} />
            </View>
            <AppText variant="h3" weight="bold">Smile detection</AppText>
          </View>
          <View style={styles.smileCardRow}>
            <View style={[styles.smileEmojiBox, { backgroundColor: theme.primarySoft }]}>
              <AppText style={{ fontSize: 32, lineHeight: 42, textAlign: 'center' }}>{smileEmoji}</AppText>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <AppText variant="h3" weight="bold" color={theme.textStrong}>{result.smile.label}</AppText>
              <AppText color={theme.mutedText} weight="medium">
                Smile intensity score: {Math.round(result.smile.score)}%
              </AppText>
            </View>
          </View>
        </AnimatedCard>
      ) : null}

      {onReset ? (
        <AppButton
          title="Analyze another photo"
          icon="scan-outline"
          variant="secondary"
          size="lg"
          onPress={onReset}
        />
      ) : null}

      <ExportReportActions kind={kind} result={result} scanId={scanId} asset={asset} delay={45} />

      <ResultScoreSection
        title={kind === 'face' ? 'Shape match' : isExpression(result) ? 'Emotion distribution' : 'Result confidence'}
        icon={icons[kind]}
        scores={matchScores(result)}
        delay={70}
      />

      <ResultScoreSection
        title="Feature confidence"
        icon="analytics-outline"
        scores={featureScores(result)}
        delay={120}
      />

      {/* 2-column Detail Diagnostic Cards */}
      <View style={styles.grid}>
        {allDetails.map((item, index) => (
          <View key={`${item.title}-${index}`} style={styles.gridItem}>
            <DetailCard item={item} delay={70 + index * 45} />
          </View>
        ))}
      </View>

      <ResultScoreSection
        title="Scan quality"
        icon="shield-checkmark-outline"
        scores={qualityScores(result)}
        delay={200}
      />

      {/* Photo Validation Checks */}
      <AnimatedCard delay={220}>
        <View style={styles.sectionTitle}>
          <View style={[styles.sectionIconWrap, { backgroundColor: theme.successSoft }]}>
            <Ionicons name="shield-checkmark" color={theme.success} size={18} />
          </View>
          <AppText variant="h3" weight="bold">Photo checks</AppText>
        </View>
        <View style={styles.badges}>
          <AppBadge
            label={quality.single_face ? 'Single face' : 'Multiple faces'}
            tone={quality.single_face ? 'success' : 'warning'}
          />
          <AppBadge
            label={quality.front_facing ? 'Front facing' : 'Turn forward'}
            tone={quality.front_facing ? 'success' : 'warning'}
          />
          <AppBadge label={labelize(quality.lighting)} tone="neutral" />
        </View>
        {quality.warnings.map((warning) => (
          <View key={warning} style={styles.tip}>
            <Ionicons name="alert-circle" color={theme.warning} size={18} />
            <AppText color={theme.text} weight="medium" style={styles.tipText}>{warning}</AppText>
          </View>
        ))}
      </AnimatedCard>

      {/* Personal Recommendations */}
      {recommendations.length > 0 ? (
        <AnimatedCard delay={250}>
          <View style={styles.sectionTitle}>
            <View style={[styles.sectionIconWrap, { backgroundColor: theme.primarySoft }]}>
              <Ionicons name="bulb" color={theme.primary} size={18} />
            </View>
            <AppText variant="h3" weight="bold">Personal recommendations</AppText>
          </View>
          <View style={styles.recList}>
            {recommendations.slice(0, 8).map((item) => (
              <View key={item} style={styles.tip}>
                <Ionicons name="checkmark-circle" color={theme.secondary} size={18} />
                <AppText color={theme.text} weight="medium" style={styles.tipText}>{item}</AppText>
              </View>
            ))}
          </View>
        </AnimatedCard>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  summary: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  summaryCopy: { flex: 1, alignItems: 'flex-start', gap: 4 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  eyebrow: { letterSpacing: 0.8, fontSize: 10 },
  categoryLabel: { textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 11 },
  resultTitle: { letterSpacing: -0.3, marginTop: -2, marginBottom: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs },
  gridItem: { width: '50%', padding: spacing.xs },
  detail: { minHeight: 78, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  detailIcon: { width: 42, height: 42, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  detailCopy: { flex: 1, gap: 2 },
  detailLabel: { textTransform: 'uppercase', letterSpacing: 0.7, fontSize: 10 },
  detailValue: { fontSize: 15, fontWeight: '800', lineHeight: 20 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  sectionIconWrap: { width: 32, height: 32, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  recList: { gap: spacing.sm },
  tip: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.sm },
  tipText: { flex: 1, fontSize: 14, lineHeight: 20 },
  smileCardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  smileEmojiBox: { width: 64, height: 64, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center' },
});


