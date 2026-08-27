import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/Button';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { spacing, radii } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/utils/responsive';
import { ImagePickerPanel } from '@/features/detectors/ImagePickerPanel';
import type { ImageAsset } from '@/utils/formData';

const SKINTONES = [
  { name: 'Fair / Porcelain', undertone: 'Cool (Pink / Rosy)', hex: '#FDF0E6', best: ['Soft Rose', 'Slate Gray', 'Navy', 'Emerald', 'Burgundy'] },
  { name: 'Light Ivory', undertone: 'Warm (Golden / Yellow)', hex: '#F3E5D8', best: ['Warm Coral', 'Peach', 'Golden Yellow', 'Camel', 'Teal'] },
  { name: 'Medium Olive', undertone: 'Warm (Olive / Greenish)', hex: '#D2B48C', best: ['Earth Tones', 'Terracotta', 'Rust', 'Warm Gold', 'Bronze'] },
  { name: 'Tan / Warm Bronze', undertone: 'Neutral (Balanced)', hex: '#C68642', best: ['Pure White', 'Royal Blue', 'Deep Violet', 'Fuchsia', 'Mustard'] },
  { name: 'Deep Espresso', undertone: 'Rich Cool / Neutral', hex: '#6F4E37', best: ['Vivid Jewel Tones', 'Cobalt', 'Crimson', 'Bright Turquoise', 'Gold'] },
];

export default function SkinToneAnalyzerScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [analyzed, setAnalyzed] = useState(false);

  const handlePick = (_image: ImageAsset) => {
    setSelectedIdx(2);
    setAnalyzed(true);
  };

  const selected = selectedIdx !== null ? SKINTONES[selectedIdx] : null;

  return (
    <ScreenWrapper>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.screen}>
        <View style={[styles.content, { maxWidth: responsive.contentWidth }]}>
          <GradientHeader
            showBack={true}
            eyebrow="Skin Aesthetics"
            title="Skin Tone Analyzer"
            description="Identify skin shade category, undertone classification, and complementary clothing colors."
            icon="color-fill-outline"
          />

          {!analyzed && selectedIdx === null ? (
            <View style={{ gap: spacing.md }}>
              <ImagePickerPanel
                kind="face"
                title="Selfie Skin Tone Scan"
                description="Upload a front selfie in even natural light to detect undertones."
                uploadAction="Upload selfie"
                cameraAction="Take photo"
                filePrefix="skin-tone"
                onPick={handlePick}
              />

              <AnimatedCard>
                <AppText variant="h3" style={{ marginBottom: spacing.xs }}>
                  Or Select Skin Shade Manually:
                </AppText>
                <View style={styles.swatchGrid}>
                  {SKINTONES.map((st, i) => (
                    <TouchableOpacity
                      key={st.name}
                      activeOpacity={0.8}
                      onPress={() => setSelectedIdx(i)}
                      style={[
                        styles.swatchCard,
                        {
                          borderColor: selectedIdx === i ? theme.primary : theme.border,
                          backgroundColor: theme.surface,
                        },
                      ]}
                    >
                      <View style={[styles.circleSwatch, { backgroundColor: st.hex }]} />
                      <View style={{ flex: 1 }}>
                        <AppText weight="bold" style={{ fontSize: 13 }}>{st.name}</AppText>
                        <AppText muted style={{ fontSize: 11 }}>{st.undertone}</AppText>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </AnimatedCard>
            </View>
          ) : (
            <AnimatedCard>
              <View style={{ gap: spacing.md }}>
                <AppText variant="caption" muted>
                  SKIN TONE CLASSIFICATION
                </AppText>

                {selected ? (
                  <>
                    <View style={styles.resultHeader}>
                      <View style={[styles.bigCircle, { backgroundColor: selected.hex }]} />
                      <View style={{ flex: 1 }}>
                        <AppText variant="h2">{selected.name}</AppText>
                        <AppText style={{ color: theme.primary, fontWeight: '700', marginTop: 2 }}>
                          Undertone: {selected.undertone}
                        </AppText>
                      </View>
                    </View>

                    <AppText variant="h3" style={{ marginTop: spacing.xs }}>
                      Best Flattering Clothing Palette
                    </AppText>

                    <View style={styles.tagWrap}>
                      {selected.best.map((c) => (
                        <View key={c} style={[styles.tagBadge, { backgroundColor: theme.primarySoft }]}>
                          <AppText style={{ color: theme.primary, fontWeight: '600', fontSize: 12 }}>
                            {c}
                          </AppText>
                        </View>
                      ))}
                    </View>
                  </>
                ) : null}

                <AppButton
                  title="Reset & Analyze Again"
                  variant="secondary"
                  onPress={() => {
                    setSelectedIdx(null);
                    setAnalyzed(false);
                  }}
                  style={{ marginTop: spacing.md }}
                />
              </View>
            </AnimatedCard>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { padding: spacing.md, paddingBottom: 44 },
  content: { width: '100%', alignSelf: 'center', gap: spacing.md },
  swatchGrid: { gap: spacing.xs, marginTop: spacing.xs },
  swatchCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: radii.md, borderWidth: 1, gap: 12 },
  circleSwatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#DDD' },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bigCircle: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#FFF' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  tagBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radii.md },
});
