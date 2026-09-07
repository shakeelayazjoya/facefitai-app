import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

export type BadgeTone = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';

interface Props {
  label: string;
  tone?: BadgeTone;
  style?: ViewStyle;
}

export function Badge({ label, tone = 'neutral', style }: Props) {
  const theme = useAppTheme();

  const getColors = (): { color: string; backgroundColor: string; borderColor: string } => {
    switch (tone) {
      case 'primary':
        return {
          color: theme.primary,
          backgroundColor: theme.primarySoft,
          borderColor: theme.primaryDark ? `${theme.primary}33` : 'transparent',
        };
      case 'secondary':
      case 'success':
        return {
          color: theme.secondary,
          backgroundColor: theme.successSoft,
          borderColor: `${theme.secondary}33`,
        };
      case 'warning':
        return {
          color: theme.warning,
          backgroundColor: theme.warningSoft,
          borderColor: `${theme.warning}33`,
        };
      case 'danger':
        return {
          color: theme.danger,
          backgroundColor: theme.dangerSoft,
          borderColor: `${theme.danger}33`,
        };
      case 'neutral':
      default:
        return {
          color: theme.textStrong,
          backgroundColor: theme.surfaceAlt,
          borderColor: theme.border,
        };
    }
  };

  const { color, backgroundColor, borderColor } = getColors();

  return (
    <View style={[styles.wrap, { backgroundColor, borderColor }, style]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

export const AppBadge = Badge;

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  text: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});

