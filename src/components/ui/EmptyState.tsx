import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
export function EmptyState({ title, message, icon = 'sparkles-outline' }: { title: string; message: string; icon?: keyof typeof Ionicons.glyphMap }) { const theme = useAppTheme(); return <Animated.View entering={FadeInUp.springify()} style={[styles.wrap, { backgroundColor: theme.surfaceGlass, borderColor: theme.border }]}><View style={[styles.icon, { backgroundColor: theme.primarySoft }]}><Ionicons name={icon} size={22} color={theme.primary} /></View><Text style={[styles.title, { color: theme.textStrong }]}>{title}</Text><Text style={[styles.message, { color: theme.mutedText }]}>{message}</Text></Animated.View>; }
const styles = StyleSheet.create({ wrap: { alignItems: 'center', padding: spacing.xl, borderRadius: radii.xl, borderWidth: 1 }, icon: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm }, title: { fontWeight: '900', fontSize: 15, textAlign: 'center' }, message: { marginTop: spacing.xs, textAlign: 'center', lineHeight: 18, fontSize: 12, maxWidth: 360 } });
