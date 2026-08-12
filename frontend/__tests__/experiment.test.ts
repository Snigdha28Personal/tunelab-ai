import { describe, it, expect } from "vitest";
import { analyzeDatasetApi } from "../lib/api";

describe("Frontend API & Metrics Helper Tests", () => {
  it("should calculate dataset analysis correctly via client fallback", async () => {
    const examples = [
      { id: 1, input_text: "I was double charged.", label: "billing" },
      { id: 2, input_text: "Cannot reset password.", label: "authentication" },
      { id: 3, input_text: "App crashes on export.", label: "technical_issue" },
    ];

    const analysis = await analyzeDatasetApi(examples);
    expect(analysis.total_examples).toBe(3);
    expect(analysis.num_classes).toBe(3);
    expect(analysis.health_score).toBeGreaterThan(0);
    expect(analysis.class_distribution["billing"]).toBe(1);
  });
});
