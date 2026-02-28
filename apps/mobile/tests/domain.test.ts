import { describe, expect, it } from "vitest";
import { computeRangeOfMotion } from "../src/domain.js";

describe("computeRangeOfMotion", () => {
  it("computes max minus min", () => {
    expect(computeRangeOfMotion(20, 85)).toBe(65);
  });
});
