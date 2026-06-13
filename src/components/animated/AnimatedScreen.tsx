import type { PropsWithChildren } from 'react';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { motion } from '@/constants/animations';

export function AnimatedScreen({ children }: PropsWithChildren) {
  return <Animated.View entering={FadeIn.duration(motion.normal)} exiting={FadeOut.duration(motion.fast)} layout={LinearTransition.duration(motion.normal)} style={{ flex: 1 }}>{children}</Animated.View>;
}
