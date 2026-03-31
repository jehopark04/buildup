import { describe, expect, it } from "vitest";
import { activityCatalog } from "@/lib/activities";

describe("activity catalog", () => {
  it("loads the validated catalog", () => {
    expect(activityCatalog.length).toBeGreaterThan(0);
  });
});
