import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppText } from './AppText';
import { spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

export function GradientHeader({ eyebrow, title, description, icon = 'sparkles' }: { eyebrow?: string; title: string; description?: string; icon?: keyof typeof Ionicons.glyphMap }) {
  const theme = useAppTheme(); return <Animated.View entering={FadeInDown.springify()} style={styles.wrap}><View style={styles.eyebrow}>{eyebrow ? <><Ionicons name={icon} size={13} color={theme.gold} /><AppText variant="caption" color={theme.gold} style={styles.label}>{eyebrow}</AppText></> : null}</View><AppText variant="display" editorial weight="bold" align="center" style={styles.title}>{title}</AppText>{description ? <AppText variant="small" muted align="center">{description}</AppText> : null}</Animated.View>;
}
const styles = StyleSheet.create({ wrap: { alignItems: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, gap: spacing.xxs }, eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 5 }, label: { textTransform: 'uppercase', letterSpacing: 1.1 }, title: { textTransform: 'uppercase', letterSpacing: 0.4 } });
