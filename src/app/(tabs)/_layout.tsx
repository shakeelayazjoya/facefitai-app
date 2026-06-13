import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function TabsLayout() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.mutedText,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontSize: 9, fontWeight: '700' },
        tabBarItemStyle: { paddingVertical: 4 },
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          minHeight: 66,
          paddingTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Face',
          tabBarIcon: ({ color, size }) => <Ionicons name="scan-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="eyes"
        options={{
          title: 'Eyes',
          tabBarIcon: ({ color, size }) => <Ionicons name="eye-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="nose"
        options={{
          title: 'Nose',
          tabBarIcon: ({ color, size }) => <Ionicons name="body-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="lips"
        options={{
          title: 'Lips',
          tabBarIcon: ({ color, size }) => <Ionicons name="happy-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="age"
        options={{
          title: 'Age',
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="symmetry"
        options={{
          title: 'Sym.',
          tabBarIcon: ({ color, size }) => <Ionicons name="analytics-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
