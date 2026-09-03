import { KeyboardAvoidingView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { BottomTabBarHeightContext } from 'expo-router/build/react-navigation/bottom-tabs';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useContext, type PropsWithChildren } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

// Edge-to-edge (RN 0.85 enables it in core) extends the window behind the system
// navigation bar, so the bottom inset has to be consumed by exactly one thing.
// Inside the tab navigator that is AnimatedTabBar (height: 62 + insets.bottom), so
// adding a bottom edge here would double-pad every tab screen. Screens outside the
// navigator have nothing else to clear the nav bar and must take the inset
// themselves. DetectorScreen renders in both places, which is why this is resolved
// at runtime rather than passed in per screen.
const EDGES_WITH_BOTTOM: readonly Edge[] = ['top', 'left', 'right', 'bottom'];
const EDGES_ABOVE_TAB_BAR: readonly Edge[] = ['top', 'left', 'right'];

interface Props extends PropsWithChildren { style?: ViewStyle; padded?: boolean; centered?: boolean; edges?: readonly Edge[] }
export function ScreenWrapper({ children, style, padded, centered, edges }: Props) {
  const theme = useAppTheme();
  const tabBarHeight = useContext(BottomTabBarHeightContext);
  const resolvedEdges = edges ?? (tabBarHeight == null ? EDGES_WITH_BOTTOM : EDGES_ABOVE_TAB_BAR);
  return (
    <SafeAreaView edges={resolvedEdges} style={[styles.safe, { backgroundColor: theme.background }]}>
      <LinearGradient pointerEvents="none" colors={[theme.gradientStart, theme.gradientEnd]} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[styles.glowTop, { backgroundColor: 'rgba(124, 58, 237, 0.07)' }]} />
      <View pointerEvents="none" style={[styles.glowBottom, { backgroundColor: 'rgba(16, 185, 129, 0.05)' }]} />
      <KeyboardAvoidingView behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined} style={[styles.flex, padded && styles.padded, centered && styles.centered, style]}>
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ safe: { flex: 1, overflow: 'hidden' }, flex: { flex: 1, zIndex: 1 }, centered: { alignItems: 'center', justifyContent: 'center' }, padded: { paddingHorizontal: 18 }, glowTop: { position: 'absolute', width: 340, height: 340, borderRadius: 170, top: -140, right: -100, opacity: 0.8 }, glowBottom: { position: 'absolute', width: 300, height: 300, borderRadius: 150, bottom: -140, left: -100, opacity: 0.8 } });
