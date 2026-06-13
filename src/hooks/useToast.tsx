import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useAppTheme } from './useAppTheme';
interface ToastContextValue { showToast: (message: string) => void }
const ToastContext = createContext<ToastContextValue | null>(null);
export function ToastProvider({ children }: PropsWithChildren) {
  const [message, setMessage] = useState<string | null>(null);
  const theme = useAppTheme();
  const showToast = useCallback((next: string) => { setMessage(next); setTimeout(() => setMessage(null), 3200); }, []);
  const value = useMemo(() => ({ showToast }), [showToast]);
  return <ToastContext.Provider value={value}>{children}{message ? <Animated.View style={[styles.toast, { backgroundColor: theme.text }]}><Text style={[styles.text, { color: theme.background }]}>{message}</Text></Animated.View> : null}</ToastContext.Provider>;
}
export function useToast(): ToastContextValue { const context = useContext(ToastContext); if (!context) throw new Error('useToast must be used inside ToastProvider'); return context; }
const styles = StyleSheet.create({ toast: { position: 'absolute', left: 20, right: 20, bottom: 34, padding: 14, borderRadius: 16, zIndex: 999 }, text: { textAlign: 'center', fontWeight: '700' } });
