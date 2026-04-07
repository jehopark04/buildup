import { describe, expect, it } from "vitest";
import {
  buildContactEmail,
  escapeHtml,
  getContactConfig,
  validateContactSubmission,
} from "@/lib/contact";

describe("contact helpers", () => {
  it("validates a normal contact message", () => {
    const validation = validateContactSubmission({
      message: "문의드립니다. 이 기능이 정말 좋아요.",
      company: "",
    });

    expect(validation).toEqual({
      ok: true,
      value: {
        message: "문의드립니다. 이 기능이 정말 좋아요.",
        company: "",
      },
    });
  });

  it("rejects messages that are too short", () => {
    const validation = validateContactSubmission({
      message: "짧음",
    });

    expect(validation).toEqual({
      ok: false,
      error: "문의 내용은 10자 이상 적어주세요.",
      status: 400,
    });
  });

  it("escapes html when building email markup", () => {
    const email = buildContactEmail("<script>alert(1)</script>");

    expect(email.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(email.html).not.toContain("<script>alert(1)</script>");
    expect(email.text).toContain("<script>alert(1)</script>");
  });

  it("returns null when contact config is missing", () => {
    expect(
      getContactConfig({
        RESEND_API_KEY: "",
        CONTACT_TO_EMAIL: "",
        CONTACT_FROM_EMAIL: "",
      }),
    ).toBeNull();
  });

  it("escapes raw html entities", () => {
    expect(escapeHtml(`Tom & "<Jerry>"`)).toBe("Tom &amp; &quot;&lt;Jerry&gt;&quot;");
  });
});
