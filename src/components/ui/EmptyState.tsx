import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
export function EmptyState({ title, message, icon = 'sparkles-outline' }: { title: string; message: string; icon?: keyof typeof Ionicons.glyphMap }) {
  const theme = useAppTheme();
  return (
    <Animated.View entering={FadeInUp.springify()} style={[styles.wrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
        <Ionicons name={icon} size={22} color={theme.primary} />
      </View>
      <Text style={[styles.title, { color: theme.textStrong }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.mutedText }]}>{message}</Text>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  wrap: { alignItems: 'center', padding: spacing.xl, borderRadius: radii.xl, borderWidth: 1, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' },
  icon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  title: { fontWeight: '900', fontSize: 16, textAlign: 'center', letterSpacing: -0.2 },
  message: { marginTop: spacing.xs, textAlign: 'center', lineHeight: 19, fontSize: 13, maxWidth: 360 }
});
