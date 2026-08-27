import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AppText } from '@/components/ui/AppText';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { spacing, radii } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/utils/responsive';

const KIBBE_TYPES = [
  { name: 'Dramatic', family: 'YANG (Extreme Sharp)', desc: 'Tall, angular bone structure, extreme vertical line, crisp sharp lines.' },
  { name: 'Soft Dramatic', family: 'YANG (Bold Curve)', desc: 'Tall & angular frame with lush, voluptuous curves and bold presence.' },
  { name: 'Flamboyant Natural', family: 'NATURAL (Unconstructed Yang)', desc: 'Broad, blunt shoulders, long vertical line, relaxed silhouette.' },
  { name: 'Soft Natural', family: 'NATURAL (Soft Yang)', desc: 'Broad blunt bone structure with soft, curvy flesh overlay.' },
  { name: 'Dramatic Classic', family: 'CLASSIC (Tailored Balance)', desc: 'Symmetrical classic frame with slight angular Yang sharpness.' },
  { name: 'Soft Classic', family: 'CLASSIC (Soft Balance)', desc: 'Symmetrical classic frame with gentle Yin rounded softness.' },
  { name: 'Flamboyant Gamine', family: 'GAMINE (High-Contrast Yang)', desc: 'Compact height, high contrast juxtaposition, sharp energetic lines.' },
  { name: 'Soft Gamine', family: 'GAMINE (High-Contrast Yin)', desc: 'Compact height, doll-like features, soft curves with sharp shoulders.' },
  { name: 'Romantic', family: 'YIN (Extreme Soft)', desc: 'Lush hour-glass curves, soft delicate bone structure, round features.' },
  { name: 'Theatrical Romantic', family: 'YIN (Spiced Curve)', desc: 'Lush delicate curves with a pinch of sharp Yang angularity.' },
];

export default function KibbeTypesGuideScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const active = KIBBE_TYPES[selectedIdx];

  return (
    <ScreenWrapper>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.screen}>
        <View style={[styles.content, { maxWidth: responsive.contentWidth }]}>
          <GradientHeader
            showBack={true}
            eyebrow="Image ID System"
            title="Kibbe Body Types Guide"
            description="Explore David Kibbe’s 13 body types categorized by Yin (Soft/Rounded) vs Yang (Sharp/Angular)."
            icon="shirt-outline"
          />

          <View style={styles.chipRow}>
            {KIBBE_TYPES.map((kt, i) => {
              const selected = selectedIdx === i;
              return (
                <TouchableOpacity
                  key={kt.name}
                  activeOpacity={0.7}
                  onPress={() => setSelectedIdx(i)}
                  style={[
                    styles.chip,
                    {
                      borderColor: selected ? theme.primary : theme.border,
                      backgroundColor: selected ? theme.primary : theme.surface,
                    },
                  ]}
                >
                  <AppText style={{ color: selected ? '#FFF' : theme.text, fontSize: 12, fontWeight: '700' }}>
                    {kt.name}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          {active ? (
            <AnimatedCard key={active.name}>
              <View style={{ gap: spacing.md }}>
                <View>
                  <AppText variant="caption" style={{ color: theme.primary, fontWeight: '700' }}>
                    {active.family}
                  </AppText>
                  <AppText variant="h1" style={{ marginTop: 2 }}>
                    {active.name}
                  </AppText>
                </View>

                <AppText style={{ lineHeight: 22, fontSize: 15 }}>{active.desc}</AppText>

                <AppText variant="h3" style={{ marginTop: spacing.xs }}>
                  Recommended Lines & Fabrics
                </AppText>
                <AppText muted style={{ fontSize: 13, lineHeight: 20 }}>
                  • Match your clothes to your natural bone geometry without forcing unnatural tailoring.
                </AppText>
                <AppText muted style={{ fontSize: 13, lineHeight: 20 }}>
                  • Maintain proper silhouette harmony from shoulders to hemline.
                </AppText>
              </View>
            </AnimatedCard>
          ) : null}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { padding: spacing.md, paddingBottom: 44 },
  content: { width: '100%', alignSelf: 'center', gap: spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: radii.pill, borderWidth: 1 },
});
