import { apiClient } from './apiClient';
import { imageToFormData, type ImageAsset } from '@/utils/formData';
import type { AdminAnalytics, AdminReport, AdminUser, AgeAnalysisResponse, AuthResponse, EyeAnalysisResponse, FavoriteStyle, ImageReuseReport, LipsAnalysisResponse, NoseAnalysisResponse, ProductPublic, ScanComparison, ScanDetail, ScanSummary, StyleEditRegion, StyleEditResponse, StyleReport, SubscriptionPublic, SymmetryAnalysisResponse } from '@/types/api';
async function postImage<T>(url: string, asset: ImageAsset): Promise<T> { const response = await apiClient.post<T>(url, imageToFormData(asset), { headers: { 'Content-Type': 'multipart/form-data' } }); return response.data; }
function styleEditForm(asset: ImageAsset, region: StyleEditRegion, instruction: string): FormData { const form = imageToFormData(asset); form.append('region', region); form.append('instruction', instruction); return form; }
export const facefitApi = {
  analyzeFace: (asset: ImageAsset) => postImage<StyleReport>('/api/analyze-face', asset),
  analyzeNose: (asset: ImageAsset) => postImage<NoseAnalysisResponse>('/api/analyze-nose', asset),
  analyzeEye: (asset: ImageAsset) => postImage<EyeAnalysisResponse>('/api/analyze-eye', asset),
  analyzeLips: (asset: ImageAsset) => postImage<LipsAnalysisResponse>('/api/analyze-lips', asset),
  analyzeAge: (asset: ImageAsset) => postImage<AgeAnalysisResponse>('/api/analyze-age', asset),
  analyzeSymmetry: (asset: ImageAsset) => postImage<SymmetryAnalysisResponse>('/api/analyze-symmetry', asset),
  login: async (payload: { email: string; password: string }) => (await apiClient.post<AuthResponse>('/auth/login', payload)).data,
  register: async (payload: { name: string; email: string; password: string }) => (await apiClient.post<AuthResponse>('/auth/register', payload)).data,
  forgotPassword: async (email: string) => (await apiClient.post<{ message: string }>('/auth/forgot-password', { email })).data,
  uploadProtectedScan: (asset: ImageAsset) => postImage<{ scan_id: string; status: string; image_url: string | null }>('/api/scans/upload', asset),
  getScanHistory: async () => (await apiClient.get<ScanSummary[]>('/api/scans/history')).data,
  getScan: async (scanId: string) => (await apiClient.get<ScanDetail>(`/api/scans/${scanId}`)).data,
  downloadReport: async (scanId: string) => (await apiClient.get<ArrayBuffer>(`/api/scans/${scanId}/report/download`, { responseType: 'arraybuffer' })).data,
  scanImageReuse: (asset: ImageAsset) => postImage<ImageReuseReport>('/api/privacy/image-reuse', asset),
  compareScans: async (scanIds: string[]) => (await apiClient.get<ScanComparison>('/api/scans/compare', { params: { scan_ids: scanIds } })).data,
  getFavorites: async () => (await apiClient.get<FavoriteStyle[]>('/api/favorites')).data,
  createFavorite: async (payload: { scan_id?: string | null; category: string; title: string; notes?: string | null; payload_json?: Record<string, unknown> }) => (await apiClient.post<FavoriteStyle>('/api/favorites', payload)).data,
  getSubscription: async () => (await apiClient.get<SubscriptionPublic>('/api/subscription')).data,
  changePlan: async (plan: 'free' | 'pro' | 'business') => (await apiClient.post<{ message: string }>('/api/billing/checkout', { plan })).data,
  adminAnalytics: async () => (await apiClient.get<AdminAnalytics>('/api/admin/analytics')).data,
  adminUsers: async () => (await apiClient.get<AdminUser[]>('/api/admin/users')).data,
  adminReports: async () => (await apiClient.get<AdminReport[]>('/api/admin/reports')).data,
  adminProducts: async () => (await apiClient.get<ProductPublic[]>('/api/admin/products')).data,
  adminCreateProduct: async (payload: Partial<ProductPublic> & { name: string; category: string }) => (await apiClient.post<ProductPublic>('/api/admin/products', payload)).data,
  adminFeatureProduct: async (productId: string) => (await apiClient.post<ProductPublic>(`/api/admin/products/${productId}/feature`)).data,
  generateStyleEdit: async (payload: { asset: ImageAsset; region: StyleEditRegion; instruction: string }) => (await apiClient.post<StyleEditResponse>('/api/style/edit-image', styleEditForm(payload.asset, payload.region, payload.instruction), { headers: { 'Content-Type': 'multipart/form-data' } })).data,
};
