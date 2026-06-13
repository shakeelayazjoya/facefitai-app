import { KeyboardAvoidingView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { PropsWithChildren } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

interface Props extends PropsWithChildren { style?: ViewStyle; padded?: boolean; centered?: boolean }
export function ScreenWrapper({ children, style, padded, centered }: Props) { const theme = useAppTheme(); return <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safe, { backgroundColor: theme.background }]}><LinearGradient pointerEvents="none" colors={[theme.gradientStart, theme.gradientEnd]} style={StyleSheet.absoluteFill} /><View pointerEvents="none" style={[styles.glowTop, { backgroundColor: theme.glow }]} /><View pointerEvents="none" style={[styles.glowBottom, { backgroundColor: theme.glow }]} /><KeyboardAvoidingView behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined} style={[styles.flex, padded && styles.padded, centered && styles.centered, style]}>{children}</KeyboardAvoidingView></SafeAreaView>; }
const styles = StyleSheet.create({ safe: { flex: 1, overflow: 'hidden' }, flex: { flex: 1, zIndex: 1 }, centered: { alignItems: 'center', justifyContent: 'center' }, padded: { paddingHorizontal: 18 }, glowTop: { position: 'absolute', width: 320, height: 320, borderRadius: 160, top: -170, right: -120 }, glowBottom: { position: 'absolute', width: 280, height: 280, borderRadius: 140, bottom: -170, left: -120 } });
