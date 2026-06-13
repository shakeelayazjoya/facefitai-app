import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useAppTheme } from '@/hooks/useAppTheme';
export function SkeletonBlock({ height = 20, width = '100%' }: { height?: number; width?: number | `${number}%` }) { const theme = useAppTheme(); const opacity = useSharedValue(0.45); useEffect(() => { opacity.value = withRepeat(withTiming(0.9, { duration: 850 }), -1, true); }, [opacity]); const style = useAnimatedStyle(() => ({ opacity: opacity.value })); return <Animated.View style={[styles.block, { height, width, backgroundColor: theme.surfaceAlt }, style]} />; }
export const LoadingSkeleton = SkeletonBlock;
const styles = StyleSheet.create({ block: { borderRadius: 14 } });
