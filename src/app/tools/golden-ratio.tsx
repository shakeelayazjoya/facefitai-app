import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/Button';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { spacing, radii } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { facefitApi } from '@/services/facefitApi';
import type { GoldenRatioResponse } from '@/types/api';
import { ImagePickerPanel } from '@/features/detectors/ImagePickerPanel';
import type { ImageAsset } from '@/utils/formData';
import { useResponsive } from '@/utils/responsive';
import { useToast } from '@/hooks/useToast';

export default function GoldenRatioScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const { showToast } = useToast();
  const [asset, setAsset] = useState<ImageAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GoldenRatioResponse | null>(null);

  const analyze = async (image: ImageAsset) => {
    setAsset(image);
    setLoading(true);
    setResult(null);
    try {
      const res = await facefitApi.analyzeGoldenRatio(image);
      setResult(res);
    } catch (err: any) {
      showToast(err.message || 'Failed to analyze golden ratio proportions.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAsset(null);
    setResult(null);
  };

  return (
    <ScreenWrapper>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.screen}>
        <View style={[styles.content, { maxWidth: responsive.contentWidth }]}>
          <GradientHeader
            showBack={true}
            eyebrow="Facial Geometry"
            title="Golden Ratio Face Test"
            description="Measure your 7 key facial landmark proportions against classical Phi (1.618) geometry."
            icon="calculator-outline"
          />

          {!asset ? (
            <ImagePickerPanel
              kind="face"
              disabled={loading}
              title="Golden Ratio Scan"
              description="Upload a clear, front-facing selfie with a neutral expression."
              uploadAction="Upload selfie"
              cameraAction="Take photo"
              filePrefix="golden-ratio"
              onPick={analyze}
            />
          ) : (
            <View style={styles.imageContainer}>
              <Image source={{ uri: asset.uri }} style={styles.previewImage} resizeMode="cover" />
            </View>
          )}

          {loading ? (
            <AnimatedCard>
              <AppText variant="h3" align="center">
                Analyzing 70+ Facial Landmarks...
              </AppText>
              <AppText muted align="center" style={{ marginTop: 4 }}>
                Calculating Phi 1.618 proportion deviations and facial harmony score.
              </AppText>
            </AnimatedCard>
          ) : null}

          {result ? (
            <View style={styles.resultsWrapper}>
              <AnimatedCard>
                <View style={styles.scoreRow}>
                  <View>
                    <AppText variant="caption" muted>
                      FACIAL HARMONY SCORE
                    </AppText>
                    <AppText variant="h1" style={{ color: theme.primary, fontSize: 36 }}>
                      {Math.round(result.harmony_score)}%
                    </AppText>
                  </View>
                  <View style={[styles.badge, { backgroundColor: theme.primarySoft }]}>
                    <AppText style={{ color: theme.primary, fontWeight: '700' }}>
                      {result.harmony_level}
                    </AppText>
                  </View>
                </View>

                {result.recommendations?.length ? (
                  <View style={{ marginTop: spacing.md }}>
                    <AppText variant="caption" muted style={{ marginBottom: 4 }}>
                      GEOMETRIC INSIGHTS
                    </AppText>
                    {result.recommendations.map((rec, i) => (
                      <AppText key={i} style={{ marginTop: 4, fontSize: 13 }}>
                        • {rec}
                      </AppText>
                    ))}
                  </View>
                ) : null}
              </AnimatedCard>

              <AppText variant="h3" style={{ marginTop: spacing.md, marginBottom: spacing.xs }}>
                Proportion Breakdowns ({result.metrics.length})
              </AppText>

              {result.metrics.map((metric, idx) => (
                <AnimatedCard key={metric.key} delay={idx * 50}>
                  <View style={styles.metricCard}>
                    <View style={styles.metricHeader}>
                      <AppText weight="bold">{metric.label}</AppText>
                      <AppText weight="bold" style={{ color: theme.primary }}>
                        {Math.round(metric.score)}%
                      </AppText>
                    </View>

                    <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${Math.max(5, Math.min(100, metric.score))}%`,
                            backgroundColor: theme.primary,
                          },
                        ]}
                      />
                    </View>

                    <View style={styles.metricDetails}>
                      <AppText muted style={{ fontSize: 12 }}>
                        Ratio: {metric.measured} (Ideal: {metric.ideal})
                      </AppText>
                      <AppText muted style={{ fontSize: 12 }}>
                        Deviation: {metric.deviation_percent}%
                      </AppText>
                    </View>
                    <AppText muted style={{ fontSize: 12, marginTop: 4 }}>
                      {metric.description}
                    </AppText>
                  </View>
                </AnimatedCard>
              ))}

              <AppButton title="Analyze another photo" variant="secondary" onPress={reset} style={{ marginTop: spacing.md }} />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { padding: spacing.md, paddingBottom: 44 },
  content: { width: '100%', alignSelf: 'center', gap: spacing.md },
  imageContainer: { height: 240, width: '100%', borderRadius: radii.lg, overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%' },
  resultsWrapper: { gap: spacing.md },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.md },
  metricCard: { gap: spacing.xs },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressBarBg: { height: 8, borderRadius: 4, width: '100%', overflow: 'hidden', marginVertical: 4 },
  progressBarFill: { height: '100%', borderRadius: 4 },
  metricDetails: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
});
