const externalHttpProtocols = new Set(["http:", "https:"]);
const activityIdPattern = /^[a-z0-9-]+$/;

export function isSafeExternalHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return externalHttpProtocols.has(url.protocol);
  } catch {
    return false;
  }
}

export function assertSafeExternalHttpUrl(value: string, label: string) {
  if (!isSafeExternalHttpUrl(value)) {
    throw new Error(`${label}: must be a valid absolute http(s) URL`);
  }
}

export function normalizeActivityIdParam(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    return null;
  }

  return activityIdPattern.test(normalized) ? normalized : null;
}
