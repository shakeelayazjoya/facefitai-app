import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

type IconName = keyof typeof Ionicons.glyphMap;
interface ButtonProps extends PressableProps { title: string; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'; loading?: boolean; icon?: IconName; style?: ViewStyle }
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({ title, variant = 'primary', size = 'md', disabled, loading, icon, style, onPress, ...props }: ButtonProps) {
  const theme = useAppTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const backgroundColor = variant === 'primary' ? theme.primary : variant === 'danger' ? theme.danger : variant === 'secondary' ? theme.surfaceAlt : 'transparent';
  const color = variant === 'primary' || variant === 'danger' ? theme.white : variant === 'secondary' ? theme.textStrong : theme.primary;
  const blocked = disabled || loading;
  return <AnimatedPressable accessibilityRole="button" disabled={blocked} onPressIn={() => { scale.value = withSpring(0.97); }} onPressOut={() => { scale.value = withSpring(1); }} onPress={(event) => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress?.(event); }} style={[styles.base, styles[size], { backgroundColor, borderColor: variant === 'primary' ? theme.primary : theme.borderStrong, opacity: blocked ? 0.52 : 1 }, animatedStyle, style]} {...props}>{loading ? <ActivityIndicator color={color} /> : <>{icon ? <Ionicons name={icon} size={size === 'sm' ? 16 : 19} color={color} /> : null}<Text style={[styles.text, size === 'sm' && styles.smallText, { color }]}>{title}</Text></>}</AnimatedPressable>;
}

export const AppButton = Button;
const styles = StyleSheet.create({ base: { borderRadius: radii.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg }, sm: { minHeight: 36, paddingHorizontal: spacing.md }, md: { minHeight: 48 }, lg: { minHeight: 54 }, text: { fontSize: 14, fontWeight: '800', letterSpacing: 0.1 }, smallText: { fontSize: 11 } });
