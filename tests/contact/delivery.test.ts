import { describe, expect, it, vi } from "vitest";
import { buildContactEmail } from "@/lib/contact";
import {
  ContactDeliveryError,
  sendContactEmail,
} from "@/lib/contact-delivery";

const contactConfig = {
  apiKey: "re_test_key",
  toEmail: "owner@example.com",
  fromEmail: "BUILDUP <no-reply@example.com>",
};

describe("contact delivery", () => {
  it("retries transient network failures and eventually succeeds", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("socket hang up"))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "ok" }), { status: 200 }));
    const wait = vi.fn().mockResolvedValue(undefined);

    const result = await sendContactEmail({
      config: contactConfig,
      email: buildContactEmail("문의 내용을 충분히 길게 적었습니다."),
      requestId: "req_123",
      fetchImpl: fetchMock,
      wait,
    });

    expect(result.attempts).toBe(2);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(wait).toHaveBeenCalledTimes(1);
  });

  it("does not retry provider 4xx responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "forbidden" }), { status: 403 }),
    );

    await expect(
      sendContactEmail({
        config: contactConfig,
        email: buildContactEmail("문의 내용을 충분히 길게 적었습니다."),
        requestId: "req_123",
        fetchImpl: fetchMock,
      }),
    ).rejects.toMatchObject({
      attempts: 1,
      code: "provider",
      detail: "forbidden",
      providerStatus: 403,
    } satisfies Partial<ContactDeliveryError>);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
