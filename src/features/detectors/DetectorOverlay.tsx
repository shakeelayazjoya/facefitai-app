import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Polyline, Rect } from 'react-native-svg';
import type {
  AgeAnalysisResponse,
  Box,
  DetectorKind,
  EyeAnalysisResponse,
  Landmark,
  LipsAnalysisResponse,
  NoseAnalysisResponse,
  StyleReport,
  SymmetryAnalysisResponse,
} from '@/types/api';
import type { ImageAsset } from '@/utils/formData';
import type { DetectorResult } from './ResultCards';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { AppPalette } from '@/constants/theme';

interface Props {
  asset: ImageAsset;
  kind: DetectorKind;
  result: DetectorResult | null;
}

function points(rows: Landmark[]): string {
  return rows.map((point) => `${point.x},${point.y}`).join(' ');
}

interface OverlayScale {
  line: number;
  outline: number;
  point: number;
  pointOutline: number;
  radius: number;
}

function BoxShape({ box, scale, color, outline }: { box: Box; scale: OverlayScale; color: string; outline: string }) {
  return (
    <>
      <Rect x={box.x} y={box.y} width={box.width} height={box.height} rx={scale.radius} fill="none" stroke={outline} strokeWidth={scale.outline} opacity={0.58} />
      <Rect x={box.x} y={box.y} width={box.width} height={box.height} rx={scale.radius} fill="none" stroke={color} strokeWidth={scale.line} opacity={0.86} />
    </>
  );
}

function StrongLine({ rows, scale, color, outline }: { rows: Landmark[]; scale: OverlayScale; color: string; outline: string }) {
  if (rows.length < 2) return null;
  const linePoints = points(rows);
  return (
    <>
      <Polyline points={linePoints} fill="none" stroke={outline} strokeWidth={scale.outline} strokeLinejoin="round" strokeLinecap="round" opacity={0.62} />
      <Polyline points={linePoints} fill="none" stroke={color} strokeWidth={scale.line} strokeLinejoin="round" strokeLinecap="round" opacity={0.82} />
    </>
  );
}

function LandmarkShapes({ rows, scale, color, outline, connect = false }: { rows: Landmark[]; scale: OverlayScale; color: string; outline: string; connect?: boolean }) {
  if (!rows.length) return null;
  return (
    <>
      {connect ? <StrongLine rows={rows} scale={scale} color={color} outline={outline} /> : null}
      {rows.map((point) => <Circle key={point.index} cx={point.x} cy={point.y} r={scale.point} fill={color} fillOpacity={0.66} stroke={outline} strokeOpacity={0.55} strokeWidth={scale.pointOutline} />)}
    </>
  );
}

function Geometry({ kind, result, scale, colors }: { kind: DetectorKind; result: DetectorResult; scale: OverlayScale; colors: AppPalette }) {
  if (kind === 'face') {
    const face = result as StyleReport;
    return <>{face.face_box ? <BoxShape box={face.face_box} scale={scale} color={colors.primary} outline={colors.black} /> : null}<LandmarkShapes rows={face.landmarks ?? []} scale={scale} color={colors.primary} outline={colors.black} /></>;
  }
  if (kind === 'eye') {
    const eye = result as EyeAnalysisResponse;
    return <><BoxShape box={eye.eye_boxes.combined} scale={scale} color={colors.info} outline={colors.black} /><BoxShape box={eye.eye_boxes.left} scale={scale} color={colors.primary} outline={colors.black} /><BoxShape box={eye.eye_boxes.right} scale={scale} color={colors.primary} outline={colors.black} /><LandmarkShapes rows={eye.landmarks} scale={scale} color={colors.warning} outline={colors.black} /></>;
  }
  if (kind === 'nose') {
    const nose = result as NoseAnalysisResponse;
    return <><BoxShape box={nose.nose_box} scale={scale} color={colors.primary} outline={colors.black} /><LandmarkShapes rows={nose.landmarks} scale={scale} color={colors.warning} outline={colors.black} connect /></>;
  }
  if (kind === 'lips') {
    const lips = result as LipsAnalysisResponse;
    return <><BoxShape box={lips.lips_box} scale={scale} color={colors.accent} outline={colors.black} /><LandmarkShapes rows={lips.landmarks} scale={scale} color={colors.warning} outline={colors.black} connect /></>;
  }
  if (kind === 'age') {
    const age = result as AgeAnalysisResponse;
    return <><BoxShape box={age.face_box} scale={scale} color={colors.info} outline={colors.black} /><LandmarkShapes rows={age.landmarks} scale={scale} color={colors.warning} outline={colors.black} /></>;
  }
  const symmetry = result as SymmetryAnalysisResponse;
  return <><BoxShape box={symmetry.face_box} scale={scale} color={colors.info} outline={colors.black} /><StrongLine rows={symmetry.centerline} scale={scale} color={colors.accent} outline={colors.black} /><LandmarkShapes rows={symmetry.landmarks} scale={scale} color={colors.warning} outline={colors.black} /></>;
}

export function DetectorOverlay({ asset, kind, result }: Props) {
  const theme = useAppTheme();
  const width = asset.width || 1;
  const height = asset.height || 1;
  const base = Math.max(width, height);
  const scale: OverlayScale = {
    line: Math.max(2.5, base * 0.0045),
    outline: Math.max(4.5, base * 0.008),
    point: Math.max(3.5, base * 0.0055),
    pointOutline: Math.max(1.2, base * 0.0018),
    radius: Math.max(8, base * 0.014),
  };

  return (
    <View style={[styles.frame, { aspectRatio: width / height, backgroundColor: theme.black }]}> 
      <Image source={{ uri: asset.uri }} style={StyleSheet.absoluteFill} contentFit="contain" cachePolicy="memory-disk" transition={180} />
      {result ? (
        <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" pointerEvents="none">
          <Geometry kind={kind} result={result} scale={scale} colors={theme} />
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: '100%', maxHeight: 440, minHeight: 220, borderRadius: 24, overflow: 'hidden' },
});
