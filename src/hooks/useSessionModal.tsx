import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/Button';
import { AppCard } from '@/components/ui/Card';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

interface SessionModalContextValue { showSessionExpired: () => void }

const SessionModalContext = createContext<SessionModalContextValue | null>(null);

export function SessionModalProvider({ children }: PropsWithChildren) {
  const theme = useAppTheme();
  const [visible, setVisible] = useState(false);
  const showSessionExpired = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);
  const value = useMemo(() => ({ showSessionExpired }), [showSessionExpired]);

  return <SessionModalContext.Provider value={value}>
    {children}
    <Modal visible={visible} transparent animationType="fade" onRequestClose={hide}>
      <View style={[styles.backdrop, { backgroundColor: theme.overlay }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={hide} />
        <AppCard style={styles.card}>
          <View style={styles.copy}>
            <AppText variant="h2">Session expired</AppText>
            <AppText muted>Your login has expired. Please sign in again to continue.</AppText>
          </View>
          <AppButton title="OK" icon="log-in-outline" onPress={hide} />
        </AppCard>
      </View>
    </Modal>
  </SessionModalContext.Provider>;
}

export function useSessionModal() {
  const context = useContext(SessionModalContext);
  if (!context) throw new Error('useSessionModal must be used inside SessionModalProvider');
  return context;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  card: { width: '100%', maxWidth: 360, gap: spacing.lg, borderRadius: radii.xxl, padding: spacing.xl },
  copy: { gap: spacing.sm },
});
