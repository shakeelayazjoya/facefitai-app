import { File, Directory, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { AgeAnalysisResponse, DetectorKind, ExpressionAnalysisResponse, FeatureAnalysisResponse, StyleReport, SymmetryAnalysisResponse } from '@/types/api';
import type { ImageAsset } from '@/utils/formData';

export type DetectorResult = StyleReport | FeatureAnalysisResponse | AgeAnalysisResponse | SymmetryAnalysisResponse | ExpressionAnalysisResponse;
export type ExportFormat = 'pdf' | 'json' | 'txt';

interface ExportPayload { kind: DetectorKind; result: DetectorResult; scanId?: string; asset?: ImageAsset | null }

const exportDir = new Directory(Paths.cache, 'report-exports');

const isStyle = (value: DetectorResult): value is StyleReport => 'face_shape' in value;
const isAge = (value: DetectorResult): value is AgeAnalysisResponse => 'apparent_age' in value;
const isSymmetry = (value: DetectorResult): value is SymmetryAnalysisResponse => 'symmetry_score' in value;
const isExpression = (value: DetectorResult): value is ExpressionAnalysisResponse => 'smile' in value;

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function summary(kind: DetectorKind, result: DetectorResult) {
  if (isStyle(result)) return `${result.face_shape.primary_shape} face`;
  if (isAge(result)) return `${result.apparent_age} years`;
  if (isSymmetry(result)) return `${result.symmetry_level} symmetry`;
  if (isExpression(result)) return result.emotion ? `${result.emotion.label} (${result.smile.label})` : result.smile.label;
  return `${result.primary_type} ${kind}`;
}

function asJson(payload: ExportPayload) {
  return JSON.stringify({
    exported_at: new Date().toISOString(),
    kind: payload.kind,
    summary: summary(payload.kind, payload.result),
    result: payload.result,
  }, null, 2);
}

function asText(payload: ExportPayload) {
  const { kind, result } = payload;
  const qualityScore = result.quality?.quality_score ?? 90;
  const confidenceVal = 'confidence' in result && typeof result.confidence === 'number'
    ? result.confidence
    : isExpression(result)
    ? result.emotion?.confidence ?? result.smile.score
    : isStyle(result)
    ? result.face_shape.confidence
    : 0;
  const lines = [
    'Face Shape Lab',
    '',
    `Report: ${kind}`,
    `Summary: ${summary(kind, result)}`,
    `Confidence: ${Math.round(confidenceVal ?? 0)}%`,
    `Processing: ${result.processing_ms} ms`,
    `Photo quality: ${qualityScore}%`,
    '',
  ];
  if (isStyle(result)) {
    lines.push(`Primary shape: ${result.face_shape.primary_shape}`);
    lines.push(`Secondary shape: ${result.face_shape.secondary_shape}`);
    lines.push(`Eyes: ${result.features.eyes_type}`);
    lines.push(`Nose: ${result.features.nose_type}`);
    lines.push(`Lips: ${result.features.lips_type}`);
    lines.push(`Jawline: ${result.features.jawline_type}`);
  } else if (isAge(result)) {
    lines.push(`Age range: ${result.age_range}`);
    result.signals.forEach((item) => lines.push(`${item.label}: ${String(item.value)} (${Math.round(item.confidence)}%)`));
  } else if (isSymmetry(result)) {
    result.regions.forEach((item) => lines.push(`${item.region}: ${Math.round(item.score)}%`));
  } else if (isExpression(result)) {
    lines.push(`Smile intensity: ${Math.round(result.smile.score)}% (${result.smile.label})`);
    if (result.emotion) {
      lines.push(`Dominant emotion: ${result.emotion.label} (${Math.round(result.emotion.confidence)}%)`);
      result.emotion.scores.forEach((item) => lines.push(`- ${item.label}: ${Math.round(item.score)}%`));
    }
    if (result.age) lines.push(`Apparent age: ~${Math.round(result.age.value)} (${Math.round(result.age.low)}-${Math.round(result.age.high)})`);
    if (result.gender) lines.push(`Gender: ${result.gender.label}`);
  } else {
    lines.push(`Detected type: ${result.primary_type}`);
    result.traits.forEach((item) => lines.push(`${item.label}: ${item.value} (${Math.round(item.confidence)}%)`));
  }
  lines.push('', 'Recommendations:');
  (isStyle(result) ? result.grooming_tips : result.recommendations).slice(0, 8).forEach((item) => lines.push(`- ${item}`));
  return lines.join('\n');
}

function fileName(payload: ExportPayload, format: ExportFormat) {
  return `${slug(payload.kind)}-${Date.now()}.${format}`;
}

export function availableFormats(_payload: ExportPayload): ExportFormat[] {
  // PDF is rendered on-device from the result, so it no longer depends on a saved
  // scanId — every detector can export one.
  return ['pdf', 'json', 'txt'];
}

/** Renders the styled HTML report to a PDF and shares it. */
async function exportPdf(payload: ExportPayload) {
  const { buildReportHtml } = await import('./reportPdf');
  const html = await buildReportHtml(payload.kind, payload.result, payload.asset);
  const { uri } = await Print.printToFileAsync({ html, base64: false });

  if (!(await Sharing.isAvailableAsync())) return uri;
  await Sharing.shareAsync(uri, { dialogTitle: 'Export report', mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
  return uri;
}

export async function exportAnalysisReport(payload: ExportPayload, format: ExportFormat) {
  if (format === 'pdf') return exportPdf(payload);

  exportDir.create({ idempotent: true, intermediates: true });
  const file = new File(exportDir, fileName(payload, format));
  file.create({ overwrite: true, intermediates: true });

  if (format === 'json') {
    file.write(asJson(payload));
  } else {
    file.write(asText(payload));
  }

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) return file.uri;

  await Sharing.shareAsync(file.uri, {
    dialogTitle: 'Export report',
    mimeType: format === 'json' ? 'application/json' : 'text/plain',
    UTI: format === 'json' ? 'public.json' : 'public.plain-text',
  });
  return file.uri;
}
