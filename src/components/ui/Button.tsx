import { Pressable, StyleSheet, Text, type PressableProps, type ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
interface ButtonProps extends PressableProps { title: string; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md'; style?: ViewStyle }
export function Button({ title, variant = 'primary', size = 'md', disabled, style, ...props }: ButtonProps) {
  const theme = useAppTheme();
  const backgroundColor = variant === 'primary' ? theme.primary : variant === 'danger' ? theme.danger : variant === 'secondary' ? theme.surfaceAlt : 'transparent';
  const color = variant === 'primary' || variant === 'danger' ? theme.white : theme.text;
  return <Pressable disabled={disabled} android_ripple={{ color: theme.primarySoft }} style={({ pressed }) => [styles.base, size === 'sm' && styles.small, { backgroundColor, borderColor: theme.border, opacity: disabled ? 0.55 : pressed ? 0.82 : 1 }, style]} {...props}><Text style={[styles.text, size === 'sm' && styles.smallText, { color }]}>{title}</Text></Pressable>;
}
const styles = StyleSheet.create({ base: { minHeight: 48, borderRadius: 999, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 }, small: { minHeight: 36, paddingHorizontal: 12 }, text: { fontSize: 14, fontWeight: '800', letterSpacing: 0.4, textTransform: 'capitalize' }, smallText: { fontSize: 12 } });
