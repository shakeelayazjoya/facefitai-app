import { File, Directory, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { facefitApi } from '@/services/facefitApi';
import type { AgeAnalysisResponse, DetectorKind, FeatureAnalysisResponse, StyleReport, SymmetryAnalysisResponse } from '@/types/api';

export type DetectorResult = StyleReport | FeatureAnalysisResponse | AgeAnalysisResponse | SymmetryAnalysisResponse;
export type ExportFormat = 'pdf' | 'json' | 'txt';

interface ExportPayload { kind: DetectorKind; result: DetectorResult; scanId?: string }

const exportDir = new Directory(Paths.cache, 'report-exports');

const isStyle = (value: DetectorResult): value is StyleReport => 'face_shape' in value;
const isAge = (value: DetectorResult): value is AgeAnalysisResponse => 'apparent_age' in value;
const isSymmetry = (value: DetectorResult): value is SymmetryAnalysisResponse => 'symmetry_score' in value;

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function summary(kind: DetectorKind, result: DetectorResult) {
  if (isStyle(result)) return `${result.face_shape.primary_shape} face`;
  if (isAge(result)) return `${result.apparent_age} years`;
  if (isSymmetry(result)) return `${result.symmetry_level} symmetry`;
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
  const lines = [
    'Face Shape Lab',
    '',
    `Report: ${kind}`,
    `Summary: ${summary(kind, result)}`,
    `Confidence: ${Math.round(('confidence' in result ? result.confidence : result.face_shape.confidence) ?? 0)}%`,
    `Processing: ${result.processing_ms} ms`,
    `Photo quality: ${result.quality.quality_score}%`,
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

export function availableFormats(payload: ExportPayload): ExportFormat[] {
  return payload.scanId ? ['pdf', 'json', 'txt'] : ['json', 'txt'];
}

export async function exportAnalysisReport(payload: ExportPayload, format: ExportFormat) {
  exportDir.create({ idempotent: true, intermediates: true });
  const file = new File(exportDir, fileName(payload, format));
  file.create({ overwrite: true, intermediates: true });

  if (format === 'pdf') {
    if (!payload.scanId) throw new Error('PDF export is only available for saved face reports.');
    file.write(new Uint8Array(await facefitApi.downloadReport(payload.scanId)));
  } else if (format === 'json') {
    file.write(asJson(payload));
  } else {
    file.write(asText(payload));
  }

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) return file.uri;

  await Sharing.shareAsync(file.uri, {
    dialogTitle: 'Export report',
    mimeType: format === 'pdf' ? 'application/pdf' : format === 'json' ? 'application/json' : 'text/plain',
    UTI: format === 'pdf' ? 'com.adobe.pdf' : format === 'json' ? 'public.json' : 'public.plain-text',
  });
  return file.uri;
}
