import { describe, expect, it, vi } from "vitest";

import { PatientFlowService } from "../src/flows/patientFlow";
import { InMemoryTokenStore } from "../src/storage/tokenStore";
import type { AnalysisItem, MobileApi } from "../src/index";

function buildApiMock(overrides: Partial<MobileApi> = {}): MobileApi {
  return {
    register: vi
      .fn()
      .mockResolvedValue({ user: { id: 1, name: "A", email: "a@x.com", role: "patient" } }),
    login: vi
      .fn()
      .mockResolvedValue({ access_token: "jwt-token", token_type: "bearer", expires_in: 3600 }),
    getProfile: vi.fn().mockResolvedValue({
      name: "A",
      email: "a@x.com",
      age: null,
      gender: null,
      affected_limb: null
    }),
    updateProfile: vi.fn().mockResolvedValue({
      name: "A",
      email: "a@x.com",
      age: 27,
      gender: "male",
      affected_limb: "right_knee"
    }),
    uploadVideo: vi.fn().mockResolvedValue({ video_id: 10, status: "PENDING" }),
    getAnalysis: vi.fn().mockResolvedValue({
      video_id: 10,
      analysis_type: "movement",
      status: "SUCCEEDED",
      min_angle: 21,
      max_angle: 88,
      range_of_motion: null,
      movement_score: 0.83,
      expression_summary: null,
      error_code: null,
      error_message: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }),
    getAnalysisHistory: vi.fn().mockResolvedValue({ items: [] }),
    ...overrides
  };
}

describe("PatientFlowService", () => {
  it("completes register-login-profile-update-upload-analysis flow", async () => {
    const api = buildApiMock();
    const flow = new PatientFlowService(api, new InMemoryTokenStore());

    await flow.registerAndLogin({ name: "A", email: "a@x.com", password: "Password123!" });
    const profile = await flow.updateProfile({
      age: 27,
      gender: "male",
      affected_limb: "right_knee"
    });
    const upload = await flow.uploadRecordedVideo({
      video: new Blob(["video"]),
      fileName: "knee.mp4",
      mimeType: "video/mp4",
      durationSeconds: 10
    });
    const analysis = await flow.pollAnalysis(upload.videoId, { maxAttempts: 1, delayMs: 0 });

    expect(profile.affected_limb).toBe("right_knee");
    expect(upload.videoId).toBe(10);
    expect(analysis.status).toBe("SUCCEEDED");
    expect(analysis.range_of_motion).toBe(67);
  });

  it("rejects out-of-range duration before API call", async () => {
    const api = buildApiMock();
    const flow = new PatientFlowService(api, new InMemoryTokenStore());
    await flow.registerAndLogin({ name: "A", email: "a@x.com", password: "Password123!" });

    await expect(
      flow.uploadRecordedVideo({
        video: new Blob(["video"]),
        fileName: "knee.mp4",
        mimeType: "video/mp4",
        durationSeconds: 3
      })
    ).rejects.toThrow("INVALID_DURATION");

    expect(api.uploadVideo).not.toHaveBeenCalled();
  });

  it("handles polling progression until terminal state", async () => {
    const states: AnalysisItem[] = [
      {
        video_id: 10,
        analysis_type: "movement",
        status: "PENDING",
        min_angle: null,
        max_angle: null,
        range_of_motion: null,
        movement_score: null,
        expression_summary: null,
        error_code: null,
        error_message: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        video_id: 10,
        analysis_type: "movement",
        status: "PROCESSING",
        min_angle: null,
        max_angle: null,
        range_of_motion: null,
        movement_score: null,
        expression_summary: null,
        error_code: null,
        error_message: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        video_id: 10,
        analysis_type: "movement",
        status: "FAILED",
        min_angle: null,
        max_angle: null,
        range_of_motion: null,
        movement_score: null,
        expression_summary: null,
        error_code: "ANALYSIS_PROCESSING_FAILED",
        error_message: "Failed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const api = buildApiMock({
      getAnalysis: vi
        .fn()
        .mockResolvedValueOnce(states[0])
        .mockResolvedValueOnce(states[1])
        .mockResolvedValueOnce(states[2])
    });

    const flow = new PatientFlowService(api, new InMemoryTokenStore());
    await flow.registerAndLogin({ name: "A", email: "a@x.com", password: "Password123!" });

    const result = await flow.pollAnalysis(10, { maxAttempts: 3, delayMs: 0 });
    expect(result.status).toBe("FAILED");
    expect(api.getAnalysis).toHaveBeenCalledTimes(3);
  });
});
