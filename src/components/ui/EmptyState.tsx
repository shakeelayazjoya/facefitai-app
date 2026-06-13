import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
export function EmptyState({ title, message, icon = 'sparkles-outline' }: { title: string; message: string; icon?: keyof typeof Ionicons.glyphMap }) { const theme = useAppTheme(); return <View style={[styles.wrap, { backgroundColor: theme.surfaceGlass, borderColor: theme.border }]}><View style={[styles.icon, { backgroundColor: theme.primarySoft }]}><Ionicons name={icon} size={25} color={theme.primary} /></View><Text style={[styles.title, { color: theme.textStrong }]}>{title}</Text><Text style={[styles.message, { color: theme.mutedText }]}>{message}</Text></View>; }
const styles = StyleSheet.create({ wrap: { alignItems: 'center', padding: spacing.xxl, borderRadius: radii.xl, borderWidth: 1 }, icon: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md }, title: { fontWeight: '900', fontSize: 18, textAlign: 'center' }, message: { marginTop: spacing.sm, textAlign: 'center', lineHeight: 21, maxWidth: 420 } });
