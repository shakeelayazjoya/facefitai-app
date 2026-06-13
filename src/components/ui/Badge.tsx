import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
interface Props { label: string; tone?: 'primary' | 'danger' | 'warning' | 'neutral'; style?: ViewStyle }
export function Badge({ label, tone = 'neutral', style }: Props) { const theme = useAppTheme(); const color = tone === 'danger' ? theme.danger : tone === 'warning' ? theme.warning : tone === 'primary' ? theme.primary : theme.mutedText; return <View style={[styles.wrap, { borderColor: color, backgroundColor: theme.surfaceAlt }, style]}><Text style={[styles.text, { color }]}>{label}</Text></View>; }
const styles = StyleSheet.create({ wrap: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }, text: { fontSize: 12, fontWeight: '900', textTransform: 'uppercase' } });
