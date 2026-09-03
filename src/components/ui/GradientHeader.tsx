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

      <View style={styles.eyebrow}>
        {eyebrow ? (
          <>
            <Ionicons name={icon} size={13} color={theme.primary} />
            <AppText variant="caption" color={theme.primary} style={styles.label}>
              {eyebrow}
            </AppText>
          </>
        ) : null}
      </View>
      <AppText variant="h1" weight="black" align="center" style={styles.title}>
        {title}
      </AppText>
      {description ? (
        <AppText variant="small" muted align="center">
          {description}
        </AppText>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, gap: spacing.xxs },
  logoBadge: { marginBottom: 2 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  label: { textTransform: 'uppercase', letterSpacing: 1.1 },
  title: { textTransform: 'uppercase', letterSpacing: 0.4 },
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
