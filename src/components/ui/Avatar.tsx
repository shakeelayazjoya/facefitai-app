import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
export function Avatar({ name, size = 54 }: { name: string; size?: number }) { const theme = useAppTheme(); const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join(''); return <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2, backgroundColor: theme.primarySoft, borderColor: theme.primary }]}><Text style={{ color: theme.primary, fontWeight: '900', fontSize: size * 0.34 }}>{initials || 'U'}</Text></View>; }
const styles = StyleSheet.create({ wrap: { borderWidth: 1, alignItems: 'center', justifyContent: 'center' } });
