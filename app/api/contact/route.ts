import type { NextRequest } from "next/server";
import {
  buildContactEmail,
  CONTACT_PAYLOAD_MAX_BYTES,
  getContactConfig,
  validateContactSubmission,
} from "@/lib/contact";
import { ContactDeliveryError, sendContactEmail } from "@/lib/contact-delivery";
import { takeContactRateLimitSlot } from "@/lib/contact-rate-limit";
import { logError, logInfo, logWarn } from "@/lib/server-log";

export const runtime = "nodejs";

const contactRoute = "/api/contact";

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

function getRequestId(request: NextRequest) {
  const requestId =
    request.headers.get("x-request-id")?.trim() ||
    request.headers.get("x-vercel-id")?.trim();

  return requestId || crypto.randomUUID();
}

function getDurationMs(startedAt: number) {
  return Date.now() - startedAt;
}

function createResponseHeaders(requestId: string) {
  return {
    "X-Request-Id": requestId,
  };
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  requestId: string,
) {
  return Response.json(body, {
    status,
    headers: createResponseHeaders(requestId),
  });
}

function logContactFailure(
  event: string,
  args: {
    durationMs: number;
    requestId: string;
    status: number;
  } & Record<string, unknown>,
) {
  logWarn(event, {
    route: contactRoute,
    ...args,
  });
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const requestId = getRequestId(request);

  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      logContactFailure("contact.unsupported_media_type", {
        requestId,
        status: 415,
        durationMs: getDurationMs(startedAt),
        contentType,
      });
      return jsonResponse({ error: "잘못된 요청 형식입니다." }, 415, requestId);
    }

    if (!hasAllowedOrigin(request)) {
      logContactFailure("contact.origin_rejected", {
        requestId,
        status: 403,
        durationMs: getDurationMs(startedAt),
        origin: request.headers.get("origin") ?? "",
        host: request.headers.get("host") ?? "",
      });
      return jsonResponse({ error: "허용되지 않은 요청입니다." }, 403, requestId);
    }

    const contentLength = getContentLength(request);

    if (contentLength !== null && contentLength > CONTACT_PAYLOAD_MAX_BYTES) {
      logContactFailure("contact.payload_too_large", {
        requestId,
        status: 413,
        durationMs: getDurationMs(startedAt),
        contentLength,
      });
      return jsonResponse({ error: "문의 내용이 너무 깁니다." }, 413, requestId);
    }

    const clientIdentifier = getClientIdentifier(request);

    if (!takeContactRateLimitSlot(clientIdentifier)) {
      logContactFailure("contact.rate_limited", {
        requestId,
        status: 429,
        durationMs: getDurationMs(startedAt),
      });
      return jsonResponse({ error: "잠시 후 다시 시도해주세요." }, 429, requestId);
    }

    let payload: unknown;

    try {
      payload = await request.json();
    } catch (error) {
      logContactFailure("contact.invalid_json", {
        requestId,
        status: 400,
        durationMs: getDurationMs(startedAt),
        error,
      });
      return jsonResponse({ error: "문의 내용을 읽을 수 없습니다." }, 400, requestId);
    }

    const validation = validateContactSubmission(payload);

    if (!validation.ok) {
      logContactFailure("contact.validation_failed", {
        requestId,
        status: validation.status,
        durationMs: getDurationMs(startedAt),
      });
      return jsonResponse({ error: validation.error }, validation.status, requestId);
    }

    if (validation.value.company.length > 0) {
      logInfo("contact.honeypot_accepted", {
        route: contactRoute,
        requestId,
        status: 202,
        durationMs: getDurationMs(startedAt),
      });
      return jsonResponse({ ok: true }, 202, requestId);
    }

    const config = getContactConfig();

    if (!config) {
      logError("contact.config_missing", {
        route: contactRoute,
        requestId,
        status: 503,
        durationMs: getDurationMs(startedAt),
      });
      return jsonResponse(
        { error: "문의 메일 설정이 아직 완료되지 않았습니다." },
        503,
        requestId,
      );
    }

    const email = buildContactEmail(validation.value.message);

    try {
      const delivery = await sendContactEmail({
        config,
        email,
        requestId,
      });

      logInfo("contact.delivery_succeeded", {
        route: contactRoute,
        requestId,
        status: 200,
        durationMs: getDurationMs(startedAt),
        attempts: delivery.attempts,
      });
      return jsonResponse({ ok: true }, 200, requestId);
    } catch (error) {
      if (error instanceof ContactDeliveryError) {
        const status = error.code === "timeout" ? 504 : 502;
        const message =
          error.detail ||
          (error.code === "timeout"
            ? "문의 전송이 지연되고 있습니다. 잠시 후 다시 시도해주세요."
            : "문의 전송에 실패했습니다. 메일 발신 설정을 확인한 뒤 다시 시도해주세요.");

        logError("contact.delivery_failed", {
          route: contactRoute,
          requestId,
          status,
          durationMs: getDurationMs(startedAt),
          attempts: error.attempts,
          deliveryCode: error.code,
          providerStatus: error.providerStatus,
          detail: error.detail,
        });
        return jsonResponse({ error: message }, status, requestId);
      }

      throw error;
    }
  } catch (error) {
    logError("contact.unhandled_exception", {
      route: contactRoute,
      requestId,
      status: 500,
      durationMs: getDurationMs(startedAt),
      error,
    });
    return jsonResponse(
      { error: "문의 전송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." },
      500,
      requestId,
    );
  }
}
