import { Tabs } from 'expo-router';
import { AnimatedTabBar } from '@/navigation/AnimatedTabBar';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function TabsLayout() {
  const theme = useAppTheme();
  return <Tabs tabBar={(props) => <AnimatedTabBar {...props} />} screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true, animation: 'shift', sceneStyle: { backgroundColor: theme.background } }}>
    <Tabs.Screen name="index" options={{ title: 'Face' }} /><Tabs.Screen name="eyes" options={{ title: 'Eyes' }} /><Tabs.Screen name="nose" options={{ title: 'Nose' }} />
    <Tabs.Screen name="lips" options={{ title: 'Lips' }} /><Tabs.Screen name="age" options={{ title: 'Age' }} /><Tabs.Screen name="symmetry" options={{ title: 'Symmetry' }} />
    <Tabs.Screen name="dashboard" options={{ href: null }} /><Tabs.Screen name="profile" options={{ title: 'Profile' }} />
  </Tabs>;
}
