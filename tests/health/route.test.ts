import { describe, expect, it } from "vitest";
import { GET, HEAD } from "../../app/api/health/route";

describe("health route", () => {
  it("returns an uncached ok response when the activity catalog is loaded", async () => {
    const response = await GET();
    const payload = (await response.json()) as {
      ok: boolean;
      status: string;
      service: string;
      timestamp: string;
      checks: {
        activityCatalog: string;
      };
    };

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store, max-age=0");
    expect(payload).toMatchObject({
      ok: true,
      status: "ok",
      service: "buildup",
      checks: {
        activityCatalog: "ok",
      },
    });
    expect(Number.isNaN(Date.parse(payload.timestamp))).toBe(false);
  });

  it("returns a matching HEAD response for uptime probes", async () => {
    const response = await HEAD();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store, max-age=0");
    expect(await response.text()).toBe("");
  });
});
