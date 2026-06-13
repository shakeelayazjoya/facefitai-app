import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/Button';
import { AppCard } from '@/components/ui/Card';
import { AppInput } from '@/components/ui/Input';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { radii, spacing } from '@/constants/theme';
import { strings } from '@/constants/strings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useToast } from '@/hooks/useToast';
import { analytics } from '@/services/analytics';
import type { ApiError } from '@/services/apiClient';
import { facefitApi } from '@/services/facefitApi';
import { useAuthStore } from '@/store/authStore';
import type { AuthResponse } from '@/types/api';
import { useResponsive } from '@/utils/responsive';
import { validateEmail, validateName, validatePassword } from '@/utils/validation';

type Mode = 'login' | 'signup' | 'forgot';
type Result = AuthResponse | { message: string };
const hasSession = (data: Result): data is AuthResponse => 'access_token' in data;

export function AuthScreen({ mode }: { mode: Mode }) {
  const theme = useAppTheme(); const responsive = useResponsive(); const { showToast } = useToast(); const setSession = useAuthStore((state) => state.setSession);
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const title = mode === 'login' ? strings.loginTitle : mode === 'signup' ? strings.signupTitle : strings.forgotTitle;
  const action = mode === 'login' ? strings.loginAction : mode === 'signup' ? strings.signupAction : strings.forgotAction;
  const mutation = useMutation<Result, ApiError>({ mutationFn: () => {
    const emailCheck = validateEmail(email); if (!emailCheck.isValid) throw { message: emailCheck.message ?? strings.genericError } satisfies ApiError;
    if (mode === 'forgot') return facefitApi.forgotPassword(email.trim());
    const passwordCheck = validatePassword(password); if (!passwordCheck.isValid) throw { message: passwordCheck.message ?? strings.genericError } satisfies ApiError;
    if (mode === 'signup') { const nameCheck = validateName(name); if (!nameCheck.isValid) throw { message: nameCheck.message ?? strings.genericError } satisfies ApiError; return facefitApi.register({ name: name.trim(), email: email.trim(), password }); }
    return facefitApi.login({ email: email.trim(), password });
  }, onSuccess: async (data) => { if (hasSession(data)) { await setSession(data); analytics.track(mode === 'signup' ? 'signup_success' : 'login_success'); router.replace('/(tabs)'); } else { showToast(data.message); router.replace('/(auth)/login'); } }, onError: (error) => showToast(error.message) });
  return <ScreenWrapper><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.screen}>
    <View style={[styles.content, { maxWidth: responsive.contentWidth }]}> 
      <View style={styles.top}><View style={[styles.brandIcon, { backgroundColor: theme.primary }]}><Ionicons name="scan" color={theme.white} size={25} /></View><ThemeToggle /></View>
      <Animated.View entering={FadeInDown.springify()} style={styles.heading}><AppText variant="h1" editorial weight="black">{title}</AppText><AppText muted>{mode === 'forgot' ? strings.forgotSubtitle : strings.authSubtitle}</AppText></Animated.View>
      <AppCard style={styles.card}><View style={styles.form}>
        {mode === 'signup' ? <AppInput label="Full name" icon="person-outline" placeholder={strings.namePlaceholder} value={name} onChangeText={setName} /> : null}
        <AppInput label="Email" icon="mail-outline" autoCapitalize="none" keyboardType="email-address" placeholder={strings.emailPlaceholder} value={email} onChangeText={setEmail} />
        {mode !== 'forgot' ? <AppInput label="Password" icon="lock-closed-outline" secureTextEntry placeholder={strings.passwordPlaceholder} value={password} onChangeText={setPassword} /> : null}
        <AppButton loading={mutation.isPending} title={action} icon="arrow-forward-outline" onPress={() => mutation.mutate()} />
      </View></AppCard>
      <View style={styles.links}>{mode === 'login' ? <Link href="/(auth)/forgot" style={[styles.link, { color: theme.primary }]}>{strings.forgotLink}</Link> : null}<Link href={mode === 'login' ? '/(auth)/signup' : '/(auth)/login'} style={[styles.link, { color: theme.primary }]}>{mode === 'login' ? strings.signupLink : strings.loginLink}</Link></View>
      <View style={[styles.trust, { borderColor: theme.border }]}><Ionicons name="shield-checkmark-outline" color={theme.success} size={16} /><AppText variant="small" muted>Private by design.</AppText></View>
    </View>
  </ScrollView></ScreenWrapper>;
}

const styles = StyleSheet.create({ screen: { flexGrow: 1, justifyContent: 'center', padding: spacing.md }, content: { width: '100%', alignSelf: 'center', gap: spacing.lg }, top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, brandIcon: { width: 44, height: 44, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center' }, heading: { gap: spacing.xs }, card: { padding: spacing.lg }, form: { gap: spacing.md }, links: { gap: spacing.sm, alignItems: 'center' }, link: { fontSize: 12, fontWeight: '800' }, trust: { borderTopWidth: 1, paddingTop: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm } });
