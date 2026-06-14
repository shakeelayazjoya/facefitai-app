import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { radii } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { TabBarBackground } from './TabBarBackground';
import { TabBarItem } from './TabBarItem';

const tabs = [
  { route: 'eyes', label: 'Eyes', icon: 'eye-outline', activeIcon: 'eye' }, { route: 'nose', label: 'Nose', icon: 'body-outline', activeIcon: 'body' },
  { route: 'lips', label: 'Lips', icon: 'happy-outline', activeIcon: 'happy' }, { route: 'index', label: 'Face', icon: 'scan-outline', activeIcon: 'scan', center: true },
  { route: 'age', label: 'Age', icon: 'time-outline', activeIcon: 'time' }, { route: 'symmetry', label: 'Symmetry', icon: 'analytics-outline', activeIcon: 'analytics' },
  { route: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
] as const;

export function AnimatedTabBar({ state, navigation, insets }: BottomTabBarProps) {
  const theme = useAppTheme(); const { width } = useWindowDimensions(); const barWidth = Math.min(width - 20, 620); const innerWidth = barWidth - 12; const itemWidth = innerWidth / tabs.length;
  const activeRoute = state.routes[state.index]?.name; const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.route === activeRoute)); const position = useSharedValue(activeIndex * itemWidth);
  useEffect(() => { position.value = withSpring(activeIndex * itemWidth, { damping: 20, stiffness: 230, mass: 0.72 }); }, [activeIndex, itemWidth, position]);
  const indicatorStyle = useAnimatedStyle(() => ({ transform: [{ translateX: position.value }] }));
  const routeMap = useMemo(() => new Map(state.routes.map((route) => [route.name, route])), [state.routes]);
  const handlers = (routeName: string) => { const route = routeMap.get(routeName); if (!route) return { onPress: () => undefined, onLongPress: () => undefined }; return { onPress: () => { const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true }); if (!event.defaultPrevented && activeRoute !== routeName) navigation.navigate(route.name, route.params); }, onLongPress: () => navigation.emit({ type: 'tabLongPress', target: route.key }) }; };
  return <View pointerEvents="box-none" style={[styles.outer, { height: 76 + insets.bottom, paddingBottom: Math.max(insets.bottom, 8), backgroundColor: theme.background }]}><View style={[styles.bar, { width: barWidth, borderColor: theme.borderStrong, boxShadow: `0 12px 36px ${theme.shadow}` }]}>
    <TabBarBackground /><Animated.View pointerEvents="none" style={[styles.indicator, { width: itemWidth - 5, backgroundColor: theme.primarySoft, borderColor: theme.border }, indicatorStyle]} />
    <View style={styles.row}>{tabs.map((tab) => { const active = tab.route === activeRoute; const actions = handlers(tab.route); return 'center' in tab && tab.center ? <FloatingActionButton key={tab.route} active={active} width={itemWidth} {...actions} /> : <TabBarItem key={tab.route} active={active} label={tab.label} icon={tab.icon} activeIcon={tab.activeIcon} width={itemWidth} {...actions} />; })}</View>
  </View></View>;
}
const styles = StyleSheet.create({ outer: { alignItems: 'center', justifyContent: 'flex-start', paddingTop: 8 }, bar: { height: 62, borderRadius: radii.pill, borderCurve: 'continuous', borderWidth: 1, overflow: 'visible' }, row: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6 }, indicator: { position: 'absolute', left: 6, top: 5, height: 52, borderRadius: radii.pill, borderWidth: 1 } });
