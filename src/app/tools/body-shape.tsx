import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/Button';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { spacing, radii } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/utils/responsive';

export default function BodyShapeCalculatorScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const [bust, setBust] = useState('36');
  const [waist, setWaist] = useState('27');
  const [highHip, setHighHip] = useState('34');
  const [hip, setHip] = useState('38');
  const [result, setResult] = useState<{ shape: string; desc: string; tips: string[] } | null>(null);

  const calculate = () => {
    const b = parseFloat(bust) || 0;
    const w = parseFloat(waist) || 0;
    const h = parseFloat(hip) || 0;

    let shape = 'Hourglass';
    let desc = 'Balanced bust and hip ratios with a well-defined waistline.';
    let tips = [
      'Fitted wrap dresses and belted coats accentuate your waist.',
      'V-neck and sweetheart necklines balance your upper torso.',
      'High-waisted trousers and pencil skirts complement natural proportions.',
    ];

    if (h - b >= 3.0 && h - w >= 7.0) {
      shape = 'Pear / Triangle';
      desc = 'Hips are distinctly wider than bust, with a defined waistline.';
      tips = [
        'A-line skirts and wide-leg trousers balance your lower half.',
        'Statement tops, ruffles, and structured shoulders draw eyes upward.',
        'Darker bottom colors with bright, patterned tops create harmony.',
      ];
    } else if (b - h >= 3.0) {
      shape = 'Inverted Triangle';
      desc = 'Bust and shoulders are broader than your hips and waist.';
      tips = [
        'Peplum tops and flared skirts add volume to the hips.',
        'V-neck tops and raglan sleeves soften broad shoulders.',
        'A-line dresses and wide belts create silhouette balance.',
      ];
    } else if (Math.abs(b - h) < 3.5 && w / b >= 0.75) {
      shape = 'Rectangle / Athletic';
      desc = 'Bust, waist, and hips are aligned with subtle curves.';
      tips = [
        'Belts and cinched waists create artificial hourglass curves.',
        'Ruffled tops, layered fabrics, and pleated skirts add dimension.',
        'Cropped jackets and high-waisted bottoms define your waist.',
      ];
    }

    setResult({ shape, desc, tips });
  };

  return (
    <ScreenWrapper>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.screen}>
        <View style={[styles.content, { maxWidth: responsive.contentWidth }]}>
          <GradientHeader
            showBack={true}
            eyebrow="Body Metrics"
            title="Body Shape Calculator"
            description="Calculate your exact body shape classification (Hourglass, Pear, Rectangle, Inverted Triangle, Apple)."
            icon="calculator-outline"
          />

          <AnimatedCard>
            <View style={{ gap: spacing.md }}>
              <AppText variant="h3">Enter Measurements (Inches / cm)</AppText>

              <View style={styles.inputGrid}>
                <View style={styles.field}>
                  <AppText variant="caption" muted>BUST / CHEST</AppText>
                  <TextInput
                    value={bust}
                    onChangeText={setBust}
                    keyboardType="numeric"
                    style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
                  />
                </View>

                <View style={styles.field}>
                  <AppText variant="caption" muted>WAIST CIRCUMFERENCE</AppText>
                  <TextInput
                    value={waist}
                    onChangeText={setWaist}
                    keyboardType="numeric"
                    style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
                  />
                </View>

                <View style={styles.field}>
                  <AppText variant="caption" muted>HIGH HIP</AppText>
                  <TextInput
                    value={highHip}
                    onChangeText={setHighHip}
                    keyboardType="numeric"
                    style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
                  />
                </View>

                <View style={styles.field}>
                  <AppText variant="caption" muted>HIP CIRCUMFERENCE</AppText>
                  <TextInput
                    value={hip}
                    onChangeText={setHip}
                    keyboardType="numeric"
                    style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
                  />
                </View>
              </View>

              <AppButton title="Calculate Body Shape" onPress={calculate} style={{ marginTop: spacing.xs }} />
            </View>
          </AnimatedCard>

          {result ? (
            <AnimatedCard>
              <View style={{ gap: spacing.sm }}>
                <AppText variant="caption" muted>
                  CALCULATION RESULT
                </AppText>
                <AppText variant="h1" style={{ color: theme.primary }}>
                  {result.shape}
                </AppText>
                <AppText style={{ lineHeight: 22 }}>{result.desc}</AppText>

                <AppText variant="h3" style={{ marginTop: spacing.sm }}>
                  Recommended Style Guidelines
                </AppText>
                {result.tips.map((t, idx) => (
                  <AppText key={idx} style={{ fontSize: 13, marginTop: 4 }}>
                    • {t}
                  </AppText>
                ))}
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
  inputGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  field: { width: '47%' },
  input: { height: 46, borderRadius: radii.md, borderWidth: 1, paddingHorizontal: 12, fontSize: 16, marginTop: 4, fontWeight: '700' },
});
