import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Polyline, Rect } from 'react-native-svg';
import type { DetectorKind } from '@/types/api';
import { radii } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

function Geometry({ kind }: { kind: DetectorKind }) {
  const theme = useAppTheme();
  const stroke = theme.primary;
  const secondary = theme.secondary;
  if (kind === 'eye') return <><Ellipse cx="80" cy="48" rx="54" ry="25" fill="none" stroke={stroke} strokeWidth="2" /><Circle cx="80" cy="48" r="19" fill="none" stroke={secondary} strokeWidth="3" /><Circle cx="80" cy="48" r="7" fill={stroke} /><Path d="M26 48 Q80 4 134 48 Q80 92 26 48" fill="none" stroke={theme.textStrong} strokeWidth="1.5" /></>;
  if (kind === 'nose') return <><Path d="M80 12 C67 30 61 59 58 72 C55 84 67 89 80 88 C93 89 105 84 102 72 C99 58 93 30 80 12Z" fill="none" stroke={stroke} strokeWidth="2" /><Polyline points="63,78 70,84 80,80 90,84 97,78" fill="none" stroke={secondary} strokeWidth="2" /></>;
  if (kind === 'lips') return <><Path d="M25 52 C48 26 63 37 80 44 C97 37 112 26 135 52 C112 82 48 82 25 52Z" fill="none" stroke={stroke} strokeWidth="2" /><Path d="M25 52 Q80 64 135 52" fill="none" stroke={secondary} strokeWidth="2" /></>;
  if (kind === 'age') return <><Circle cx="80" cy="50" r="37" fill="none" stroke={stroke} strokeWidth="2" /><Path d="M60 42 Q67 36 74 42 M86 42 Q93 36 100 42 M64 68 Q80 78 96 68" fill="none" stroke={secondary} strokeWidth="2" /><Line x1="80" y1="12" x2="80" y2="24" stroke={theme.textStrong} /><Line x1="43" y1="50" x2="31" y2="50" stroke={theme.textStrong} /></>;
  if (kind === 'symmetry') return <><Ellipse cx="80" cy="50" rx="38" ry="43" fill="none" stroke={stroke} strokeWidth="2" /><Line x1="80" y1="5" x2="80" y2="95" stroke={secondary} strokeWidth="2" strokeDasharray="5 4" /><Circle cx="64" cy="42" r="4" fill={theme.textStrong} /><Circle cx="96" cy="42" r="4" fill={theme.textStrong} /></>;
  if (kind === 'emotion') return <><Circle cx="80" cy="50" r="38" fill="none" stroke={stroke} strokeWidth="2" /><Circle cx="63" cy="40" r="5" fill={secondary} /><Circle cx="97" cy="40" r="5" fill={secondary} /><Path d="M54 62 Q80 84 106 62" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" /><Circle cx="120" cy="25" r="3" fill={stroke} /><Circle cx="40" cy="25" r="3" fill={stroke} /></>;
  return (
    <>
      {/* Outer Face Contour */}
      <Path d="M80 12 C52 12 40 32 40 54 C40 76 54 90 80 90 C106 90 120 76 120 54 C120 32 108 12 80 12Z" fill="none" stroke={stroke} strokeWidth="2.2" />
      {/* 3D Wireframe Curves */}
      <Path d="M46 36 Q80 24 114 36" stroke={stroke} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <Path d="M42 50 Q80 40 118 50" stroke={secondary} strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
      <Path d="M48 68 Q80 80 112 68" stroke={stroke} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      {/* Eyebrows */}
      <Path d="M52 38 Q62 32 72 36" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <Path d="M88 36 Q98 32 108 38" stroke={secondary} strokeWidth="2" strokeLinecap="round" />
      {/* Eyes */}
      <Circle cx="62" cy="46" r="4.5" fill={stroke} />
      <Circle cx="98" cy="46" r="4.5" fill={secondary} />
      {/* Nose */}
      <Path d="M80 40 L76 60 Q80 64 84 60 Z" stroke={secondary} strokeWidth="1.8" fill="none" />
      {/* Smile */}
      <Path d="M64 74 Q80 84 96 74" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
      {/* 14 Landmark Target Dots */}
      {[
        [80, 16, stroke], [52, 28, stroke], [108, 28, secondary],
        [62, 46, stroke], [98, 46, secondary], [44, 52, stroke], [116, 52, secondary],
        [80, 60, secondary], [64, 74, stroke], [96, 74, secondary], [80, 86, stroke]
      ].map(([cx, cy, col], i) => (
        <Circle key={`geo-dot-${i}`} cx={cx as number} cy={cy as number} r="3" fill={col as string} />
      ))}
    </>
  );
}

export function FeatureArtwork({ kind = 'face' }: { kind?: DetectorKind }) {
  const theme = useAppTheme();
  return (
    <LinearGradient colors={[theme.surface, theme.surfaceAlt]} style={[styles.wrap, { borderColor: theme.border }]}>
      <View style={[styles.halo, { borderColor: theme.primarySoft }]} />
      <Svg viewBox="0 0 160 100" style={styles.svg}>
        <Geometry kind={kind} />
        {/* Purple Corner Target Brackets Left */}
        <Rect x="12" y="8" width="22" height="2.5" fill={theme.primary} rx="1" />
        <Rect x="12" y="8" width="2.5" height="18" fill={theme.primary} rx="1" />
        <Rect x="12" y="90" width="22" height="2.5" fill={theme.primary} rx="1" />
        <Rect x="12" y="74" width="2.5" height="18" fill={theme.primary} rx="1" />
        {/* Teal Corner Target Brackets Right */}
        <Rect x="126" y="8" width="22" height="2.5" fill={theme.secondary} rx="1" />
        <Rect x="145.5" y="8" width="2.5" height="18" fill={theme.secondary} rx="1" />
        <Rect x="126" y="90" width="22" height="2.5" fill={theme.secondary} rx="1" />
        <Rect x="145.5" y="74" width="2.5" height="18" fill={theme.secondary} rx="1" />
      </Svg>
      <View style={[styles.ai, { backgroundColor: theme.surfaceGlass, borderColor: theme.border }]}>
        <Ionicons name="sparkles" size={13} color={theme.primary} />
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({ wrap: { width: '100%', height: 150, borderRadius: radii.lg, borderWidth: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }, svg: { width: '90%', height: '88%' }, halo: { position: 'absolute', width: 150, height: 150, borderRadius: 75, borderWidth: 1, opacity: 0.45 }, ai: { position: 'absolute', right: 10, top: 10, width: 27, height: 27, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' } });
