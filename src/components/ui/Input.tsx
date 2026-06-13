import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

interface Props extends TextInputProps { label?: string; error?: string; icon?: keyof typeof Ionicons.glyphMap }
export function Input({ label, error, icon, style, onFocus, onBlur, ...props }: Props) {
  const theme = useAppTheme(); const [focused, setFocused] = useState(false);
  return <View style={styles.wrap}>{label ? <Text style={[styles.label, { color: theme.textStrong }]}>{label}</Text> : null}<View style={[styles.shell, { backgroundColor: theme.surfaceAlt, borderColor: error ? theme.danger : focused ? theme.primary : theme.border }]}>{icon ? <Ionicons name={icon} size={19} color={focused ? theme.primary : theme.mutedText} /> : null}<TextInput placeholderTextColor={theme.mutedText} style={[styles.input, { color: theme.textStrong }, style]} onFocus={(event) => { setFocused(true); onFocus?.(event); }} onBlur={(event) => { setFocused(false); onBlur?.(event); }} {...props} /></View>{error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}</View>;
}
export const AppInput = Input;
const styles = StyleSheet.create({ wrap: { gap: spacing.xs }, label: { fontSize: 11, fontWeight: '800', paddingLeft: spacing.xs }, shell: { minHeight: 48, borderRadius: radii.lg, borderWidth: 1, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, input: { flex: 1, fontSize: 13, paddingVertical: spacing.sm }, error: { fontSize: 10, paddingLeft: spacing.xs } });
