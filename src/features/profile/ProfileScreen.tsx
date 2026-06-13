import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { AppBadge } from '@/components/ui/Badge';
import { AppButton } from '@/components/ui/Button';
import { AppCard } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListRow } from '@/components/ui/ListRow';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/authStore';
import { useResponsive } from '@/utils/responsive';

export function ProfileScreen() {
  const theme = useAppTheme(); const responsive = useResponsive(); const user = useAuthStore((s) => s.user); const logout = useAuthStore((s) => s.logout);
  if (!user) return <ScreenWrapper><View style={styles.guest}><EmptyState icon="person-outline" title="Your profile" message="Sign in to save scans." /><AppButton title="Sign in" onPress={() => router.push('/(auth)/login')} /></View></ScreenWrapper>;
  return <ScreenWrapper><ScrollView contentContainerStyle={styles.screen}><View style={[styles.content, { maxWidth: responsive.contentWidth }]}> 
    <View style={styles.titleRow}><View><AppText variant="h1">Profile</AppText><AppText muted>Your account.</AppText></View><ThemeToggle /></View>
    <AppCard style={styles.hero}><Avatar name={user.name} size={72} /><View style={styles.identity}><AppText variant="h2">{user.name}</AppText><AppText muted>{user.email}</AppText><View style={styles.badges}><AppBadge tone="primary" label={user.plan} /><AppBadge label={user.role} /></View></View></AppCard>
    <View style={styles.stats}><View style={[styles.stat, { backgroundColor: theme.primarySoft }]}><Ionicons name="shield-checkmark-outline" color={theme.primary} size={23} /><AppText variant="small" weight="bold">Private scans</AppText></View><View style={[styles.stat, { backgroundColor: theme.surfaceAlt }]}><Ionicons name="sparkles-outline" color={theme.accent} size={23} /><AppText variant="small" weight="bold">AI guidance</AppText></View></View>
    <AppCard><AppText variant="h3" style={styles.section}>Library</AppText><ListRow title="History" subtitle="Scans and favorites" onPress={() => router.push('/(tabs)/dashboard')} /><ListRow title="Style studio" subtitle="Try a new look" onPress={() => router.push('/style-edit')} /><ListRow title="Image check" subtitle="Find possible reuse" onPress={() => router.push('/privacy-reuse')} /></AppCard>
    <AppCard><AppText variant="h3" style={styles.section}>More</AppText><ListRow title="FAQs" onPress={() => router.push('/faqs')} /><ListRow title="Support" onPress={() => router.push('/contact')} /><ListRow title="Privacy" onPress={() => router.push('/privacy')} /><ListRow title="About" onPress={() => router.push('/about')} /></AppCard>
    {user.role === 'admin' ? <AppButton title="Open admin tools" variant="secondary" icon="settings-outline" onPress={() => router.push('/admin')} /> : null}
    <AppButton title="Log out" variant="ghost" icon="log-out-outline" onPress={() => void logout().then(() => router.replace('/(auth)/login'))} />
  </View></ScrollView></ScreenWrapper>;
}
const styles = StyleSheet.create({ screen: { padding: spacing.lg, paddingBottom: 44 }, content: { width: '100%', alignSelf: 'center', gap: spacing.lg }, titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, hero: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, padding: spacing.xl }, identity: { flex: 1 }, badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }, stats: { flexDirection: 'row', gap: spacing.md }, stat: { flex: 1, minHeight: 96, borderRadius: radii.xl, padding: spacing.lg, justifyContent: 'space-between' }, section: { marginBottom: spacing.sm }, guest: { flex: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing.lg } });
