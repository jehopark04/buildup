export const CONTACT_MESSAGE_MIN_LENGTH = 10;
export const CONTACT_MESSAGE_MAX_LENGTH = 3000;
export const CONTACT_PAYLOAD_MAX_BYTES = 8_192;

export type ContactConfig = {
  apiKey: string;
  toEmail: string;
  fromEmail: string;
};

type ContactEnv = Record<string, string | undefined>;

type ValidContactSubmission = {
  message: string;
  company: string;
};

type ContactValidationResult =
  | {
      ok: true;
      value: ValidContactSubmission;
    }
  | {
      ok: false;
      error: string;
      status: number;
    };

function getTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactSubmission(input: unknown): ContactValidationResult {
  if (!input || typeof input !== "object") {
    return {
      ok: false,
      error: "문의 내용을 확인할 수 없습니다.",
      status: 400,
    };
  }

  const payload = input as Record<string, unknown>;
  const message = getTrimmedString(payload.message);
  const company = getTrimmedString(payload.company);

  if (message.length < CONTACT_MESSAGE_MIN_LENGTH) {
    return {
      ok: false,
      error: "문의 내용은 10자 이상 적어주세요.",
      status: 400,
    };
  }

  if (message.length > CONTACT_MESSAGE_MAX_LENGTH) {
    return {
      ok: false,
      error: "문의 내용은 3000자 이하로 적어주세요.",
      status: 400,
    };
  }

  return {
    ok: true,
    value: {
      message,
      company,
    },
  };
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildContactEmail(message: string, submittedAt = new Date()) {
  const escapedMessage = escapeHtml(message).replaceAll("\n", "<br />");
  const submittedAtLabel = submittedAt.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });

  return {
    subject: `BUILDUP 문의 ${submittedAtLabel}`,
    submittedAtLabel,
    text: [
      "BUILDUP 문의가 도착했습니다.",
      "",
      `접수 시각: ${submittedAtLabel}`,
      "",
      "[문의 내용]",
      message,
    ].join("\n"),
    html: [
      "<div style=\"font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; line-height: 1.7; color: #121826;\">",
      "<p style=\"margin: 0 0 16px; font-size: 18px; font-weight: 700;\">BUILDUP 문의가 도착했습니다.</p>",
      `<p style=\"margin: 0 0 16px; font-size: 14px; color: #677489;\">접수 시각: ${escapeHtml(submittedAtLabel)}</p>`,
      "<div style=\"padding: 20px; border: 1px solid rgba(18, 24, 38, 0.08); border-radius: 18px; background: #f7f9fc;\">",
      `<p style=\"margin: 0; white-space: normal;\">${escapedMessage}</p>`,
      "</div>",
      "</div>",
    ].join(""),
  };
}

export function getContactConfig(env: ContactEnv = process.env): ContactConfig | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const toEmail = env.CONTACT_TO_EMAIL?.trim();
  const fromEmail = env.CONTACT_FROM_EMAIL?.trim();

  if (!apiKey || !toEmail || !fromEmail) {
    return null;
  }

  return {
    apiKey,
    toEmail,
    fromEmail,
  };
}
