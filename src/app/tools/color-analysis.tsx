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
  title: string;
  options: { label: string; sub: string; season: 'spring' | 'summer' | 'autumn' | 'winter' }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'vein',
    title: 'Look at the veins on your inner wrist under natural light:',
    options: [
      { label: 'Green or olive green', sub: 'Warm undertone indicator', season: 'autumn' },
      { label: 'Blue or purple-ish', sub: 'Cool undertone indicator', season: 'summer' },
      { label: 'Blue-green mix', sub: 'Neutral undertone indicator', season: 'spring' },
      { label: 'Deep dark blue', sub: 'Cool high-contrast indicator', season: 'winter' },
    ],
  },
  {
    id: 'sun',
    title: 'How does your skin react to direct sun exposure?',
    options: [
      { label: 'Burns easily, rarely tans', sub: 'Cool & light contrast', season: 'summer' },
      { label: 'Tans easily, rarely burns', sub: 'Warm & golden contrast', season: 'autumn' },
      { label: 'Burns first, then turns golden', sub: 'Warm bright spring', season: 'spring' },
      { label: 'Tans quickly to deep bronze', sub: 'High contrast deep winter', season: 'winter' },
    ],
  },
  {
    id: 'contrast',
    title: 'What is the natural contrast between your hair, eyes & skin?',
    options: [
      { label: 'High contrast (e.g. Dark hair + light skin)', sub: 'Vibrant winter season', season: 'winter' },
      { label: 'Muted / Soft contrast', sub: 'Soft summer season', season: 'summer' },
      { label: 'Warm rich contrast', sub: 'Warm earthy autumn', season: 'autumn' },
      { label: 'Bright clear contrast', sub: 'Clear bright spring', season: 'spring' },
    ],
  },
  {
    id: 'jewelry',
    title: 'Which metal accentuates your skin best?',
    options: [
      { label: 'Yellow gold & brass', sub: 'Warm undertone', season: 'autumn' },
      { label: 'Silver & platinum', sub: 'Cool undertone', season: 'summer' },
      { label: 'Rose gold & light gold', sub: 'Light warm undertone', season: 'spring' },
      { label: 'Polished silver & white gold', sub: 'Cool vivid contrast', season: 'winter' },
    ],
  },
];

const PALETTES = {
  spring: {
    name: 'Warm Spring',
    desc: 'Bright, warm, and clear tones. Peach, coral, warm turquoise, golden yellow, and camel bring out your natural glow.',
    colors: ['#FF7F50', '#FFD700', '#40E0D0', '#FFA07A', '#C19A6B'],
  },
  summer: {
    name: 'Light Summer',
    desc: 'Soft, cool, and muted tones. Lavender, powder blue, soft rose, mint green, and slate gray flatter your soft contrast.',
    colors: ['#E6E6FA', '#B0E0E6', '#FFB6C1', '#98FF98', '#708090'],
  },
  autumn: {
    name: 'Warm Autumn',
    desc: 'Deep, rich, and earthy warm tones. Terracotta, rust, olive green, mustard yellow, and warm chocolate brown.',
    colors: ['#E2725B', '#808000', '#CC7722', '#7B3F00', '#D2691E'],
  },
  winter: {
    name: 'Cool Winter',
    desc: 'Vivid, cool, and high-contrast jewel tones. Royal blue, emerald green, ruby red, crisp white, and deep magenta.',
    colors: ['#4169E1', '#50C878', '#E0115F', '#8B008B', '#000000'],
  },
};

export default function ColorAnalysisQuizScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const [answers, setAnswers] = useState<Record<string, 'spring' | 'summer' | 'autumn' | 'winter'>>({});

  const selectAnswer = (qId: string, season: 'spring' | 'summer' | 'autumn' | 'winter') => {
    setAnswers((prev) => ({ ...prev, [qId]: season }));
  };

  const isComplete = Object.keys(answers).length === QUESTIONS.length;

  const calculateSeason = () => {
    const counts = { spring: 0, summer: 0, autumn: 0, winter: 0 };
    Object.values(answers).forEach((s) => counts[s]++);
    let top: keyof typeof PALETTES = 'spring';
    let max = -1;
    (Object.keys(counts) as (keyof typeof PALETTES)[]).forEach((s) => {
      if (counts[s] > max) {
        max = counts[s];
        top = s;
      }
    });
    return PALETTES[top];
  };

  const result = isComplete ? calculateSeason() : null;

  return (
    <ScreenWrapper>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.screen}>
        <View style={[styles.content, { maxWidth: responsive.contentWidth }]}>
          <GradientHeader
            showBack={true}
            eyebrow="Color Theory"
            title="Color Analysis Quiz"
            description="Identify your seasonal color palette (Spring, Summer, Autumn, Winter) for clothes & makeup."
            icon="color-palette-outline"
          />

          {!result ? (
            <View style={{ gap: spacing.md }}>
              {QUESTIONS.map((q, idx) => (
                <AnimatedCard key={q.id} delay={idx * 50}>
                  <AppText variant="h3" style={{ marginBottom: spacing.xs }}>
                    Question {idx + 1} of {QUESTIONS.length}
                  </AppText>
                  <AppText style={{ marginBottom: spacing.md, fontWeight: '600' }}>{q.title}</AppText>

                  <View style={{ gap: spacing.xs }}>
                    {q.options.map((opt) => {
                      const selected = answers[q.id] === opt.season;
                      return (
                        <TouchableOpacity
                          key={opt.label}
                          activeOpacity={0.7}
                          onPress={() => selectAnswer(q.id, opt.season)}
                          style={[
                            styles.optionButton,
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
                </AnimatedCard>
              ))}
            </View>
          ) : (
            <AnimatedCard>
              <View style={{ gap: spacing.md }}>
                <AppText variant="caption" muted>
                  YOUR SEASONAL COLOR RESULT
                </AppText>
                <AppText variant="h1" style={{ color: theme.primary }}>
                  {result.name}
                </AppText>
                <AppText style={{ lineHeight: 22 }}>{result.desc}</AppText>

                <AppText variant="h3" style={{ marginTop: spacing.xs }}>
                  Recommended Swatches
                </AppText>
                <View style={styles.colorRow}>
                  {result.colors.map((c) => (
                    <View key={c} style={[styles.colorBox, { backgroundColor: c }]} />
                  ))}
                </View>

                <AppButton
                  title="Retake Color Quiz"
                  variant="secondary"
                  onPress={() => setAnswers({})}
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
  optionButton: { padding: 12, borderRadius: radii.md, borderWidth: 1 },
  colorRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginVertical: 8 },
  colorBox: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#FFFFFF' },
});
