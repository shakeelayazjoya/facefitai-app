import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
export function GradientHeader({ eyebrow, title, description, icon = 'sparkles' }: { eyebrow?: string; title: string; description?: string; icon?: keyof typeof Ionicons.glyphMap }) { const theme = useAppTheme(); return <View style={[styles.wrap, { backgroundColor: theme.primarySoft, borderColor: theme.borderStrong }]}><View style={[styles.icon, { backgroundColor: theme.primary }]}><Ionicons name={icon} size={24} color={theme.white} /></View><View style={styles.copy}>{eyebrow ? <AppText variant="caption" style={{ color: theme.primary, textTransform: 'uppercase', letterSpacing: 1.4 }}>{eyebrow}</AppText> : null}<AppText variant="h1">{title}</AppText>{description ? <AppText muted>{description}</AppText> : null}</View></View>; }
const styles = StyleSheet.create({ wrap: { borderRadius: radii.xxl, borderCurve: 'continuous', borderWidth: 1, padding: spacing.lg, gap: spacing.md, flexDirection: 'row', alignItems: 'flex-start' }, icon: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, copy: { flex: 1, gap: spacing.xs } });
