import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppText } from './AppText';
import { BrandLogo } from './BrandLogo';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  showLogo?: boolean;
  /** Optional top-right action. Profile is not in the tab bar, so it is reached from here. */
  action?: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void };
  showBack?: boolean;
  onBack?: () => void;
}

export function GradientHeader({ eyebrow, title, description, icon = 'sparkles', showLogo = true, action, showBack, onBack }: Props) {
  const theme = useAppTheme();
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/more');
    }
  };

  return (
    <Animated.View entering={FadeInDown.springify()} style={styles.wrap}>
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={10}
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backAction,
            { backgroundColor: theme.surfaceGlass, borderColor: theme.border, opacity: pressed ? 0.65 : 1 },
          ]}
        >
          <Ionicons name="arrow-back" size={20} color={theme.textStrong} />
        </Pressable>
      ) : null}

      {action ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={action.label}
          hitSlop={10}
          onPress={action.onPress}
          style={({ pressed }) => [
            styles.action,
            { backgroundColor: theme.surfaceGlass, borderColor: theme.border, opacity: pressed ? 0.65 : 1 },
          ]}
        >
          <Ionicons name={action.icon} size={19} color={theme.textStrong} />
        </Pressable>
      ) : null}

      {showLogo && !showBack ? (
        <View style={styles.logoBadge}>
          <BrandLogo size={32} />
        </View>
      ) : null}

      {eyebrow ? (
        <View style={[styles.eyebrowPill, { backgroundColor: theme.primarySoft }]}>
          <Ionicons name={icon} size={13} color={theme.primary} />
          <AppText variant="caption" weight="black" color={theme.primary} style={styles.label}>
            {eyebrow}
          </AppText>
        </View>
      ) : null}

      <AppText variant="h1" weight="black" align="center" style={styles.title}>
        {title}
      </AppText>

      {description ? (
        <AppText variant="body" weight="medium" color={theme.text} align="center" style={styles.description}>
          {description}
        </AppText>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.lg, gap: spacing.xs },
  logoBadge: { marginBottom: 4 },
  eyebrowPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 4, borderRadius: radii.pill, marginBottom: 2 },
  label: { textTransform: 'uppercase', letterSpacing: 1.2 },
  title: { textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 26 },
  description: { marginTop: 2, fontSize: 14, fontWeight: '500' },
  backAction: {
    position: 'absolute',
    left: 0,
    top: spacing.sm,
    zIndex: 2,
    height: 40,
    width: 40,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    position: 'absolute',
    right: 0,
    top: spacing.sm,
    zIndex: 2,
    height: 40,
    width: 40,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
