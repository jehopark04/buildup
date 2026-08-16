import { buildContactEmail, type ContactConfig } from "@/lib/contact";

export const CONTACT_DELIVERY_TIMEOUT_MS = 5_000;
export const CONTACT_DELIVERY_MAX_ATTEMPTS = 2;
const CONTACT_DELIVERY_RETRY_DELAY_MS = 250;

type ContactEmail = ReturnType<typeof buildContactEmail>;
type FetchLike = typeof fetch;

type ContactDeliveryArgs = {
  config: ContactConfig;
  email: ContactEmail;
  requestId: string;
  fetchImpl?: FetchLike;
  maxAttempts?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
  wait?: (durationMs: number) => Promise<void>;
};

export class ContactDeliveryError extends Error {
  attempts: number;
  code: "network" | "provider" | "timeout";
  detail: string;
  providerStatus?: number;

  constructor(args: {
    attempts: number;
    code: "network" | "provider" | "timeout";
    detail?: string;
    message: string;
    providerStatus?: number;
  }) {
    super(args.message);
    this.name = "ContactDeliveryError";
    Object.setPrototypeOf(this, ContactDeliveryError.prototype);
    this.attempts = args.attempts;
    this.code = args.code;
    this.detail = args.detail ?? "";
    this.providerStatus = args.providerStatus;
  }
}

function sleep(durationMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

function getRetryDelayMs(retryDelayMs: number, attempt: number) {
  return retryDelayMs * attempt;
}

async function getResponseDetail(response: Response) {
  try {
    const payload = (await response.json()) as {
      message?: string;
      error?: string;
    };

    return payload.message ?? payload.error ?? "";
  } catch {
    return "";
  }
}

export async function sendContactEmail({
  config,
  email,
  requestId,
  fetchImpl = fetch,
  maxAttempts = CONTACT_DELIVERY_MAX_ATTEMPTS,
  retryDelayMs = CONTACT_DELIVERY_RETRY_DELAY_MS,
  timeoutMs = CONTACT_DELIVERY_TIMEOUT_MS,
  wait = sleep,
}: ContactDeliveryArgs) {
  const idempotencyKey = crypto.randomUUID();

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchImpl("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
          "User-Agent": "buildup-contact/1.0",
          "X-Request-Id": requestId,
        },
        body: JSON.stringify({
          from: config.fromEmail,
          to: [config.toEmail],
          subject: email.subject,
          text: email.text,
          html: email.html,
        }),
        signal: controller.signal,
      });

      if (response.ok) {
        return {
          attempts: attempt,
          response,
        };
      }

      if (response.status >= 500 && attempt < maxAttempts) {
        await wait(getRetryDelayMs(retryDelayMs, attempt));
        continue;
      }

      throw new ContactDeliveryError({
        attempts: attempt,
        code: "provider",
        detail: await getResponseDetail(response),
        message: "The email provider rejected the contact delivery request.",
        providerStatus: response.status,
      });
    } catch (error) {
      if (error instanceof ContactDeliveryError) {
        throw error;
      }

      const aborted = isAbortError(error);

      if (attempt < maxAttempts) {
        await wait(getRetryDelayMs(retryDelayMs, attempt));
        continue;
      }

      throw new ContactDeliveryError({
        attempts: attempt,
        code: aborted ? "timeout" : "network",
        message: aborted
          ? "The contact delivery request timed out."
          : "The contact delivery request failed due to a network error.",
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw new ContactDeliveryError({
    attempts: maxAttempts,
    code: "network",
    message: "The contact delivery request exhausted all retry attempts.",
  });
}
