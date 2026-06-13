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

function BoxShape({ box, scale, color = '#00F5A0' }: { box: Box; scale: OverlayScale; color?: string }) {
  return (
    <>
      <Rect x={box.x} y={box.y} width={box.width} height={box.height} rx={scale.radius} fill="none" stroke="#020617" strokeWidth={scale.outline} opacity={0.58} />
      <Rect x={box.x} y={box.y} width={box.width} height={box.height} rx={scale.radius} fill="none" stroke={color} strokeWidth={scale.line} opacity={0.86} />
    </>
  );
}

function StrongLine({ rows, scale, color }: { rows: Landmark[]; scale: OverlayScale; color: string }) {
  if (rows.length < 2) return null;
  const linePoints = points(rows);
  return (
    <>
      <Polyline points={linePoints} fill="none" stroke="#020617" strokeWidth={scale.outline} strokeLinejoin="round" strokeLinecap="round" opacity={0.62} />
      <Polyline points={linePoints} fill="none" stroke={color} strokeWidth={scale.line} strokeLinejoin="round" strokeLinecap="round" opacity={0.82} />
    </>
  );
}

function LandmarkShapes({ rows, scale, color = '#00F5A0', connect = false }: { rows: Landmark[]; scale: OverlayScale; color?: string; connect?: boolean }) {
  if (!rows.length) return null;
  return (
    <>
      {connect ? <StrongLine rows={rows} scale={scale} color={color} /> : null}
      {rows.map((point) => <Circle key={point.index} cx={point.x} cy={point.y} r={scale.point} fill={color} fillOpacity={0.66} stroke="#020617" strokeOpacity={0.55} strokeWidth={scale.pointOutline} />)}
    </>
  );
}

function Geometry({ kind, result, scale }: { kind: DetectorKind; result: DetectorResult; scale: OverlayScale }) {
  if (kind === 'face') {
    const face = result as StyleReport;
    return <>{face.face_box ? <BoxShape box={face.face_box} scale={scale} /> : null}<LandmarkShapes rows={face.landmarks ?? []} scale={scale} /></>;
  }
  if (kind === 'eye') {
    const eye = result as EyeAnalysisResponse;
    return <><BoxShape box={eye.eye_boxes.combined} scale={scale} color="#00E5FF" /><BoxShape box={eye.eye_boxes.left} scale={scale} color="#00F5A0" /><BoxShape box={eye.eye_boxes.right} scale={scale} color="#00F5A0" /><LandmarkShapes rows={eye.landmarks} scale={scale} color="#FDE047" /></>;
  }
  if (kind === 'nose') {
    const nose = result as NoseAnalysisResponse;
    return <><BoxShape box={nose.nose_box} scale={scale} color="#00F5A0" /><LandmarkShapes rows={nose.landmarks} scale={scale} color="#FDE047" connect /></>;
  }
  if (kind === 'lips') {
    const lips = result as LipsAnalysisResponse;
    return <><BoxShape box={lips.lips_box} scale={scale} color="#FF4DCE" /><LandmarkShapes rows={lips.landmarks} scale={scale} color="#FDE047" connect /></>;
  }
  if (kind === 'age') {
    const age = result as AgeAnalysisResponse;
    return <><BoxShape box={age.face_box} scale={scale} color="#00E5FF" /><LandmarkShapes rows={age.landmarks} scale={scale} color="#FDE047" /></>;
  }
  const symmetry = result as SymmetryAnalysisResponse;
  return <><BoxShape box={symmetry.face_box} scale={scale} color="#00E5FF" /><StrongLine rows={symmetry.centerline} scale={scale} color="#FF4DCE" /><LandmarkShapes rows={symmetry.landmarks} scale={scale} color="#FDE047" /></>;
}

export function DetectorOverlay({ asset, kind, result }: Props) {
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
    <View style={[styles.frame, { aspectRatio: width / height }]}>
      <Image source={{ uri: asset.uri }} style={StyleSheet.absoluteFill} contentFit="contain" />
      {result ? (
        <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" pointerEvents="none">
          <Geometry kind={kind} result={result} scale={scale} />
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: '100%', maxHeight: 440, minHeight: 220, borderRadius: 24, overflow: 'hidden', backgroundColor: '#0f172a' },
});
