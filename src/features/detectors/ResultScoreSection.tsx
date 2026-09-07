import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AppText } from '@/components/ui/AppText';
import { ScoreBar } from '@/components/ui/ScoreBar';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface ScoreMetric { label: string; value: number }
interface Props { title: string; icon: keyof typeof Ionicons.glyphMap; scores: ScoreMetric[]; delay?: number }

export function ResultScoreSection({ title, icon, scores, delay = 0 }: Props) {
  const theme = useAppTheme();
  if (!scores.length) return null;
  return (
    <AnimatedCard delay={delay}>
      <View style={styles.heading}>
        <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
          <Ionicons name={icon} size={17} color={theme.primary} />
        </View>
        <AppText variant="h3" weight="bold">{title}</AppText>
      </View>
      <View style={styles.scores}>
        {scores.map((score, index) => (
          <ScoreBar
            key={score.label}
            {...score}
            highlight={index === 0}
            delay={delay + index * 60}
          />
        ))}
      </View>
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  heading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  icon: { width: 34, height: 34, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  scores: { gap: spacing.md },
});

