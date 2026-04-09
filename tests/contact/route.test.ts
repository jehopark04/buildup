import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetContactRateLimitForTest } from "@/lib/contact-rate-limit";
import { POST } from "../../app/api/contact/route";

describe("contact route", () => {
  beforeEach(() => {
    resetContactRateLimitForTest();
    vi.restoreAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
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
    expect(response.headers.get("X-Request-Id")).toBeTruthy();
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
    expect(response.headers.get("X-Request-Id")).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("returns resend delivery error details when the provider rejects the send", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.CONTACT_TO_EMAIL = "owner@example.com";
    process.env.CONTACT_FROM_EMAIL = "BUILDUP <onboarding@resend.dev>";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Test emails can only be sent to your own address." }), {
          status: 403,
        }),
      ),
    );

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

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: "Test emails can only be sent to your own address.",
    });
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
    expect(response.headers.get("X-Request-Id")).toBeTruthy();
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

  it("retries once when the email provider returns a 5xx response", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.CONTACT_TO_EMAIL = "owner@example.com";
    process.env.CONTACT_FROM_EMAIL = "BUILDUP <no-reply@example.com>";

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "temporary outage" }), { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "ok" }), { status: 200 }));
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
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("returns 504 after timeout failures exhaust retries", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.CONTACT_TO_EMAIL = "owner@example.com";
    process.env.CONTACT_FROM_EMAIL = "BUILDUP <no-reply@example.com>";

    const timeoutError = new Error("timed out");
    timeoutError.name = "AbortError";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(timeoutError));

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

    expect(response.status).toBe(504);
    expect(await response.json()).toEqual({
      error: "문의 전송이 지연되고 있습니다. 잠시 후 다시 시도해주세요.",
    });
  });
});
