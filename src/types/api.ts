export type FaceShape = 'oval' | 'round' | 'square' | 'rectangle' | 'heart' | 'diamond' | 'triangle';
export type DetectorKind = 'face' | 'nose' | 'eye' | 'lips' | 'age' | 'symmetry';
export type StyleEditRegion = 'hair' | 'glasses' | 'beard' | 'lips' | 'nose';
export interface Landmark { index: number; x: number; y: number }
export interface Box { x: number; y: number; width: number; height: number }
export interface QualityReport { single_face: boolean; front_facing: boolean; lighting: 'poor' | 'fair' | 'good'; blur_score: number; head_pose_score: number; quality_score: number; warnings: string[] }
export interface FeatureTypeResult { type: string; confidence: number; scores: Record<string, number>; measurements: Record<string, number | string>; recommendation: string }
export interface StyleReport {
  scan_id: string; preview_url?: string; face_box?: Box; aligned_face_box?: Box | null; landmarks_count: number; landmarks?: Landmark[]; head_pose?: { yaw: number; pitch: number; roll: number; score: number }; processing_ms: number;
  quality: QualityReport; measurements: Record<string, number>; proportions: Record<string, number>;
  face_shape: { primary_shape: FaceShape; secondary_shape: FaceShape; shape_scores: Record<FaceShape, number>; confidence: number; ranking: FaceShape[]; mixed_shape_summary: string; mixed_shape_analysis?: string[]; measurement_basis?: Record<string, number>; styling_recommendations?: string[] };
  features: { eyes?: FeatureTypeResult; nose?: FeatureTypeResult; lips?: FeatureTypeResult; jawline?: FeatureTypeResult; chin?: FeatureTypeResult; forehead?: FeatureTypeResult; eyes_type: string; eyes_symmetry: number; nose_type: string; lips_type: string; jawline_type: string; chin_type: string; forehead_type: string; ratings: Record<string, { score: number; confidence: number; notes: string[]; recommendation?: string; signals?: Record<string, number | string> }>; characteristics: Record<string, string>; characteristic_confidence?: Record<string, number>; characteristic_signals?: Record<string, Record<string, number | string>> };
  beard: { best_style: string; beard_score: number; clean_shave_score: number; recommended_length: string; tips: string[]; avoid: string[] };
  ai_style?: { summary: string; grooming_tips: string[]; face_balancing_suggestions: string[]; beard_advice: string[]; glasses_advice: string[]; hair_suggestions: string[]; skin_suggestions: string[]; styling_advice: string[]; source: string } | null;
  glasses: { recommended_frames: string[]; sunglasses: string[]; frame_width: string; avoid: string[] };
  grooming_tips: string[]; products: Array<{ category: string; name: string; reason: string; tags: string[] }>;
}
export interface FeatureAnalysisResponse { primary_type: string; confidence: number; type_scores: Array<{ type: string; score: number }>; landmarks: Landmark[]; geometry: Record<string, number>; traits: Array<{ label: string; value: string; confidence: number; evidence: Record<string, number | string> }>; recommendations: string[]; quality: QualityReport; processing_ms: number }
export interface NoseAnalysisResponse extends FeatureAnalysisResponse { nose_box: Box }
export interface LipsAnalysisResponse extends FeatureAnalysisResponse { lips_box: Box }
export interface EyeAnalysisResponse extends FeatureAnalysisResponse { eye_boxes: { left: Box; right: Box; combined: Box } }
export interface AgeAnalysisResponse { apparent_age: number; age_range: string; confidence: number; model_source: 'opencv_dnn' | 'cv_landmark_estimator'; range_scores: Array<{ range: string; score: number }>; face_box: Box; landmarks: Landmark[]; signals: Array<{ label: string; value: number | string; confidence: number; evidence: Record<string, number | string> }>; recommendations: string[]; quality: QualityReport; processing_ms: number }
export interface SymmetryAnalysisResponse { symmetry_score: number; symmetry_level: 'High' | 'Moderate' | 'Low'; confidence: number; face_box: Box; centerline: Landmark[]; landmarks: Landmark[]; geometry: Record<string, number>; regions: Array<{ region: string; score: number; delta_ratio: number; confidence: number; evidence: Record<string, number | string> }>; recommendations: string[]; quality: QualityReport; processing_ms: number }
export interface AuthUser { id: string; name: string; email: string; plan: string; role: string }
export interface AuthResponse { access_token: string; refresh_token?: string; token_type: 'bearer'; user: AuthUser }
export interface ScanSummary { id: string; status: string; image_url: string | null; face_shape: string | null; confidence: number | null; error_message: string | null; created_at: string }
export interface ScanDetail extends ScanSummary { report: StyleReport | null }
export interface FavoriteStyle { id: string; scan_id: string | null; category: string; title: string; notes: string | null; payload_json: Record<string, unknown>; created_at: string }
export interface SubscriptionPublic { id: string | null; plan: string; status: string; provider: string; current_period_end: string | null }
export interface ScanComparison { scan_ids: string[]; face_shapes: Record<string, string | null>; confidence_delta: number | null; measurement_delta: Record<string, number>; beard_score_delta: number | null; glasses_delta: Record<string, string[]> }
export interface AdminAnalytics { users_count: number; scans_count: number; completed_scans_count: number; failed_scans_count: number; products_count: number; subscriptions_by_plan: Record<string, number>; scans_by_shape: Record<string, number>; featured_products_count: number }
export interface AdminUser extends AuthUser { created_at: string; scans_count: number }
export interface ProductPublic { id: string; name: string; category: string; image_url: string | null; price: number | null; affiliate_link: string | null; affiliate_network: string | null; commission_rate: number | null; is_featured: boolean; suitable_face_shapes_json: string[]; tags_json: string[] }
export interface AdminReport { scan: ScanSummary; user: AuthUser; has_report: boolean }
export interface ImageReuseMatch { scan_id: string | null; image_url: string | null; source: string; owner_scope: 'current_user' | 'private_internal'; similarity: number; match_type: 'exact_or_resized' | 'near_duplicate' | 'similar_image'; created_at: string }
export interface ExternalImageMatch { provider: string; title: string; url: string; source: string; thumbnail_url: string | null; image_url: string | null; match_type: 'exact_match' | 'visual_match'; position: number }
export interface ImageReuseReport { query_hashes: Record<string, string>; internal_matches: ImageReuseMatch[]; external_matches: ExternalImageMatch[]; external_provider: string; external_status: 'disabled' | 'not_configured' | 'missing_api_key' | 'provider_error' | 'success'; identity_matching: 'disabled'; notes: string[] }
export interface StyleEditResponse { image_base64: string; mime_type: string; provider: string; model: string; region: StyleEditRegion }
