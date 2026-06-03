export type UserRole = "patient";

export type AnalysisType = "movement" | "facial_expression";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
}

export interface Profile {
  name: string;
  email: string;
  age: number | null;
  gender: string | null;
  affected_limb: string | null;
}

export interface ProfileUpdateRequest {
  age: number;
  gender: string;
  affected_limb: string;
}

export interface VideoUploadRequest {
  video: Blob;
  fileName: string;
  mimeType: string;
  durationSeconds: number;
  analysisType?: AnalysisType;
}

export interface VideoUploadResponse {
  video_id: number;
  status: "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED";
}

export interface ExpressionScore {
  min: number;
  max: number;
  mean: number;
  peak: number;
}

export interface ExpressionSummary {
  [expressionName: string]: ExpressionScore;
}

export interface AnalysisItem {
  video_id: number;
  analysis_type: AnalysisType;
  status: "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED";
  min_angle: number | null;
  max_angle: number | null;
  range_of_motion: number | null;
  movement_score: number | null;
  expression_summary: ExpressionSummary | null;
  landmark_image_base64?: string | null;
  calibration_frame_base64?: string | null;
  success_frame_base64?: string | null;
  tracking_frame_base64?: string | null;
  per_frame_blendshapes?: Record<string, number>[] | null;
  error_code: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalysisHistoryResponse {
  items: AnalysisItem[];
}

export interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    request_id: string;
  };
}

