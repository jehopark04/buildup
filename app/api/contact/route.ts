import type { NextRequest } from "next/server";
import {
  buildContactEmail,
  CONTACT_PAYLOAD_MAX_BYTES,
  getContactConfig,
  validateContactSubmission,
} from "@/lib/contact";
import { takeContactRateLimitSlot } from "@/lib/contact-rate-limit";

export const runtime = "nodejs";

function getContentLength(request: NextRequest) {
  const value = request.headers.get("content-length");

  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) ? parsed : null;
}

function getClientIdentifier(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "anonymous";
  }

  return request.headers.get("x-real-ip")?.trim() || "anonymous";
}

function hasAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  try {
    const originUrl = new URL(origin);
    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost ?? request.headers.get("host");

    return Boolean(host) && originUrl.host === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return Response.json(
      { error: "잘못된 요청 형식입니다." },
      { status: 415 },
    );
  }

  if (!hasAllowedOrigin(request)) {
    return Response.json(
      { error: "허용되지 않은 요청입니다." },
      { status: 403 },
    );
  }

  const contentLength = getContentLength(request);

  if (contentLength !== null && contentLength > CONTACT_PAYLOAD_MAX_BYTES) {
    return Response.json(
      { error: "문의 내용이 너무 깁니다." },
      { status: 413 },
    );
  }

  const clientIdentifier = getClientIdentifier(request);

  if (!takeContactRateLimitSlot(clientIdentifier)) {
    return Response.json(
      { error: "잠시 후 다시 시도해주세요." },
      { status: 429 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "문의 내용을 읽을 수 없습니다." },
      { status: 400 },
    );
  }

  const validation = validateContactSubmission(payload);

  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: validation.status });
  }

  if (validation.value.company.length > 0) {
    return Response.json({ ok: true }, { status: 202 });
  }

  const config = getContactConfig();

  if (!config) {
    return Response.json(
      { error: "문의 기능이 아직 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const email = buildContactEmail(validation.value.message);
  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({
      from: config.fromEmail,
      to: [config.toEmail],
      subject: email.subject,
      text: email.text,
      html: email.html,
    }),
  });

  if (!resendResponse.ok) {
    return Response.json(
      { error: "문의 전송에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
