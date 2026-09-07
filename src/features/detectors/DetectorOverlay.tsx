import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Polyline, Rect } from 'react-native-svg';
import type {
  AgeAnalysisResponse,
  Box,
  DetectorKind,
  ExpressionAnalysisResponse,
  EyeAnalysisResponse,
  Landmark,
  LipsAnalysisResponse,
  NoseAnalysisResponse,
  StyleReport,
  SymmetryAnalysisResponse,
} from '@/types/api';
import type { ImageAsset } from '@/utils/formData';
import type { DetectorResult } from './ResultCards';
import { AnalysisLoader } from '@/components/ui/AnalysisLoader';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { AppPalette } from '@/constants/theme';

interface Props {
  asset: ImageAsset;
  kind: DetectorKind;
  result: DetectorResult | null;
  processing?: boolean;
  loadingLabel?: string;
  onImageReady?: () => void;
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

function HudBoxShape({ box, scale, color }: { box: Box; scale: OverlayScale; color: string }) {
  const cornerLen = Math.max(12, Math.min(box.width, box.height) * 0.22);
  const x1 = box.x;
  const y1 = box.y;
  const x2 = box.x + box.width;
  const y2 = box.y + box.height;

  const tl = `${x1},${y1 + cornerLen} ${x1},${y1} ${x1 + cornerLen},${y1}`;
  const tr = `${x2 - cornerLen},${y1} ${x2},${y1} ${x2},${y1 + cornerLen}`;
  const bl = `${x1},${y1 + cornerLen} ${x1},${y2} ${x1 + cornerLen},${y2}`;
  const br = `${x2 - cornerLen},${y2} ${x2},${y2} ${x2},${y2 - cornerLen}`;

  return (
    <>
      {/* Subtle dashed bounding frame */}
      <Rect
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        rx={scale.radius}
        fill="none"
        stroke={color}
        strokeWidth={scale.line * 0.7}
        strokeDasharray="6 6"
        opacity={0.35}
      />
      {/* High-tech HUD corner brackets */}
      <Polyline points={tl} fill="none" stroke={color} strokeWidth={scale.line * 1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
      <Polyline points={tr} fill="none" stroke={color} strokeWidth={scale.line * 1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
      <Polyline points={bl} fill="none" stroke={color} strokeWidth={scale.line * 1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
      <Polyline points={br} fill="none" stroke={color} strokeWidth={scale.line * 1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
    </>
  );
}

function StrongLine({ rows, scale, color, outline }: { rows: Landmark[]; scale: OverlayScale; color: string; outline?: string }) {
  if (rows.length < 2) return null;
  const linePoints = points(rows);
  return (
    <>
      {outline ? (
        <Polyline points={linePoints} fill="none" stroke={outline} strokeWidth={scale.outline} strokeLinejoin="round" strokeLinecap="round" opacity={0.3} />
      ) : null}
      <Polyline points={linePoints} fill="none" stroke={color} strokeWidth={scale.line} strokeLinejoin="round" strokeLinecap="round" opacity={0.88} />
    </>
  );
}

function BiometricFaceMesh({ rows, scale, primaryColor, accentColor }: { rows: Landmark[]; scale: OverlayScale; primaryColor: string; accentColor: string }) {
  if (!rows.length) return null;

  if (rows.length >= 68) {
    const jaw = rows.slice(0, 17);
    const rightEyebrow = rows.slice(17, 22);
    const leftEyebrow = rows.slice(22, 27);
    const noseBridge = rows.slice(27, 31);
    const noseBase = rows.slice(30, 36);
    const rightEye = [...rows.slice(36, 42), rows[36]];
    const leftEye = [...rows.slice(42, 48), rows[42]];
    const outerLips = [...rows.slice(48, 60), rows[48]];
    const innerLips = [...rows.slice(60, 68), rows[60]];

    const contourSegments = [
      jaw,
      rightEyebrow,
      leftEyebrow,
      noseBridge,
      noseBase,
      rightEye,
      leftEye,
      outerLips,
      innerLips,
    ];

    return (
      <>
        {contourSegments.map((segment, idx) => {
          if (segment.length < 2) return null;
          return (
            <Polyline
              key={`contour-${idx}`}
              points={points(segment)}
              fill="none"
              stroke={primaryColor}
              strokeWidth={scale.line * 0.95}
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={0.78}
            />
          );
        })}
        {rows.map((point) => (
          <Circle
            key={point.index ?? `${point.x}-${point.y}`}
            cx={point.x}
            cy={point.y}
            r={scale.point}
            fill={accentColor}
            fillOpacity={0.92}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {rows.map((point) => (
        <Circle
          key={point.index ?? `${point.x}-${point.y}`}
          cx={point.x}
          cy={point.y}
          r={scale.point}
          fill={accentColor}
          fillOpacity={0.9}
        />
      ))}
    </>
  );
}

function LandmarkShapes({ rows, scale, color, connect = false }: { rows: Landmark[]; scale: OverlayScale; color: string; connect?: boolean }) {
  if (!rows.length) return null;
  return (
    <>
      {connect ? <StrongLine rows={rows} scale={scale} color={color} /> : null}
      {rows.map((point) => (
        <Circle
          key={point.index ?? `${point.x}-${point.y}`}
          cx={point.x}
          cy={point.y}
          r={scale.point}
          fill={color}
          fillOpacity={0.88}
        />
      ))}
    </>
  );
}

function Geometry({ kind, result, scale, colors }: { kind: DetectorKind; result: DetectorResult; scale: OverlayScale; colors: AppPalette }) {
  if (kind === 'face') {
    const face = result as StyleReport;
    return (
      <>
        {face.face_box ? <HudBoxShape box={face.face_box} scale={scale} color={colors.primary} /> : null}
        <BiometricFaceMesh
          rows={face.landmarks ?? []}
          scale={scale}
          primaryColor={colors.primary}
          accentColor={colors.secondary}
        />
      </>
    );
  }
  if (kind === 'eye') {
    const eye = result as EyeAnalysisResponse;
    return (
      <>
        <HudBoxShape box={eye.eye_boxes.combined} scale={scale} color={colors.info} />
        <HudBoxShape box={eye.eye_boxes.left} scale={scale} color={colors.primary} />
        <HudBoxShape box={eye.eye_boxes.right} scale={scale} color={colors.primary} />
        <LandmarkShapes rows={eye.landmarks} scale={scale} color={colors.secondary} />
      </>
    );
  }
  if (kind === 'nose') {
    const nose = result as NoseAnalysisResponse;
    return (
      <>
        <HudBoxShape box={nose.nose_box} scale={scale} color={colors.primary} />
        <LandmarkShapes rows={nose.landmarks} scale={scale} color={colors.secondary} connect />
      </>
    );
  }
  if (kind === 'lips') {
    const lips = result as LipsAnalysisResponse;
    return (
      <>
        <HudBoxShape box={lips.lips_box} scale={scale} color={colors.accent} />
        <LandmarkShapes rows={lips.landmarks} scale={scale} color={colors.secondary} connect />
      </>
    );
  }
  if (kind === 'age') {
    const age = result as AgeAnalysisResponse;
    return (
      <>
        <HudBoxShape box={age.face_box} scale={scale} color={colors.info} />
        <LandmarkShapes rows={age.landmarks} scale={scale} color={colors.secondary} />
      </>
    );
  }
  if (kind === 'emotion') {
    const expr = result as ExpressionAnalysisResponse;
    return (
      <>
        {expr.face_box ? <HudBoxShape box={expr.face_box} scale={scale} color={colors.primary} /> : null}
        <LandmarkShapes rows={expr.mesh_landmarks ?? []} scale={scale} color={colors.secondary} />
      </>
    );
  }
  const symmetry = result as SymmetryAnalysisResponse;
  return (
    <>
      <HudBoxShape box={symmetry.face_box} scale={scale} color={colors.info} />
      <StrongLine rows={symmetry.centerline} scale={scale} color={colors.accent} />
      <LandmarkShapes rows={symmetry.landmarks} scale={scale} color={colors.secondary} />
    </>
  );
}

export function DetectorOverlay({ asset, kind, result, processing = false, loadingLabel = 'Analyzing', onImageReady }: Props) {
  const theme = useAppTheme();
  const width = asset.width || 1;
  const height = asset.height || 1;
  const base = Math.max(width, height);
  const frameRatio = Math.min(Math.max(width / height, 0.5), 2.2);

  // Scaled dimensions with micro-node caps to avoid bloated overlapping points
  const scale: OverlayScale = {
    line: Math.max(1.6, Math.min(3.8, base * 0.0018)),
    outline: Math.max(2.8, Math.min(5.5, base * 0.003)),
    point: Math.max(1.6, Math.min(3.6, base * 0.0018)),
    pointOutline: Math.max(0.8, Math.min(1.8, base * 0.001)),
    radius: Math.max(8, base * 0.014),
  };

  return (
    <View style={[styles.frame, { aspectRatio: frameRatio, backgroundColor: theme.black }]}>
      <Image
        source={{ uri: asset.uri }}
        style={StyleSheet.absoluteFill}
        contentFit="contain"
        cachePolicy="memory-disk"
        recyclingKey={asset.uri}
        transition={60}
        onLoad={onImageReady}
        onError={onImageReady}
      />
      {result ? (
        <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" pointerEvents="none">
          <Geometry kind={kind} result={result} scale={scale} colors={theme} />
        </Svg>
      ) : null}
      {processing ? (
        <View style={[StyleSheet.absoluteFill, styles.loading, { backgroundColor: theme.overlay }]}>
          <AnalysisLoader label={loadingLabel} compact variant="overlay" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: '100%', alignSelf: 'stretch', borderRadius: 24, overflow: 'hidden' },
  loading: { alignItems: 'center', justifyContent: 'center', padding: 18 },
});
