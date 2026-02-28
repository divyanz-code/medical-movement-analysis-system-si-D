import type { MobileApi } from "../api/mobileApi.js";
import type { TokenStore } from "../storage/tokenStore.js";
import { computeRangeOfMotion, isAnalysisTerminal } from "../types/domain.js";
import type {
  AnalysisItem,
  Profile,
  ProfileUpdateRequest,
  RegisterRequest,
  VideoUploadRequest
} from "../types/contracts.js";

export interface PollOptions {
  maxAttempts?: number;
  delayMs?: number;
}

export class PatientFlowService {
  constructor(
    private readonly api: MobileApi,
    private readonly tokenStore: TokenStore
  ) {}

  async registerAndLogin(payload: RegisterRequest & { password: string }): Promise<void> {
    await this.api.register(payload);
    const login = await this.api.login({ email: payload.email, password: payload.password });
    await this.tokenStore.setToken(login.access_token);
  }

  async getProfile(): Promise<Profile> {
    const token = await this.requireToken();
    return this.api.getProfile(token);
  }

  async updateProfile(payload: ProfileUpdateRequest): Promise<Profile> {
    const token = await this.requireToken();
    return this.api.updateProfile(token, payload);
  }

  async uploadRecordedVideo(
    payload: VideoUploadRequest
  ): Promise<{ videoId: number; status: AnalysisItem["status"] }> {
    if (payload.durationSeconds < 5 || payload.durationSeconds > 15) {
      throw new Error("INVALID_DURATION: Recording must be 5 to 15 seconds");
    }

    const token = await this.requireToken();
    const upload = await this.api.uploadVideo(token, payload);
    return { videoId: upload.video_id, status: upload.status };
  }

  async pollAnalysis(videoId: number, options: PollOptions = {}): Promise<AnalysisItem> {
    const token = await this.requireToken();
    const maxAttempts = options.maxAttempts ?? 20;
    const delayMs = options.delayMs ?? 200;

    let latest: AnalysisItem | null = null;
    for (let index = 0; index < maxAttempts; index += 1) {
      latest = await this.api.getAnalysis(token, videoId);
      if (isAnalysisTerminal(latest.status)) {
        if (
          latest.status === "SUCCEEDED" &&
          latest.min_angle !== null &&
          latest.max_angle !== null
        ) {
          latest.range_of_motion = computeRangeOfMotion(latest.min_angle, latest.max_angle);
        }
        return latest;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    if (latest !== null) {
      return latest;
    }

    throw new Error("ANALYSIS_TIMEOUT: analysis polling timed out");
  }

  async getHistory(): Promise<AnalysisItem[]> {
    const token = await this.requireToken();
    const response = await this.api.getAnalysisHistory(token);
    return response.items;
  }

  private async requireToken(): Promise<string> {
    const token = await this.tokenStore.getToken();
    if (!token) {
      throw new Error("AUTH_REQUIRED: Please login first");
    }
    return token;
  }
}
