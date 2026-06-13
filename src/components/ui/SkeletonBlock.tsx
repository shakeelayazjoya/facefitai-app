import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
export function SkeletonBlock({ height = 20, width = '100%' }: { height?: number; width?: number | `${number}%` }) { const theme = useAppTheme(); return <View style={[styles.block, { height, width, backgroundColor: theme.surfaceAlt }]} />; }
const styles = StyleSheet.create({ block: { borderRadius: 12, opacity: 0.75 } });
