import { KeyboardAvoidingView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren { style?: ViewStyle; padded?: boolean; centered?: boolean }
export function ScreenWrapper({ children, style, padded, centered }: Props) { const theme = useAppTheme(); return <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safe, { backgroundColor: theme.background }]}><View pointerEvents="none" style={[styles.glowTop, { backgroundColor: theme.primarySoft }]} /><View pointerEvents="none" style={[styles.glowBottom, { backgroundColor: theme.surfaceAlt }]} /><KeyboardAvoidingView behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined} style={[styles.flex, padded && styles.padded, centered && styles.centered, style]}>{children}</KeyboardAvoidingView></SafeAreaView>; }
const styles = StyleSheet.create({ safe: { flex: 1, overflow: 'hidden' }, flex: { flex: 1, zIndex: 1 }, centered: { alignItems: 'center', justifyContent: 'center' }, padded: { paddingHorizontal: 18 }, glowTop: { position: 'absolute', width: 260, height: 260, borderRadius: 130, top: -150, right: -90, opacity: 0.55 }, glowBottom: { position: 'absolute', width: 220, height: 220, borderRadius: 110, bottom: -130, left: -90, opacity: 0.5 } });
