import { File } from 'expo-file-system';
import { fromByteArray } from 'base64-js';
import { lightTheme } from '@/constants/theme';
import type {
  AgeAnalysisResponse,
  Box,
  DetectorKind,
  ExpressionAnalysisResponse,
  EyeAnalysisResponse,
  FeatureAnalysisResponse,
  Landmark,
  LipsAnalysisResponse,
  NoseAnalysisResponse,
  StyleReport,
  SymmetryAnalysisResponse,
} from '@/types/api';
import type { ImageAsset } from '@/utils/formData';
import type { DetectorResult } from './reportExport';

const isStyle = (v: DetectorResult): v is StyleReport => 'face_shape' in v;
const isAge = (v: DetectorResult): v is AgeAnalysisResponse => 'apparent_age' in v;
const isSymmetry = (v: DetectorResult): v is SymmetryAnalysisResponse => 'symmetry_score' in v;
const isExpression = (v: DetectorResult): v is ExpressionAnalysisResponse => 'smile' in v;

const P = lightTheme;

/** Minimal escape — every value below is interpolated into markup. */
function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const titleCase = (value: string) => value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// ---------------------------------------------------------------------------
// Landmark overlay — mirrors DetectorOverlay's <Geometry>, emitted as SVG markup
// so the PDF shows the same detection the user saw on screen.
// ---------------------------------------------------------------------------
interface Scale { line: number; outline: number; point: number; pointOutline: number; radius: number }

function boxSvg(box: Box | undefined, s: Scale, color: string, outline: string): string {
  if (!box) return '';
  const attrs = `x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="${s.radius}" fill="none"`;
  return `<rect ${attrs} stroke="${outline}" stroke-width="${s.outline}" opacity="0.58"/>`
    + `<rect ${attrs} stroke="${color}" stroke-width="${s.line}" opacity="0.86"/>`;
}

function lineSvg(rows: Landmark[] | undefined, s: Scale, color: string, outline: string): string {
  if (!rows || rows.length < 2) return '';
  const pts = rows.map((p) => `${p.x},${p.y}`).join(' ');
  const attrs = `points="${pts}" fill="none" stroke-linejoin="round" stroke-linecap="round"`;
  return `<polyline ${attrs} stroke="${outline}" stroke-width="${s.outline}" opacity="0.62"/>`
    + `<polyline ${attrs} stroke="${color}" stroke-width="${s.line}" opacity="0.82"/>`;
}

function pointsSvg(rows: Landmark[] | undefined, s: Scale, color: string, outline: string, connect = false): string {
  if (!rows?.length) return '';
  const dots = rows
    .map((p) => `<circle cx="${p.x}" cy="${p.y}" r="${s.point}" fill="${color}" fill-opacity="0.66" stroke="${outline}" stroke-opacity="0.55" stroke-width="${s.pointOutline}"/>`)
    .join('');
  return (connect ? lineSvg(rows, s, color, outline) : '') + dots;
}

function geometrySvg(kind: DetectorKind, result: DetectorResult, s: Scale): string {
  if (kind === 'face' && isStyle(result)) {
    return boxSvg(result.face_box, s, P.primary, P.black) + pointsSvg(result.landmarks ?? [], s, P.primary, P.black);
  }
  if (kind === 'eye') {
    const eye = result as EyeAnalysisResponse;
    return boxSvg(eye.eye_boxes?.combined, s, P.info, P.black)
      + boxSvg(eye.eye_boxes?.left, s, P.primary, P.black)
      + boxSvg(eye.eye_boxes?.right, s, P.primary, P.black)
      + pointsSvg(eye.landmarks, s, P.warning, P.black);
  }
  if (kind === 'nose') {
    const nose = result as NoseAnalysisResponse;
    return boxSvg(nose.nose_box, s, P.primary, P.black) + pointsSvg(nose.landmarks, s, P.warning, P.black, true);
  }
  if (kind === 'lips') {
    const lips = result as LipsAnalysisResponse;
    return boxSvg(lips.lips_box, s, P.accent, P.black) + pointsSvg(lips.landmarks, s, P.warning, P.black, true);
  }
  if (kind === 'age' && isAge(result)) {
    return boxSvg(result.face_box, s, P.info, P.black) + pointsSvg(result.landmarks, s, P.warning, P.black);
  }
  if (kind === 'emotion' && isExpression(result)) {
    return boxSvg(result.face_box, s, P.primary, P.black) + pointsSvg(result.mesh_landmarks ?? [], s, P.gold, P.black);
  }
  if (isSymmetry(result)) {
    return boxSvg(result.face_box, s, P.info, P.black)
      + lineSvg(result.centerline, s, P.accent, P.black)
      + pointsSvg(result.landmarks, s, P.warning, P.black);
  }
  return '';
}

/** Read the captured photo off disk as a data URI — the print engine will not
 *  reliably load `file://` sources, so the bytes have to be inlined. */
async function imageDataUri(asset: ImageAsset): Promise<string | null> {
  try {
    const bytes = new Uint8Array(await new File(asset.uri).arrayBuffer());
    if (!bytes.length) return null;
    const mime = asset.mimeType && asset.mimeType.startsWith('image/') ? asset.mimeType : 'image/jpeg';
    return `data:${mime};base64,${fromByteArray(bytes)}`;
  } catch {
    return null; // A missing photo must never block the rest of the report.
  }
}

// ---------------------------------------------------------------------------
// Report content
// ---------------------------------------------------------------------------
function headline(kind: DetectorKind, result: DetectorResult): { value: string; caption: string } {
  if (isStyle(result)) return { value: titleCase(result.face_shape.primary_shape), caption: 'Primary face shape' };
  if (isAge(result)) return { value: `${Math.round(result.apparent_age)} yrs`, caption: `Estimated range ${result.age_range}` };
  if (isSymmetry(result)) return { value: `${Math.round(result.symmetry_score)}%`, caption: `${titleCase(result.symmetry_level)} symmetry` };
  if (isExpression(result)) return { value: result.emotion ? titleCase(result.emotion.label) : titleCase(result.smile.label), caption: `Smile intensity ${Math.round(result.smile.score)}%` };
  const feature = result as FeatureAnalysisResponse;
  return { value: titleCase(feature.primary_type), caption: `Detected ${kind} type` };
}

function confidenceOf(result: DetectorResult): number {
  if ('confidence' in result && typeof result.confidence === 'number') return result.confidence;
  if (isExpression(result)) return result.emotion?.confidence ?? result.smile.score;
  if (isStyle(result)) return result.face_shape.confidence;
  return 0;
}

function statCards(result: DetectorResult): string {
  const cards: [string, string][] = [
    ['Confidence', `${Math.round(confidenceOf(result))}%`],
    ['Photo quality', `${Math.round(result.quality?.quality_score ?? 90)}%`],
    ['Processing', `${result.processing_ms} ms`],
  ];
  return cards.map(([label, value]) => `<div class="stat"><span class="stat-l">${esc(label)}</span><span class="stat-v">${esc(value)}</span></div>`).join('');
}

function bar(label: string, value: number): string {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return `<div class="bar-row"><div class="bar-head"><span>${esc(label)}</span><b>${pct}%</b></div>`
    + `<div class="bar"><i style="width:${pct}%"></i></div></div>`;
}

function pairs(rows: [string, string][]): string {
  return `<div class="grid">${rows.map(([k, v]) => `<div class="cell"><span class="cell-l">${esc(k)}</span><span class="cell-v">${esc(v)}</span></div>`).join('')}</div>`;
}

function section(title: string, body: string): string {
  return body ? `<section class="block"><h2>${esc(title)}</h2>${body}</section>` : '';
}

function detailSections(kind: DetectorKind, result: DetectorResult): string {
  if (isStyle(result)) {
    const scores = Object.entries(result.face_shape.shape_scores ?? {})
      .sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 6)
      .map(([shape, score]) => bar(titleCase(shape), Number(score))).join('');
    return section('Facial features', pairs([
      ['Primary shape', titleCase(result.face_shape.primary_shape)],
      ['Secondary shape', titleCase(result.face_shape.secondary_shape)],
      ['Eyes', titleCase(result.features.eyes_type)],
      ['Nose', titleCase(result.features.nose_type)],
      ['Lips', titleCase(result.features.lips_type)],
      ['Jawline', titleCase(result.features.jawline_type)],
    ])) + section('Shape match', scores);
  }
  if (isAge(result)) {
    return section('Age signals', result.signals.map((s) => bar(s.label, Number(s.confidence))).join(''))
      + section('Measurements', pairs(result.signals.map((s) => [s.label, String(s.value)] as [string, string])));
  }
  if (isSymmetry(result)) {
    return section('Regional balance', result.regions.map((r) => bar(titleCase(r.region), r.score)).join(''));
  }
  if (isExpression(result)) {
    const extra: [string, string][] = [['Smile', `${titleCase(result.smile.label)} · ${Math.round(result.smile.score)}%`]];
    if (result.age) extra.push(['Apparent age', `~${Math.round(result.age.value)} (${Math.round(result.age.low)}–${Math.round(result.age.high)})`]);
    if (result.gender) extra.push(['Gender read', titleCase(result.gender.label)]);
    return section('Expression', pairs(extra))
      + section('Emotion distribution', (result.emotion?.scores ?? []).map((s) => bar(titleCase(s.label), s.score)).join(''));
  }
  const feature = result as FeatureAnalysisResponse;
  return section(`${titleCase(kind)} traits`, feature.traits.map((t) => bar(t.label, t.confidence)).join(''))
    + section('Details', pairs(feature.traits.map((t) => [t.label, String(t.value)] as [string, string])));
}

function recommendationsOf(result: DetectorResult): string[] {
  return (isStyle(result) ? result.grooming_tips : result.recommendations) ?? [];
}

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------
export async function buildReportHtml(kind: DetectorKind, result: DetectorResult, asset?: ImageAsset | null): Promise<string> {
  const head = headline(kind, result);
  const dataUri = asset ? await imageDataUri(asset) : null;

  let figure = '';
  if (dataUri) {
    const w = asset?.width || 1;
    const h = asset?.height || 1;
    const base = Math.max(w, h);
    const scale: Scale = {
      line: Math.max(2.5, base * 0.0045),
      outline: Math.max(4.5, base * 0.008),
      point: Math.max(3.5, base * 0.0055),
      pointOutline: Math.max(1.2, base * 0.0018),
      radius: Math.max(8, base * 0.014),
    };
    figure = `<figure class="shot">
      <img src="${dataUri}" alt="Analysed photo"/>
      <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${geometrySvg(kind, result, scale)}</svg>
      <figcaption>Detected landmarks as analysed</figcaption>
    </figure>`;
  }

  const tips = recommendationsOf(result).slice(0, 8);
  const generated = new Date().toLocaleString();

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Face Shape Lab — ${esc(titleCase(kind))} report</title>
<style>
  @page { margin: 30px; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin:0; font-family: -apple-system, "Helvetica Neue", Roboto, sans-serif; color:${P.text}; font-size:12px; line-height:1.55; }
  .brand { display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid ${P.primary}; padding-bottom:10px; }
  .brand h1 { margin:0; font-family: Georgia, "Times New Roman", serif; font-size:19px; letter-spacing:.4px; text-transform:uppercase; color:${P.textStrong}; }
  .brand .kicker { margin:2px 0 0; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:${P.gold}; font-weight:700; }
  .brand .meta { text-align:right; font-size:9px; color:${P.mutedText}; }

  .hero { display:flex; gap:16px; margin-top:18px; align-items:stretch; }
  .hero .headline { flex:1; background:${P.primarySoft}; border:1px solid ${P.border}; border-radius:14px; padding:16px; }
  .hero .headline .cap { font-size:9px; text-transform:uppercase; letter-spacing:1.6px; color:${P.primary}; font-weight:700; }
  .hero .headline .val { font-family: Georgia, serif; font-size:30px; color:${P.textStrong}; margin:6px 0 2px; line-height:1.1; }
  .hero .headline .sub { font-size:11px; color:${P.text}; }
  .stats { display:flex; flex-direction:column; gap:8px; width:150px; }
  .stat { border:1px solid ${P.border}; border-radius:12px; padding:9px 11px; display:flex; flex-direction:column; }
  .stat-l { font-size:8px; text-transform:uppercase; letter-spacing:1.2px; color:${P.mutedText}; font-weight:700; }
  .stat-v { font-size:15px; font-weight:700; color:${P.textStrong}; }

  .shot { margin:18px 0 0; padding:0; position:relative; border-radius:14px; overflow:hidden; border:1px solid ${P.border}; background:${P.black}; }
  .shot img { display:block; width:100%; }
  .shot svg { position:absolute; inset:0; width:100%; height:100%; }
  .shot figcaption { position:absolute; left:0; right:0; bottom:0; padding:6px 10px; font-size:9px; letter-spacing:.4px;
    color:#fff; background:linear-gradient(transparent, rgba(7,24,20,.72)); text-align:center; }

  .block { margin-top:18px; break-inside:avoid; }
  .block h2 { font-size:10px; text-transform:uppercase; letter-spacing:1.8px; color:${P.primary};
    margin:0 0 9px; padding-bottom:5px; border-bottom:1px solid ${P.border}; }

  .grid { display:flex; flex-wrap:wrap; gap:7px; }
  .cell { flex:1 1 30%; min-width:120px; border:1px solid ${P.border}; border-radius:10px; padding:8px 10px; }
  .cell-l { display:block; font-size:8px; text-transform:uppercase; letter-spacing:1.1px; color:${P.mutedText}; font-weight:700; }
  .cell-v { display:block; font-size:12px; font-weight:700; color:${P.textStrong}; margin-top:2px; }

  .bar-row { margin-bottom:8px; }
  .bar-head { display:flex; justify-content:space-between; font-size:10px; color:${P.text}; margin-bottom:3px; }
  .bar-head b { color:${P.textStrong}; }
  .bar { height:7px; border-radius:99px; background:${P.primarySoft}; overflow:hidden; }
  .bar i { display:block; height:100%; border-radius:99px; background:${P.primary}; }

  ol.tips { margin:0; padding-left:16px; }
  ol.tips li { margin-bottom:5px; }

  .foot { margin-top:22px; padding-top:9px; border-top:1px solid ${P.border}; font-size:8.5px; color:${P.mutedText}; line-height:1.5; }
</style></head><body>
  <header class="brand">
    <div><p class="kicker">AI Studio Report</p><h1>Face Shape Lab</h1></div>
    <div class="meta">${esc(titleCase(kind))} analysis<br/>${esc(generated)}</div>
  </header>

  <div class="hero">
    <div class="headline">
      <div class="cap">${esc(head.caption)}</div>
      <div class="val">${esc(head.value)}</div>
      <div class="sub">Generated from a single photo using on-device landmark detection and server-side analysis.</div>
    </div>
    <div class="stats">${statCards(result)}</div>
  </div>

  ${figure}
  ${detailSections(kind, result)}
  ${tips.length ? section('Recommendations', `<ol class="tips">${tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`) : ''}

  <footer class="foot">
    Face Shape Lab provides styling guidance only. Results are estimates derived from image analysis and are not a
    medical, biometric, or identity assessment. Accuracy varies with lighting, angle, and image quality.
  </footer>
</body></html>`;
}
