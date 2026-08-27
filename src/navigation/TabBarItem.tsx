import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { radii } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

type IconName = keyof typeof Ionicons.glyphMap;
interface Props {
  active: boolean;
  label: string;
  icon: IconName;
  activeIcon: IconName;
  width: number;
  onPress: () => void;
  onLongPress: () => void;
}

export const TabBarItem = memo(function TabBarItem({
  active,
  label,
  icon,
  activeIcon,
  width,
  onPress,
  onLongPress,
}: Props) {
  const theme = useAppTheme();
  const progress = useSharedValue(active ? 1 : 0);
  const pressed = useSharedValue(1);
  const bounce = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(active ? 1 : 0, { damping: 18, stiffness: 250 });
    if (active) {
      bounce.value = withSequence(withTiming(-2, { duration: 80 }), withSpring(0, { damping: 12, stiffness: 250 }));
    }
  }, [active, bounce, progress]);

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }, { scale: pressed.value * (1 + progress.value * 0.05) }],
  }));

  const inactiveStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));
  const activeStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      android_ripple={{ color: theme.primarySoft, borderless: true }}
      onLongPress={onLongPress}
      onPress={() => {
        void Haptics.selectionAsync();
        onPress();
      }}
      onPressIn={() => {
        pressed.value = withSpring(0.88);
      }}
      onPressOut={() => {
        pressed.value = withSpring(1);
      }}
      style={[styles.pressable, { width }]}
    >
      <Animated.View style={[styles.content, contentStyle]}>
        <View style={styles.iconStack}>
          <Animated.View style={[styles.icon, inactiveStyle]}>
            <Ionicons name={icon} color={theme.mutedText} size={18} />
          </Animated.View>
          <Animated.View style={[styles.icon, styles.absolute, activeStyle]}>
            <Ionicons name={activeIcon} color={theme.primary} size={18} />
          </Animated.View>
        </View>

        <Text
          numberOfLines={1}
          style={[
            styles.label,
            { color: active ? theme.primary : theme.mutedText, fontWeight: active ? '700' : '500' },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pressable: { height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, overflow: 'hidden' },
  content: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  iconStack: { width: 20, height: 18, alignItems: 'center', justifyContent: 'center' },
  icon: { alignItems: 'center', justifyContent: 'center' },
  absolute: { position: 'absolute' },
  label: { fontSize: 9, lineHeight: 11, textAlign: 'center' },
});
