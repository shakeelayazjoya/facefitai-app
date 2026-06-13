import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
interface Props { label: string; tone?: 'primary' | 'danger' | 'warning' | 'neutral'; style?: ViewStyle }
export function Badge({ label, tone = 'neutral', style }: Props) { const theme = useAppTheme(); const color = tone === 'danger' ? theme.danger : tone === 'warning' ? theme.gold : tone === 'primary' ? theme.gold : theme.mutedText; const backgroundColor = tone === 'danger' ? theme.dangerSoft : tone === 'warning' ? theme.goldSoft : tone === 'primary' ? theme.primarySoft : theme.surfaceAlt; return <View style={[styles.wrap, { borderColor: theme.borderStrong, backgroundColor }, style]}><Text style={[styles.text, { color }]}>{label}</Text></View>; }
export const AppBadge = Badge;
const styles = StyleSheet.create({ wrap: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: 4 }, text: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' } });
