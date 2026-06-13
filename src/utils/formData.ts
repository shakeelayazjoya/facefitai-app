export interface ImageAsset {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
  width?: number | null;
  height?: number | null;
}

export function imageToFormData(asset: ImageAsset, fieldName = 'image'): FormData {
  const form = new FormData();
  const name = asset.fileName ?? `face-scan-${Date.now()}.jpg`;
  const type = asset.mimeType ?? 'image/jpeg';
  form.append(fieldName, { uri: asset.uri, name, type } as unknown as Blob);
  return form;
}

export function labelize(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());
}
