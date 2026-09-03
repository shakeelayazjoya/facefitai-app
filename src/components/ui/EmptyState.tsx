import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { AppText } from './AppText';

export function EmptyState({ title, message, icon = 'sparkles-outline' }: { title: string; message: string; icon?: keyof typeof Ionicons.glyphMap }) {
  const theme = useAppTheme();
  return (
    <Animated.View entering={FadeInUp.springify()} style={[styles.wrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
        <Ionicons name={icon} size={24} color={theme.primary} />
      </View>
      <AppText variant="h3" weight="black" align="center" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" weight="medium" color={theme.text} align="center" style={styles.message}>
        {message}
      </AppText>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  wrap: { alignItems: 'center', padding: spacing.xl, borderRadius: radii.xl, borderWidth: 1, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' },
  icon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  title: { fontSize: 17, letterSpacing: -0.2 },
  message: { marginTop: spacing.xs, fontSize: 14, lineHeight: 20, maxWidth: 360 }
});
