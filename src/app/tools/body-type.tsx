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

export default function BodyTypeCalculatorScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const [wrist, setWrist] = useState('6.5');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [result, setResult] = useState<{ type: string; ratio: string; desc: string; fitness: string } | null>(null);

  const calculate = () => {
    const w = parseFloat(wrist) || 6.5;
    const h = parseFloat(height) || 175;
    const wt = parseFloat(weight) || 70;

    const bmi = wt / ((h / 100) * (h / 100));

    let type = 'Mesomorph (Athletic Build)';
    let ratio = 'Ecto 20% | Meso 60% | Endo 20%';
    let desc = 'Naturally muscular frame, broad shoulders, narrow waist, and fast response to strength training.';
    let fitness = 'Balanced macro splits (40% carb / 30% protein / 30% fat) with moderate cardio and strength intervals.';

    if (w < 6.0 && bmi < 20.5) {
      type = 'Ectomorph (Lean & Linear)';
      ratio = 'Ecto 70% | Meso 20% | Endo 10%';
      desc = 'Slender bone structure, narrow shoulders, long limbs, and fast metabolism with low muscle mass.';
      fitness = 'Higher complex carb intake (50%+), heavy compound resistance training, and lower cardio volume.';
    } else if (bmi > 26.0) {
      type = 'Endomorph (Curvy / Solid)';
      ratio = 'Ecto 15% | Meso 25% | Endo 60%';
      desc = 'Wider skeletal frame, higher natural body density, soft curves, and slower caloric turnover.';
      fitness = 'Lower carb intake (25-30%), high-intensity interval training (HIIT), and consistent strength work.';
    }

    setResult({ type, ratio, desc, fitness });
  };

  return (
    <ScreenWrapper>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.screen}>
        <View style={[styles.content, { maxWidth: responsive.contentWidth }]}>
          <GradientHeader
            showBack={true}
            eyebrow="Somatotype Science"
            title="Body Type Calculator"
            description="Calculate your Somatotype ratio (Ectomorph, Mesomorph, Endomorph) based on frame geometry."
            icon="fitness-outline"
          />

          <AnimatedCard>
            <View style={{ gap: spacing.md }}>
              <AppText variant="h3">Skeletal & Body Metrics</AppText>

              <View style={styles.inputGrid}>
                <View style={styles.field}>
                  <AppText variant="caption" muted>WRIST GIRTH (INCHES)</AppText>
                  <TextInput
                    value={wrist}
                    onChangeText={setWrist}
                    keyboardType="numeric"
                    style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
                  />
                </View>

                <View style={styles.field}>
                  <AppText variant="caption" muted>HEIGHT (CM)</AppText>
                  <TextInput
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                    style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
                  />
                </View>

                <View style={styles.field}>
                  <AppText variant="caption" muted>WEIGHT (KG)</AppText>
                  <TextInput
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
                  />
                </View>
              </View>

              <AppButton title="Calculate Somatotype" onPress={calculate} style={{ marginTop: spacing.xs }} />
            </View>
          </AnimatedCard>

          {result ? (
            <AnimatedCard>
              <View style={{ gap: spacing.sm }}>
                <AppText variant="caption" muted>
                  PRIMARY SOMATOTYPE
                </AppText>
                <AppText variant="h1" style={{ color: theme.primary }}>
                  {result.type}
                </AppText>
                <AppText style={{ color: theme.primary, fontWeight: '700' }}>
                  {result.ratio}
                </AppText>
                <AppText style={{ lineHeight: 22 }}>{result.desc}</AppText>

                <AppText variant="h3" style={{ marginTop: spacing.sm }}>
                  Fitness & Nutrition Advice
                </AppText>
                <AppText muted style={{ fontSize: 13, lineHeight: 20 }}>
                  {result.fitness}
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
  inputGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  field: { width: '47%' },
  input: { height: 46, borderRadius: radii.md, borderWidth: 1, paddingHorizontal: 12, fontSize: 16, marginTop: 4, fontWeight: '700' },
});
