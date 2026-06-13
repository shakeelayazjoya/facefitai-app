import Animated, { FadeInUp, LinearTransition } from 'react-native-reanimated';
import type { PropsWithChildren } from 'react';
import { Card } from './Card';
export function AnimatedCard({ children, delay = 0 }: PropsWithChildren<{ delay?: number }>) { return <Animated.View entering={FadeInUp.springify().damping(18).delay(delay)} layout={LinearTransition.springify().damping(18)}><Card>{children}</Card></Animated.View>; }
