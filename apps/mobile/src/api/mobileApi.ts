import type {
  AnalysisHistoryResponse,
  AnalysisItem,
  LoginRequest,
  LoginResponse,
  Profile,
  ProfileUpdateRequest,
  RegisterRequest,
  RegisterResponse,
  VideoUploadRequest,
  VideoUploadResponse
} from "../types/contracts";
import type { HttpClient } from "./httpClient";

export interface MobileApi {
  register(payload: RegisterRequest): Promise<RegisterResponse>;
  login(payload: LoginRequest): Promise<LoginResponse>;
  getProfile(token: string): Promise<Profile>;
  updateProfile(token: string, payload: ProfileUpdateRequest): Promise<Profile>;
  uploadVideo(token: string, payload: VideoUploadRequest): Promise<VideoUploadResponse>;
  getAnalysis(token: string, videoId: number): Promise<AnalysisItem>;
  getAnalysisHistory(token: string): Promise<AnalysisHistoryResponse>;
}

export class BackendMobileApi implements MobileApi {
  constructor(private readonly http: HttpClient) {}

  register(payload: RegisterRequest): Promise<RegisterResponse> {
    return this.http.request<RegisterResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  login(payload: LoginRequest): Promise<LoginResponse> {
    return this.http.request<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  getProfile(token: string): Promise<Profile> {
    return this.http.request<Profile>("/api/v1/profile", { method: "GET" }, { authToken: token });
  }

  updateProfile(token: string, payload: ProfileUpdateRequest): Promise<Profile> {
    return this.http.request<Profile>(
      "/api/v1/profile",
      { method: "PUT", body: JSON.stringify(payload) },
      { authToken: token }
    );
  }

  uploadVideo(token: string, payload: VideoUploadRequest): Promise<VideoUploadResponse> {
    const formData = new FormData();
    formData.append("duration_seconds", String(payload.durationSeconds));
    formData.append("video", payload.video, payload.fileName);

    return this.http.request<VideoUploadResponse>(
      "/api/v1/videos",
      { method: "POST", body: formData },
      { authToken: token, isMultipart: true }
    );
  }

  getAnalysis(token: string, videoId: number): Promise<AnalysisItem> {
    return this.http.request<AnalysisItem>(
      `/api/v1/analysis/${videoId}`,
      { method: "GET" },
      { authToken: token }
    );
  }

  getAnalysisHistory(token: string): Promise<AnalysisHistoryResponse> {
    return this.http.request<AnalysisHistoryResponse>(
      "/api/v1/analysis/history",
      { method: "GET" },
      { authToken: token }
    );
  }
}
