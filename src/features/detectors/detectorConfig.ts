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
  { kind: 'face', title: 'AI Face Shape Detector', description: 'Full facial analysis with shape scores, features, beard, glasses, grooming and AI style guidance.', emptyTitle: 'Face report appears after scanning', uploadTitle: 'Face shape scan', uploadDescription: 'Upload a clear, front-facing selfie to identify face shape and styling recommendations.', uploadAction: 'Upload face photo', cameraAction: 'Take face photo', loadingLabel: 'Analyzing face shape', filePrefix: 'face-shape' },
  { kind: 'eye', title: 'AI Eye Shape Detector', description: 'Classify eye type, geometry, traits, and personalized recommendations.', emptyTitle: 'Eye report appears after scanning', uploadTitle: 'Eye shape scan', uploadDescription: 'Use a sharp, front-facing photo with both eyes visible and no heavy shadows.', uploadAction: 'Upload eye photo', cameraAction: 'Take eye photo', loadingLabel: 'Analyzing eye shape', filePrefix: 'eye-shape' },
  { kind: 'nose', title: 'AI Nose Shape Detector', description: 'Analyze nose geometry, type scores, traits, and styling guidance.', emptyTitle: 'Nose report appears after scanning', uploadTitle: 'Nose shape scan', uploadDescription: 'Use a centered, front-facing photo with the full nose clearly visible.', uploadAction: 'Upload nose photo', cameraAction: 'Take nose photo', loadingLabel: 'Analyzing nose shape', filePrefix: 'nose-shape' },
  { kind: 'lips', title: 'AI Lip Shape Detector', description: 'Analyze lips type, ratios, traits, and grooming recommendations.', emptyTitle: 'Lip report appears after scanning', uploadTitle: 'Lip shape scan', uploadDescription: 'Use a clear photo with relaxed, closed lips and even lighting.', uploadAction: 'Upload lip photo', cameraAction: 'Take lip photo', loadingLabel: 'Analyzing lip shape', filePrefix: 'lip-shape' },
  { kind: 'age', title: 'AI Face Age Detector', description: 'Estimate apparent age, range confidence, signals, and care suggestions.', emptyTitle: 'Age report appears after scanning', uploadTitle: 'Face age scan', uploadDescription: 'Use a recent, unfiltered portrait in natural light for the best age estimate.', uploadAction: 'Upload age photo', cameraAction: 'Take age photo', loadingLabel: 'Estimating face age', filePrefix: 'face-age' },
  { kind: 'symmetry', title: 'Face Symmetry Detector', description: 'Measure centerline balance, regional symmetry, score, and recommendations.', emptyTitle: 'Symmetry report appears after scanning', uploadTitle: 'Face symmetry scan', uploadDescription: 'Use a straight-on portrait with a neutral expression and your full face visible.', uploadAction: 'Upload symmetry photo', cameraAction: 'Take symmetry photo', loadingLabel: 'Measuring face symmetry', filePrefix: 'face-symmetry' },
];
export function getDetector(kind: DetectorKind): DetectorConfig { return detectors.find((item) => item.kind === kind) ?? detectors[0]; }
