import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { AppText } from './AppText';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

export function AnalysisLoader({ label, compact = false }: { label: string; compact?: boolean }) {
  const theme = useAppTheme(); const rotation = useSharedValue(0); const pulse = useSharedValue(0.9);
  useEffect(() => { rotation.value = withRepeat(withTiming(360, { duration: 1300, easing: Easing.linear }), -1); pulse.value = withRepeat(withTiming(1.08, { duration: 800 }), -1, true); }, [pulse, rotation]);
  const orbit = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  const icon = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  return <View style={[styles.wrap, compact && styles.compact]}><View style={styles.visual}><Animated.View style={[styles.orbit, { borderColor: theme.primary }, orbit]} /><Animated.View style={[styles.icon, { backgroundColor: theme.primarySoft }, icon]}><Ionicons name="scan-outline" color={theme.primary} size={28} /></Animated.View></View><AppText variant="h3" align="center">{label}</AppText><AppText variant="small" muted align="center">Finding features...</AppText><View style={[styles.track, { backgroundColor: theme.surfaceAlt }]}><Animated.View style={[styles.progress, { backgroundColor: theme.primary }, orbit]} /></View></View>;
}
const styles = StyleSheet.create({ wrap: { width: '100%', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.sm }, compact: { width: '78%', maxWidth: 260 }, visual: { width: 74, height: 74, alignItems: 'center', justifyContent: 'center' }, orbit: { position: 'absolute', width: 68, height: 68, borderRadius: 34, borderWidth: 3, borderStyle: 'dashed' }, icon: { width: 48, height: 48, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center' }, track: { width: '72%', height: 4, borderRadius: radii.pill, overflow: 'hidden', marginTop: spacing.sm }, progress: { width: '42%', height: 4, borderRadius: radii.pill } });
