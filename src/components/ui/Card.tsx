import { StyleSheet, View, type ViewProps } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
export function Card({ style, ...props }: ViewProps) { const theme = useAppTheme(); return <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }, style]} {...props} />; }
const styles = StyleSheet.create({ card: { borderWidth: 1, borderRadius: 24, padding: 16, shadowOpacity: 0.08, shadowRadius: 18, elevation: 2 } });
