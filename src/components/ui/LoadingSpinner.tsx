import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
export function LoadingSpinner({ label = 'Loading' }: { label?: string }) { const theme = useAppTheme(); return <View style={styles.wrap}><ActivityIndicator color={theme.primary} size="large" /><Text style={{ color: theme.mutedText }}>{label}</Text></View>; }
const styles = StyleSheet.create({ wrap: { alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 } });
