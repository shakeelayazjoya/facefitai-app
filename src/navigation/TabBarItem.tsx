import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { radii } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

type IconName = keyof typeof Ionicons.glyphMap;
interface Props { active: boolean; label: string; icon: IconName; activeIcon: IconName; width: number; onPress: () => void; onLongPress: () => void }

export const TabBarItem = memo(function TabBarItem({ active, label, icon, activeIcon, width, onPress, onLongPress }: Props) {
  const theme = useAppTheme(); const progress = useSharedValue(active ? 1 : 0); const pressed = useSharedValue(1); const bounce = useSharedValue(0);
  useEffect(() => { progress.value = withSpring(active ? 1 : 0, { damping: 17, stiffness: 240 }); if (active) bounce.value = withSequence(withTiming(-3, { duration: 90 }), withSpring(0, { damping: 11, stiffness: 240 })); }, [active, bounce, progress]);
  const contentStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bounce.value }, { scale: pressed.value * (1 + progress.value * 0.12) }] }));
  const inactiveStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));
  const activeStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const labelStyle = useAnimatedStyle(() => ({ opacity: progress.value, transform: [{ translateY: interpolate(progress.value, [0, 1], [3, 0]) }], maxHeight: interpolate(progress.value, [0, 1], [0, 12]) }));
  return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} android_ripple={{ color: theme.primarySoft, borderless: true }} onLongPress={onLongPress} onPress={() => { void Haptics.selectionAsync(); onPress(); }} onPressIn={() => { pressed.value = withSpring(0.88); }} onPressOut={() => { pressed.value = withSpring(1); }} style={[styles.pressable, { width }]}>
    <Animated.View style={[styles.content, contentStyle]}><View style={styles.iconStack}><Animated.View style={[styles.icon, inactiveStyle]}><Ionicons name={icon} color={theme.mutedText} size={20} /></Animated.View><Animated.View style={[styles.icon, styles.absolute, activeStyle]}><Ionicons name={activeIcon} color={theme.primary} size={20} /></Animated.View></View><Animated.View style={labelStyle}><Text numberOfLines={1} style={[styles.label, { color: theme.primary }]}>{label}</Text></Animated.View></Animated.View>
  </Pressable>;
});

const styles = StyleSheet.create({ pressable: { height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, overflow: 'hidden' }, content: { alignItems: 'center', justifyContent: 'center', gap: 1 }, iconStack: { width: 24, height: 23, alignItems: 'center', justifyContent: 'center' }, icon: { alignItems: 'center', justifyContent: 'center' }, absolute: { position: 'absolute' }, label: { fontSize: 9, lineHeight: 11, fontWeight: '900', letterSpacing: 0.1, textAlign: 'center' } });
