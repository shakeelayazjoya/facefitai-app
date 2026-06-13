import { EmptyState } from './EmptyState';
import { Button } from './Button';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { spacing } from '@/constants/theme';
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) { return <Animated.View entering={FadeInDown.springify()}><View style={styles.wrap}><EmptyState icon="alert-circle-outline" title="Something went wrong" message={message} />{onRetry ? <Button title="Try again" variant="secondary" icon="refresh" onPress={onRetry} /> : null}</View></Animated.View>; }
const styles = StyleSheet.create({ wrap: { gap: spacing.md } });
