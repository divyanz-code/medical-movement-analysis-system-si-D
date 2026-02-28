import { describe, expect, it } from "vitest";
import { computeRangeOfMotion } from "../src/domain.js";

describe("computeRangeOfMotion", () => {
  it("computes max minus min", () => {
    expect(
      computeRangeOfMotion({
        videoId: "video_1",
        minAngle: 20,
        maxAngle: 85,
        movementScore: 0.9
      })
    ).toBe(65);
  });
});
