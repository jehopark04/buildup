import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetContactRateLimitForTest } from "@/lib/contact-rate-limit";
import { POST } from "../../app/api/contact/route";

describe("contact route", () => {
  beforeEach(() => {
    resetContactRateLimitForTest();
    vi.restoreAllMocks();
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_TO_EMAIL;
    delete process.env.CONTACT_FROM_EMAIL;
  });

  it("returns 503 when email config is missing", async () => {
    const response = await POST(
      new Request("https://buildup.test/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "https://buildup.test",
          host: "buildup.test",
        },
        body: JSON.stringify({
          message: "문의 내용을 충분히 길게 적었습니다.",
          company: "",
        }),
      }) as never,
    );

    expect(response.status).toBe(503);
  });

  it("sends email with resend when config is present", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.CONTACT_TO_EMAIL = "owner@example.com";
    process.env.CONTACT_FROM_EMAIL = "BUILDUP <no-reply@example.com>";

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: "email_123" }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      new Request("https://buildup.test/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "https://buildup.test",
          host: "buildup.test",
          "x-forwarded-for": "127.0.0.1",
        },
        body: JSON.stringify({
          message: "문의 내용을 충분히 길게 적었습니다.",
          company: "",
        }),
      }) as never,
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("rejects cross-origin submissions", async () => {
    const response = await POST(
      new Request("https://buildup.test/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "https://evil.test",
          host: "buildup.test",
        },
        body: JSON.stringify({
          message: "문의 내용을 충분히 길게 적었습니다.",
          company: "",
        }),
      }) as never,
    );

    expect(response.status).toBe(403);
  });

  it("rate limits repeated contact submissions", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.CONTACT_TO_EMAIL = "owner@example.com";
    process.env.CONTACT_FROM_EMAIL = "BUILDUP <no-reply@example.com>";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "ok" }), { status: 200 })),
    );

    const request = () =>
      POST(
        new Request("https://buildup.test/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            origin: "https://buildup.test",
            host: "buildup.test",
            "x-forwarded-for": "127.0.0.1",
          },
          body: JSON.stringify({
            message: "문의 내용을 충분히 길게 적었습니다.",
            company: "",
          }),
        }) as never,
      );

    expect((await request()).status).toBe(200);
    expect((await request()).status).toBe(200);
    expect((await request()).status).toBe(200);
    expect((await request()).status).toBe(429);
  });
});
