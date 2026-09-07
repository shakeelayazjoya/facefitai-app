import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from './AppText';
import { radii } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

interface Props {
  label: string;
  value: number;
  delay?: number;
  highlight?: boolean;
}

export function ScoreBar({ label, value, delay = 0, highlight = false }: Props) {
  const theme = useAppTheme();
  const progress = useSharedValue(0);
  const percent = Math.round(Math.max(0, Math.min(100, value <= 1 ? value * 100 : value)));

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(percent, { duration: 650 }));
  }, [delay, percent, progress]);

  const fill = useAnimatedStyle(() => ({ width: `${progress.value}%` }));

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <AppText weight={highlight ? 'black' : 'bold'} color={theme.textStrong}>
          {label}
        </AppText>
        <AppText weight="black" color={highlight ? theme.primary : theme.textStrong}>
          {percent}%
        </AppText>
      </View>
      <View style={[styles.track, { backgroundColor: theme.surfaceAlt }]}>
        <Animated.View style={[styles.fill, fill]}>
          <LinearGradient
            colors={[theme.primary, theme.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  track: { height: 7, overflow: 'hidden', borderRadius: radii.pill },
  fill: { height: '100%', borderRadius: radii.pill, overflow: 'hidden' },
});

