import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, type ViewToken } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/Button';
import { onboardingItems } from '@/constants/onboarding';
import { layout, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useResponsive } from '@/utils/responsive';
import { OnboardingSlide } from './OnboardingSlide';

function Dot({ active }: { active: boolean }) {
  const theme = useAppTheme(); const progress = useSharedValue(active ? 1 : 0); progress.value = withSpring(active ? 1 : 0);
  const style = useAnimatedStyle(() => ({ width: 8 + progress.value * 20, backgroundColor: interpolateColor(progress.value, [0, 1], [theme.borderStrong, theme.primary]) }));
  return <Animated.View style={[styles.dot, style]} />;
}

export function OnboardingScreen() {
  const theme = useAppTheme(); const { width } = useResponsive(); const complete = useOnboardingStore((s) => s.complete);
  const list = useRef<FlatList>(null); const [index, setIndex] = useState(0); const last = index === onboardingItems.length - 1;
  const finish = async () => { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); await complete(); router.replace('/(tabs)'); };
  const next = () => { if (last) { void finish(); return; } void Haptics.selectionAsync(); list.current?.scrollToIndex({ index: index + 1, animated: true }); };
  const viewability = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => { const nextIndex = viewableItems[0]?.index; if (nextIndex !== null && nextIndex !== undefined) setIndex(nextIndex); }).current;
  return <View style={[styles.screen, { backgroundColor: theme.background }]}> 
    <View style={styles.top}><Pressable hitSlop={12} onPress={() => void finish()}><AppText weight="bold" color={theme.mutedText}>Skip</AppText></Pressable></View>
    <FlatList ref={list} horizontal pagingEnabled showsHorizontalScrollIndicator={false} data={onboardingItems} keyExtractor={(item) => item.id} renderItem={({ item }) => <OnboardingSlide item={item} width={width} />} onViewableItemsChanged={viewability} viewabilityConfig={{ itemVisiblePercentThreshold: 60 }} />
    <View style={styles.footer}><View style={styles.dots}>{onboardingItems.map((item, dotIndex) => <Dot key={item.id} active={dotIndex === index} />)}</View><AppButton title={last ? 'Get started' : 'Continue'} icon={last ? 'sparkles-outline' : 'arrow-forward-outline'} onPress={next} /></View>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, top: { paddingTop: layout.safeTop, paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.lg }, dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm }, dot: { height: 8, borderRadius: 4 },
});
