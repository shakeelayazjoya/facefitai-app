import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import { StyleSheet, View } from 'react-native';
import { useAppTheme, useResolvedTheme } from '@/hooks/useAppTheme';
import { radii } from '@/constants/theme';

export function TabBarBackground() {
  const theme = useAppTheme(); const scheme = useResolvedTheme();
  if (process.env.EXPO_OS === 'ios' && isGlassEffectAPIAvailable()) {
    return <View pointerEvents="none" style={styles.clip}><GlassView glassEffectStyle="regular" colorScheme={scheme} tintColor={theme.surfaceGlass} style={StyleSheet.absoluteFill} /></View>;
  }
  return <View pointerEvents="none" style={[styles.clip, { backgroundColor: theme.surfaceGlass }]}><BlurView intensity={72} tint={scheme} style={StyleSheet.absoluteFill} /></View>;
}
const styles = StyleSheet.create({ clip: { position: 'absolute', inset: 0, borderRadius: radii.pill, overflow: 'hidden' } });
