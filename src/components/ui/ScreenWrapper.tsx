import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { PropsWithChildren } from 'react';
export function ScreenWrapper({ children }: PropsWithChildren) { const theme = useAppTheme(); return <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>{children}</KeyboardAvoidingView></SafeAreaView>; }
const styles = StyleSheet.create({ safe: { flex: 1 }, flex: { flex: 1 } });
