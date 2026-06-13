import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
export function Input(props: TextInputProps) { const theme = useAppTheme(); return <TextInput placeholderTextColor={theme.mutedText} style={[styles.input, { backgroundColor: theme.surfaceAlt, borderColor: theme.border, color: theme.text }, props.style]} {...props} />; }
const styles = StyleSheet.create({ input: { minHeight: 48, borderRadius: 18, borderWidth: 1, paddingHorizontal: 18, paddingVertical: 12, fontSize: 15 } });
