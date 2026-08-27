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

interface Question {
  id: string;
  section: string;
  title: string;
  options: { label: string; sub: string; type: 'A' | 'B' | 'C' | 'D' | 'E' }[];
}

const KIBBE_QUESTIONS: Question[] = [
  {
    id: 'q1',
    section: 'PART I: BONE STRUCTURE',
    title: 'How would you describe your vertical line (how tall you look)?',
    options: [
      { label: 'Long & Tall', sub: 'I look taller than I actually am (Extreme Yang)', type: 'A' },
      { label: 'Moderate', sub: 'I look my exact height', type: 'C' },
      { label: 'Small & Petite', sub: 'I look distinctly compact / petite (Yin)', type: 'E' },
    ],
  },
  {
    id: 'q2',
    section: 'PART I: BONE STRUCTURE',
    title: 'What shape are your shoulders?',
    options: [
      { label: 'Narrow & Square', sub: 'Sharp, angular shoulders', type: 'A' },
      { label: 'Broad & Blunt', sub: 'Wide, structured shoulders', type: 'B' },
      { label: 'Symmetrical', sub: 'Evenly balanced', type: 'C' },
      { label: 'Sloped & Soft', sub: 'Rounded, gentle slope', type: 'E' },
    ],
  },
  {
    id: 'q3',
    section: 'PART II: BODY FLESH',
    title: 'How does weight gain distribute on your body?',
    options: [
      { label: 'Evenly or in waist', sub: 'Retains angularity', type: 'A' },
      { label: 'Bust & Hips first', sub: 'Hourglass curve emphasis', type: 'E' },
      { label: 'Thighs & Lower waist', sub: 'Natural pear curve', type: 'D' },
    ],
  },
];

export default function KibbeTestScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>>({});

  const select = (qId: string, val: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const complete = Object.keys(answers).length === KIBBE_QUESTIONS.length;

  const calculateResult = () => {
    const counts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    Object.values(answers).forEach((v) => counts[v]++);
    if (counts.A >= 2) return { type: 'Dramatic', family: 'Extreme Yang', desc: 'Sharp, long, linear angular lines dominance.' };
    if (counts.B >= 2) return { type: 'Natural / Flamboyant Natural', family: 'Broad Yang', desc: 'Unconstructed broad shoulders and relaxed vertical lines.' };
    if (counts.E >= 2) return { type: 'Romantic', family: 'Extreme Yin', desc: 'Lush hour-glass curves and soft rounded bone structure.' };
    return { type: 'Classic / Soft Classic', family: 'Balanced Yin/Yang', desc: 'Symmetrical bone structure with gentle harmony.' };
  };

  const res = complete ? calculateResult() : null;

  return (
    <ScreenWrapper>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.screen}>
        <View style={[styles.content, { maxWidth: responsive.contentWidth }]}>
          <GradientHeader
            showBack={true}
            eyebrow="Image ID Quiz"
            title="Kibbe Body Type Test"
            description="Take our Yin vs Yang bone structure and flesh distribution quiz to find your Kibbe ID."
            icon="options-outline"
          />

          {!res ? (
            <View style={{ gap: spacing.md }}>
              {KIBBE_QUESTIONS.map((q, idx) => (
                <AnimatedCard key={q.id} delay={idx * 50}>
                  <View>
                    <AppText variant="caption" style={{ color: theme.primary, fontWeight: '700' }}>
                      {q.section}
                    </AppText>
                    <AppText style={{ fontSize: 16, fontWeight: '700', marginVertical: spacing.xs }}>
                      {q.title}
                    </AppText>

                    <View style={{ gap: spacing.xs, marginTop: spacing.xs }}>
                      {q.options.map((opt) => {
                        const selected = answers[q.id] === opt.type;
                        return (
                          <TouchableOpacity
                            key={opt.label}
                            activeOpacity={0.75}
                            onPress={() => select(q.id, opt.type)}
                            style={[
                              styles.optBtn,
                              {
                                borderColor: selected ? theme.primary : theme.border,
                                backgroundColor: selected ? theme.primarySoft : theme.surface,
                              },
                            ]}
                          >
                            <AppText style={{ fontWeight: selected ? '700' : '500', color: selected ? theme.primary : theme.text }}>
                              {opt.label}
                            </AppText>
                            <AppText muted style={{ fontSize: 12, marginTop: 2 }}>
                              {opt.sub}
                            </AppText>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </AnimatedCard>
              ))}
            </View>
          ) : (
            <AnimatedCard>
              <View style={{ gap: spacing.md }}>
                <AppText variant="caption" muted>
                  YOUR CALCULATED KIBBE TYPE
                </AppText>
                <AppText variant="h1" style={{ color: theme.primary }}>
                  {res.type}
                </AppText>
                <AppText style={{ color: theme.primary, fontWeight: '700' }}>
                  Family: {res.family}
                </AppText>
                <AppText style={{ lineHeight: 22, fontSize: 15 }}>{res.desc}</AppText>

                <AppButton title="Retake Kibbe Test" variant="secondary" onPress={() => setAnswers({})} style={{ marginTop: spacing.md }} />
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
  optBtn: { padding: 12, borderRadius: radii.md, borderWidth: 1 },
});
