import { EmptyState } from './EmptyState';
import { Button } from './Button';
import { View } from 'react-native';
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) { return <View style={{ gap: 12 }}><EmptyState icon="alert-circle-outline" title="We hit a snag" message={message} />{onRetry ? <Button title="Try again" variant="secondary" icon="refresh" onPress={onRetry} /> : null}</View>; }
