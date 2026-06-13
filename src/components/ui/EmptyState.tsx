import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
export function EmptyState({ title, message }: { title: string; message: string }) { const theme = useAppTheme(); return <View style={styles.wrap}><Text style={[styles.title, { color: theme.text }]}>{title}</Text><Text style={[styles.message, { color: theme.mutedText }]}>{message}</Text></View>; }
const styles = StyleSheet.create({ wrap: { alignItems: 'center', padding: 24 }, title: { fontWeight: '900', fontSize: 18 }, message: { marginTop: 8, textAlign: 'center', lineHeight: 20 } });
