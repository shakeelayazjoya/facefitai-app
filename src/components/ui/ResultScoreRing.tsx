import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { radii } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ResultScoreRing({ score, label, size = 112 }: { score: number; label: string; size?: number }) {
  const theme = useAppTheme();
  const strokeWidth = 8;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = Math.PI * 2 * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(Math.min(Math.max(score, 0), 100), { duration: 950 });
  }, [progress, score]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value / 100),
  }));

  const gradientId = `scoreRingGrad-${size}`;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.primary} />
            <Stop offset="100%" stopColor={theme.secondary} />
          </SvgGradient>
        </Defs>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.surfaceAlt}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.8}
        />
        {/* Animated Gradient Progress */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.score, { color: theme.textStrong }]}>{Math.round(score)}%</Text>
        <View style={[styles.labelBadge, { backgroundColor: theme.primarySoft }]}>
          <Text style={[styles.label, { color: theme.primary }]}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  score: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  labelBadge: {
    borderRadius: radii.pill,
    paddingHorizontal: 7,
    paddingVertical: 1.5,
  },
  label: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});

