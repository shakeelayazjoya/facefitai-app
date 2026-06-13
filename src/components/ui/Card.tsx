import { StyleSheet, View, type ViewProps } from 'react-native';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

export function Card({ style, ...props }: ViewProps) {
  const theme = useAppTheme();
  return <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, boxShadow: `0 7px 22px ${theme.shadow}` }, style]} {...props} />;
}

export const AppCard = Card;
const styles = StyleSheet.create({ card: { borderWidth: 1, borderRadius: radii.xl, padding: spacing.md, borderCurve: 'continuous' } });
