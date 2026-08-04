import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppText } from './AppText';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Optional top-right action. Profile is not in the tab bar, so it is reached from here. */
  action?: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void };
}

export function GradientHeader({ eyebrow, title, description, icon = 'sparkles', action }: Props) {
  const theme = useAppTheme();
  return <Animated.View entering={FadeInDown.springify()} style={styles.wrap}>
    {action ? <Pressable accessibilityRole="button" accessibilityLabel={action.label} hitSlop={10} onPress={action.onPress} style={({ pressed }) => [styles.action, { backgroundColor: theme.surfaceGlass, borderColor: theme.border, opacity: pressed ? 0.65 : 1 }]}><Ionicons name={action.icon} size={19} color={theme.textStrong} /></Pressable> : null}
    <View style={styles.eyebrow}>{eyebrow ? <><Ionicons name={icon} size={13} color={theme.gold} /><AppText variant="caption" color={theme.gold} style={styles.label}>{eyebrow}</AppText></> : null}</View>
    <AppText variant="display" editorial weight="bold" align="center" style={styles.title}>{title}</AppText>
    {description ? <AppText variant="small" muted align="center">{description}</AppText> : null}
  </Animated.View>;
}
const styles = StyleSheet.create({ wrap: { alignItems: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, gap: spacing.xxs }, eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 5 }, label: { textTransform: 'uppercase', letterSpacing: 1.1 }, title: { textTransform: 'uppercase', letterSpacing: 0.4 }, action: { position: 'absolute', right: 0, top: spacing.sm, zIndex: 2, height: 40, width: 40, borderRadius: radii.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center' } });
