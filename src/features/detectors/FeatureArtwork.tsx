import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Polyline, Rect } from 'react-native-svg';
import type { DetectorKind } from '@/types/api';
import { radii } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

function Geometry({ kind }: { kind: DetectorKind }) {
  const theme = useAppTheme(); const stroke = theme.gold; const secondary = theme.primary;
  if (kind === 'eye') return <><Ellipse cx="80" cy="48" rx="54" ry="25" fill="none" stroke={stroke} strokeWidth="2" /><Circle cx="80" cy="48" r="19" fill="none" stroke={secondary} strokeWidth="3" /><Circle cx="80" cy="48" r="7" fill={stroke} /><Path d="M26 48 Q80 4 134 48 Q80 92 26 48" fill="none" stroke={theme.textStrong} strokeWidth="1.5" /></>;
  if (kind === 'nose') return <><Path d="M80 12 C67 30 61 59 58 72 C55 84 67 89 80 88 C93 89 105 84 102 72 C99 58 93 30 80 12Z" fill="none" stroke={stroke} strokeWidth="2" /><Polyline points="63,78 70,84 80,80 90,84 97,78" fill="none" stroke={secondary} strokeWidth="2" /></>;
  if (kind === 'lips') return <><Path d="M25 52 C48 26 63 37 80 44 C97 37 112 26 135 52 C112 82 48 82 25 52Z" fill="none" stroke={stroke} strokeWidth="2" /><Path d="M25 52 Q80 64 135 52" fill="none" stroke={secondary} strokeWidth="2" /></>;
  if (kind === 'age') return <><Circle cx="80" cy="50" r="37" fill="none" stroke={stroke} strokeWidth="2" /><Path d="M60 42 Q67 36 74 42 M86 42 Q93 36 100 42 M64 68 Q80 78 96 68" fill="none" stroke={secondary} strokeWidth="2" /><Line x1="80" y1="12" x2="80" y2="24" stroke={theme.textStrong} /><Line x1="43" y1="50" x2="31" y2="50" stroke={theme.textStrong} /></>;
  if (kind === 'symmetry') return <><Ellipse cx="80" cy="50" rx="38" ry="43" fill="none" stroke={stroke} strokeWidth="2" /><Line x1="80" y1="5" x2="80" y2="95" stroke={secondary} strokeWidth="2" strokeDasharray="5 4" /><Circle cx="64" cy="42" r="4" fill={theme.textStrong} /><Circle cx="96" cy="42" r="4" fill={theme.textStrong} /></>;
  return <><Ellipse cx="80" cy="50" rx="39" ry="44" fill="none" stroke={stroke} strokeWidth="2" /><Path d="M52 40 Q64 31 74 40 M86 40 Q96 31 108 40 M61 70 Q80 82 99 70" fill="none" stroke={secondary} strokeWidth="2" /></>;
}

export function FeatureArtwork({ kind = 'face' }: { kind?: DetectorKind }) {
  const theme = useAppTheme();
  return <LinearGradient colors={[theme.surfaceAlt, theme.backgroundElevated]} style={[styles.wrap, { borderColor: theme.borderStrong }]}><View style={[styles.halo, { borderColor: theme.border }]} /><Svg viewBox="0 0 160 100" style={styles.svg}><Geometry kind={kind} /><Rect x="12" y="8" width="22" height="2" fill={theme.gold} /><Rect x="12" y="8" width="2" height="18" fill={theme.gold} /><Rect x="126" y="8" width="22" height="2" fill={theme.gold} /><Rect x="146" y="8" width="2" height="18" fill={theme.gold} /><Rect x="12" y="90" width="22" height="2" fill={theme.gold} /><Rect x="12" y="74" width="2" height="18" fill={theme.gold} /><Rect x="126" y="90" width="22" height="2" fill={theme.gold} /><Rect x="146" y="74" width="2" height="18" fill={theme.gold} /></Svg><View style={[styles.ai, { backgroundColor: theme.surfaceGlass, borderColor: theme.border }]}><Ionicons name="sparkles" size={12} color={theme.gold} /></View></LinearGradient>;
}
const styles = StyleSheet.create({ wrap: { width: '100%', height: 150, borderRadius: radii.lg, borderWidth: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }, svg: { width: '90%', height: '88%' }, halo: { position: 'absolute', width: 150, height: 150, borderRadius: 75, borderWidth: 1, opacity: 0.45 }, ai: { position: 'absolute', right: 10, top: 10, width: 27, height: 27, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' } });
