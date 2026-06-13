import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet } from 'react-native';
import { useAppTheme, useResolvedTheme } from '@/hooks/useAppTheme';
import { useThemeStore } from '@/store/themeStore';
export function ThemeToggle() { const theme = useAppTheme(); const resolved = useResolvedTheme(); const setMode = useThemeStore((state) => state.setMode); return <Pressable accessibilityLabel="Toggle theme" onPress={() => { void Haptics.selectionAsync(); void setMode(resolved === 'dark' ? 'light' : 'dark'); }} style={[styles.button, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}><Ionicons name={resolved === 'dark' ? 'sunny' : 'moon'} size={20} color={theme.primary} /></Pressable>; }
const styles = StyleSheet.create({ button: { width: 44, height: 44, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' } });
