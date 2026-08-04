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
  { route: 'lips', label: 'Lips', icon: 'happy-outline', activeIcon: 'happy' }, { route: 'emotion', label: 'Emotion', icon: 'sparkles-outline', activeIcon: 'sparkles' }, { route: 'index', label: 'Face', icon: 'scan-outline', activeIcon: 'scan', center: true },
  { route: 'age', label: 'Age', icon: 'time-outline', activeIcon: 'time' }, { route: 'symmetry', label: 'Symmetry', icon: 'analytics-outline', activeIcon: 'analytics' },
  { route: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
] as const;

// The centre action is laid out as its own fixed-width slot between two equal-width
// groups, so it stays exactly centred no matter how many tabs sit on either side.
// (Rendering every tab in one flat row only centres it when the count is odd — adding
// the Emotion tab made it 8 and pushed Face half a slot to the right.)
const CENTER_SLOT_WIDTH = 64;

export function AnimatedTabBar({ state, navigation, insets }: BottomTabBarProps) {
  const theme = useAppTheme(); const { width } = useWindowDimensions(); const barWidth = Math.min(width - 24, 600); const innerWidth = barWidth - 10;
  const centerIndex = tabs.findIndex((tab) => 'center' in tab && tab.center);
  const leftTabs = centerIndex === -1 ? tabs : tabs.slice(0, centerIndex);
  const rightTabs = centerIndex === -1 ? [] : tabs.slice(centerIndex + 1);
  const centerTab = centerIndex === -1 ? undefined : tabs[centerIndex];
  const sideWidth = Math.max(0, (innerWidth - (centerTab ? CENTER_SLOT_WIDTH : 0)) / 2);
  // Size every slot off the busier side and centre each group, so icon spacing stays
  // uniform across the whole bar instead of the 4-vs-3 split rendering two densities.
  const itemWidth = sideWidth / Math.max(leftTabs.length, rightTabs.length, 1);
  const activeRoute = state.routes[state.index]?.name;
  const routeMap = useMemo(() => new Map(state.routes.map((route) => [route.name, route])), [state.routes]);
  const handlers = (routeName: string) => { const route = routeMap.get(routeName); if (!route) return { onPress: () => undefined, onLongPress: () => undefined }; return { onPress: () => { const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true }); if (!event.defaultPrevented && activeRoute !== routeName) navigation.navigate(route.name, route.params); }, onLongPress: () => navigation.emit({ type: 'tabLongPress', target: route.key }) }; };
  return <View pointerEvents="box-none" style={[styles.outer, { height: 62 + insets.bottom, paddingBottom: Math.max(insets.bottom, 7), backgroundColor: theme.background }]}><View style={[styles.bar, { width: barWidth, borderColor: theme.border, boxShadow: `0 8px 22px ${theme.shadow}` }]}> 
    <TabBarBackground />
    <View style={styles.row}>
      <View style={[styles.group, { width: sideWidth }]}>{leftTabs.map((tab) => <TabBarItem key={tab.route} active={tab.route === activeRoute} label={tab.label} icon={tab.icon} activeIcon={tab.activeIcon} width={itemWidth} {...handlers(tab.route)} />)}</View>
      {centerTab ? <FloatingActionButton key={centerTab.route} active={centerTab.route === activeRoute} width={CENTER_SLOT_WIDTH} {...handlers(centerTab.route)} /> : null}
      <View style={[styles.group, { width: sideWidth }]}>{rightTabs.map((tab) => <TabBarItem key={tab.route} active={tab.route === activeRoute} label={tab.label} icon={tab.icon} activeIcon={tab.activeIcon} width={itemWidth} {...handlers(tab.route)} />)}</View>
    </View>
  </View></View>;
}
const styles = StyleSheet.create({ outer: { alignItems: 'center', justifyContent: 'flex-start', paddingTop: 5 }, bar: { height: 50, borderRadius: radii.pill, borderCurve: 'continuous', borderWidth: 1, overflow: 'visible' }, row: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 }, group: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' } });
