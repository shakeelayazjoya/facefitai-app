import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AppBadge } from '@/components/ui/Badge';
import { AppText } from '@/components/ui/AppText';
import { radii, spacing } from '@/constants/theme';
import type { OnboardingItem } from '@/constants/onboarding';
import { useAppTheme } from '@/hooks/useAppTheme';

export function OnboardingSlide({ item, width }: { item: OnboardingItem; width: number }) {
  const theme = useAppTheme();
  return (
    <View style={[styles.slide, { width }]}> 
      <Animated.View entering={FadeInDown.springify()} style={[styles.visual, { backgroundColor: theme.primarySoft, borderColor: theme.border }]}> 
        <View style={[styles.orbit, { borderColor: theme.primary }]} />
        <View style={[styles.icon, { backgroundColor: theme.primary }]}> 
          <Ionicons name={item.icon} color={theme.white} size={46} />
        </View>
        <View style={[styles.miniCard, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
          <Ionicons name="shield-checkmark-outline" color={theme.success} size={18} />
          <AppText variant="caption" weight="bold">Private</AppText>
        </View>
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.copy}> 
        <AppText variant="caption" weight="black" color={theme.primary} style={styles.eyebrow}>{item.eyebrow}</AppText>
        <AppText variant="display" editorial weight="black" align="center">{item.title}</AppText>
        <AppText variant="body" color={theme.mutedText} align="center" style={styles.description}>{item.description}</AppText>
        <View style={styles.badges}>{item.highlights.map((text) => <AppBadge key={text} label={text} tone="primary" />)}</View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { paddingHorizontal: spacing.lg, justifyContent: 'center', gap: spacing.xl },
  visual: { height: 240, borderRadius: radii.hero, borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  orbit: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 1, opacity: 0.25 },
  icon: { width: 96, height: 96, borderRadius: 32, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-5deg' }] },
  miniCard: { position: 'absolute', right: 18, bottom: 18, paddingHorizontal: 14, paddingVertical: 11, borderRadius: radii.lg, borderWidth: 1, flexDirection: 'row', gap: 7, alignItems: 'center' },
  copy: { alignItems: 'center' }, eyebrow: { letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: spacing.sm },
  description: { marginTop: spacing.md, maxWidth: 410 }, badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
});
