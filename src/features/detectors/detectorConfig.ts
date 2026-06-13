import type { DetectorKind } from '@/types/api';

export interface DetectorConfig {
  kind: DetectorKind;
  title: string;
  description: string;
  emptyTitle: string;
  uploadTitle: string;
  uploadDescription: string;
  uploadAction: string;
  cameraAction: string;
  loadingLabel: string;
  filePrefix: string;
}

export const detectors: DetectorConfig[] = [
  { kind: 'face', title: 'Face Shape', description: 'Shape, features, and style.', emptyTitle: 'No result yet', uploadTitle: 'Face scan', uploadDescription: 'Clear, front-facing selfie.', uploadAction: 'Upload selfie', cameraAction: 'Take photo', loadingLabel: 'Analyzing face', filePrefix: 'face-shape' },
  { kind: 'eye', title: 'Eye Shape', description: 'Type, traits, and balance.', emptyTitle: 'No result yet', uploadTitle: 'Eye scan', uploadDescription: 'Keep both eyes visible.', uploadAction: 'Upload selfie', cameraAction: 'Take photo', loadingLabel: 'Analyzing eyes', filePrefix: 'eye-shape' },
  { kind: 'nose', title: 'Nose Shape', description: 'Type, geometry, and fit.', emptyTitle: 'No result yet', uploadTitle: 'Nose scan', uploadDescription: 'Face forward in even light.', uploadAction: 'Upload selfie', cameraAction: 'Take photo', loadingLabel: 'Analyzing nose', filePrefix: 'nose-shape' },
  { kind: 'lips', title: 'Lip Shape', description: 'Type, ratio, and traits.', emptyTitle: 'No result yet', uploadTitle: 'Lip scan', uploadDescription: 'Relax your lips.', uploadAction: 'Upload selfie', cameraAction: 'Take photo', loadingLabel: 'Analyzing lips', filePrefix: 'lip-shape' },
  { kind: 'age', title: 'Face Age', description: 'Range and visible signals.', emptyTitle: 'No result yet', uploadTitle: 'Age scan', uploadDescription: 'Use a recent photo.', uploadAction: 'Upload selfie', cameraAction: 'Take photo', loadingLabel: 'Estimating age', filePrefix: 'face-age' },
  { kind: 'symmetry', title: 'Symmetry', description: 'Balance and proportions.', emptyTitle: 'No result yet', uploadTitle: 'Symmetry scan', uploadDescription: 'Face straight ahead.', uploadAction: 'Upload selfie', cameraAction: 'Take photo', loadingLabel: 'Measuring symmetry', filePrefix: 'face-symmetry' },
];
export function getDetector(kind: DetectorKind): DetectorConfig { return detectors.find((item) => item.kind === kind) ?? detectors[0]; }
