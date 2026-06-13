import { useMutation } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { strings } from '@/constants/strings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useToast } from '@/hooks/useToast';
import { analytics } from '@/services/analytics';
import type { ApiError } from '@/services/apiClient';
import { facefitApi } from '@/services/facefitApi';
import { useAuthStore } from '@/store/authStore';
import type { AuthResponse } from '@/types/api';
import { validateEmail, validateName, validatePassword } from '@/utils/validation';

type Mode = 'login' | 'signup' | 'forgot';

type AuthMutationResult = AuthResponse | { message: string };

function hasSession(data: AuthMutationResult): data is AuthResponse {
  return 'access_token' in data;
}

export function AuthScreen({ mode }: { mode: Mode }) {
  const theme = useAppTheme();
  const { showToast } = useToast();
  const setSession = useAuthStore((state) => state.setSession);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation<AuthMutationResult, ApiError>({
    mutationFn: () => {
      const emailCheck = validateEmail(email);
      if (!emailCheck.isValid) throw { message: emailCheck.message ?? strings.genericError } satisfies ApiError;

      if (mode === 'forgot') return facefitApi.forgotPassword(email.trim());

      const passwordCheck = validatePassword(password);
      if (!passwordCheck.isValid) throw { message: passwordCheck.message ?? strings.genericError } satisfies ApiError;

      if (mode === 'signup') {
        const nameCheck = validateName(name);
        if (!nameCheck.isValid) throw { message: nameCheck.message ?? strings.genericError } satisfies ApiError;
        return facefitApi.register({ name: name.trim(), email: email.trim(), password });
      }

      return facefitApi.login({ email: email.trim(), password });
    },
    onSuccess: async (data) => {
      if (hasSession(data)) {
        await setSession(data);
        analytics.track(mode === 'signup' ? 'signup_success' : 'login_success', { user_id: data.user.id });
        router.replace('/(tabs)');
        return;
      }
      showToast(data.message);
      router.replace('/(auth)/login');
    },
    onError: (error) => showToast(error.message),
  });

  const title = mode === 'login' ? strings.loginTitle : mode === 'signup' ? strings.signupTitle : strings.forgotTitle;

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.center}>
        <Card style={styles.card}>
          <Text style={[styles.logo, { color: theme.primary }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: theme.mutedText }]}>
            {mode === 'forgot' ? strings.forgotSubtitle : strings.authSubtitle}
          </Text>
          <View style={styles.form}>
            {mode === 'signup' ? <Input placeholder={strings.namePlaceholder} value={name} onChangeText={setName} /> : null}
            <Input autoCapitalize="none" keyboardType="email-address" placeholder={strings.emailPlaceholder} value={email} onChangeText={setEmail} />
            {mode !== 'forgot' ? <Input secureTextEntry placeholder={strings.passwordPlaceholder} value={password} onChangeText={setPassword} /> : null}
            <Button disabled={mutation.isPending} title={mode === 'login' ? strings.loginAction : mode === 'signup' ? strings.signupAction : strings.forgotAction} onPress={() => mutation.mutate()} />
          </View>
          {mode === 'login' ? (
            <Link href="/(auth)/forgot" asChild>
              <Text style={StyleSheet.flatten([styles.link, { color: theme.primary }])}>{strings.forgotLink}</Text>
            </Link>
          ) : null}
          <Link href={mode === 'login' ? '/(auth)/signup' : '/(auth)/login'} asChild>
            <Text style={StyleSheet.flatten([styles.link, { color: theme.primary }])}>{mode === 'login' ? strings.signupLink : strings.loginLink}</Text>
          </Link>
        </Card>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', padding: 18 },
  card: { padding: 24 },
  logo: { fontSize: 36, fontWeight: '900' },
  subtitle: { marginTop: 8, marginBottom: 24, lineHeight: 22 },
  form: { gap: 12 },
  link: { textAlign: 'center', marginTop: 16, fontWeight: '800' },
});
