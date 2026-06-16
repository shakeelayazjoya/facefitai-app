import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
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
  const theme = useAppTheme(); const { width } = useWindowDimensions(); const barWidth = Math.min(width - 24, 600); const innerWidth = barWidth - 10; const itemWidth = innerWidth / tabs.length;
  const activeRoute = state.routes[state.index]?.name;
  const routeMap = useMemo(() => new Map(state.routes.map((route) => [route.name, route])), [state.routes]);
  const handlers = (routeName: string) => { const route = routeMap.get(routeName); if (!route) return { onPress: () => undefined, onLongPress: () => undefined }; return { onPress: () => { const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true }); if (!event.defaultPrevented && activeRoute !== routeName) navigation.navigate(route.name, route.params); }, onLongPress: () => navigation.emit({ type: 'tabLongPress', target: route.key }) }; };
  return <View pointerEvents="box-none" style={[styles.outer, { height: 62 + insets.bottom, paddingBottom: Math.max(insets.bottom, 7), backgroundColor: theme.background }]}><View style={[styles.bar, { width: barWidth, borderColor: theme.border, boxShadow: `0 8px 22px ${theme.shadow}` }]}> 
    <TabBarBackground />
    <View style={styles.row}>{tabs.map((tab) => { const active = tab.route === activeRoute; const actions = handlers(tab.route); return 'center' in tab && tab.center ? <FloatingActionButton key={tab.route} active={active} width={itemWidth} {...actions} /> : <TabBarItem key={tab.route} active={active} label={tab.label} icon={tab.icon} activeIcon={tab.activeIcon} width={itemWidth} {...actions} />; })}</View>
  </View></View>;
}
const styles = StyleSheet.create({ outer: { alignItems: 'center', justifyContent: 'flex-start', paddingTop: 5 }, bar: { height: 50, borderRadius: radii.pill, borderCurve: 'continuous', borderWidth: 1, overflow: 'visible' }, row: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 } });
