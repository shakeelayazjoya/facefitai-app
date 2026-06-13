import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { radii } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

interface Props { active: boolean; width: number; onPress: () => void; onLongPress: () => void }
export const FloatingActionButton = memo(function FloatingActionButton({ active, width, onPress, onLongPress }: Props) {
  const theme = useAppTheme(); const scale = useSharedValue(1); const bounce = useSharedValue(0);
  useEffect(() => { if (active) bounce.value = withSequence(withTiming(-5, { duration: 100 }), withSpring(0, { damping: 12, stiffness: 220 })); }, [active, bounce]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: bounce.value }, { scale: scale.value * (active ? 1.06 : 1) }] }));
  return <Pressable accessibilityRole="tab" accessibilityLabel="Face scan" accessibilityState={{ selected: active }} onLongPress={onLongPress} onPress={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPress(); }} onPressIn={() => { scale.value = withSpring(0.9); }} onPressOut={() => { scale.value = withSpring(1); }} style={[styles.slot, { width }]}>
    <Animated.View style={[styles.wrap, style]}><LinearGradient colors={[theme.primary, theme.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.button, { borderColor: theme.surface, boxShadow: `0 9px 22px ${theme.shadow}` }]}><Ionicons name="scan" size={25} color={theme.white} /></LinearGradient><View style={[styles.labelPill, { backgroundColor: theme.surface }]}><Text style={[styles.label, { color: active ? theme.primary : theme.textStrong }]}>Face</Text></View></Animated.View>
  </Pressable>;
});
const styles = StyleSheet.create({ slot: { height: 68, alignItems: 'center', justifyContent: 'flex-start' }, wrap: { alignItems: 'center', marginTop: -18 }, button: { width: 54, height: 54, borderRadius: 27, borderWidth: 4, alignItems: 'center', justifyContent: 'center' }, labelPill: { marginTop: -4, borderRadius: radii.pill, paddingHorizontal: 7, paddingVertical: 2 }, label: { fontSize: 9, lineHeight: 11, fontWeight: '900' } });
