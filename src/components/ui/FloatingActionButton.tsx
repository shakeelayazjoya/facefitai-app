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
  useEffect(() => { if (active) bounce.value = withSequence(withTiming(-3, { duration: 90 }), withSpring(0, { damping: 12, stiffness: 230 })); }, [active, bounce]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: bounce.value }, { scale: scale.value * (active ? 1.03 : 1) }] }));
  return <Pressable accessibilityRole="tab" accessibilityLabel="Face scan" accessibilityState={{ selected: active }} onLongPress={onLongPress} onPress={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPress(); }} onPressIn={() => { scale.value = withSpring(0.9); }} onPressOut={() => { scale.value = withSpring(1); }} style={[styles.slot, { width }]}>
    <Animated.View style={[styles.wrap, style]}><LinearGradient colors={[theme.primary, theme.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.button, { borderColor: theme.surface, boxShadow: `0 7px 16px ${theme.shadow}` }]}><Ionicons name="scan" size={22} color={theme.white} /></LinearGradient><Text style={[styles.label, { color: active ? theme.primary : theme.textStrong }]}>Face</Text></Animated.View>
  </Pressable>;
});
const styles = StyleSheet.create({ slot: { height: 52, alignItems: 'center', justifyContent: 'flex-start' }, wrap: { alignItems: 'center', marginTop: -12 }, button: { width: 46, height: 46, borderRadius: 23, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }, label: { marginTop: -2, fontSize: 8, lineHeight: 10, fontWeight: '900' } });
