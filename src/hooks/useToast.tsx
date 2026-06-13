import { Ionicons } from '@expo/vector-icons';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from './useAppTheme';

interface ToastContextValue { showToast: (message: string) => void }
const ToastContext = createContext<ToastContextValue | null>(null);
export function ToastProvider({ children }: PropsWithChildren) {
  const [message, setMessage] = useState<string | null>(null); const timeout = useRef<ReturnType<typeof setTimeout> | null>(null); const theme = useAppTheme();
  const showToast = useCallback((next: string) => { if (timeout.current) clearTimeout(timeout.current); setMessage(next); timeout.current = setTimeout(() => setMessage(null), 2600); }, []);
  const value = useMemo(() => ({ showToast }), [showToast]);
  return <ToastContext.Provider value={value}>{children}{message ? <Animated.View entering={FadeInDown.springify()} exiting={FadeOutDown.duration(160)} style={[styles.toast, { backgroundColor: theme.textStrong, boxShadow: `0 8px 24px ${theme.shadow}` }]}><Ionicons name="checkmark-circle" size={17} color={theme.success} /><Text style={[styles.text, { color: theme.background }]}>{message}</Text></Animated.View> : null}</ToastContext.Provider>;
}
export function useToast(): ToastContextValue { const context = useContext(ToastContext); if (!context) throw new Error('useToast must be used inside ToastProvider'); return context; }
const styles = StyleSheet.create({ toast: { position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: 96, minHeight: 46, paddingHorizontal: spacing.lg, borderRadius: radii.pill, zIndex: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm }, text: { fontSize: 12, fontWeight: '800', textAlign: 'center' } });
