import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { AppText } from './AppText';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

interface AnalysisLoaderProps {
  label: string;
  compact?: boolean;
  variant?: 'overlay' | 'card';
}

export function AnalysisLoader({
  label,
  compact = false,
  variant,
}: AnalysisLoaderProps) {
  const theme = useAppTheme();
  const isOverlay = variant === 'overlay' || compact;

  const rotation = useSharedValue(0);
  const pulse = useSharedValue(0.92);
  const scanPosition = useSharedValue(-80);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1600, easing: Easing.linear }),
      -1,
    );
    pulse.value = withRepeat(
      withTiming(1.06, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    scanPosition.value = withRepeat(
      withTiming(100, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse, rotation, scanPosition]);

  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: scanPosition.value }],
  }));

  return (
    <View
      style={[
        styles.wrap,
        isOverlay && styles.hudContainer,
        compact && styles.compact,
      ]}
    >
      <View style={styles.visual}>
        <Animated.View
          style={[
            styles.orbit,
            { borderColor: isOverlay ? '#A78BFA' : theme.primary },
            orbitStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.icon,
            { backgroundColor: isOverlay ? 'rgba(124, 58, 237, 0.35)' : theme.primarySoft },
            iconStyle,
          ]}
        >
          <Ionicons
            name="scan-outline"
            color={isOverlay ? '#34D399' : theme.primary}
            size={28}
          />
        </Animated.View>
      </View>

      <View style={styles.textContainer}>
        <AppText
          variant="h3"
          weight="bold"
          align="center"
          color={isOverlay ? '#FFFFFF' : theme.textStrong}
        >
          {label}
        </AppText>
        <AppText
          variant="small"
          weight="medium"
          align="center"
          color={isOverlay ? '#34D399' : theme.mutedText}
        >
          Analyzing biometric landmarks...
        </AppText>
      </View>

      <View
        style={[
          styles.track,
          { backgroundColor: isOverlay ? 'rgba(255, 255, 255, 0.15)' : theme.surfaceAlt },
        ]}
      >
        <Animated.View style={[styles.progressWrapper, scanStyle]}>
          <LinearGradient
            colors={[theme.primary, theme.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressGradient}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  hudContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.86)',
    borderRadius: radii.xxl,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.35)',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  compact: {
    width: '86%',
    maxWidth: 290,
  },
  visual: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbit: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: 4,
  },
  track: {
    width: '78%',
    height: 5,
    borderRadius: radii.pill,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  progressWrapper: {
    width: '60%',
    height: '100%',
  },
  progressGradient: {
    flex: 1,
    borderRadius: radii.pill,
  },
});
