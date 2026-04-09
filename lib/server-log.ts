type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function normalizeLogValue(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeLogValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeLogValue(item)]),
    );
  }

  return value;
}

function writeLog(level: LogLevel, event: string, context: LogContext) {
  const payload = normalizeLogValue({
    timestamp: new Date().toISOString(),
    level,
    event,
    service: "career-mvp",
    ...context,
  });
  const message = JSON.stringify(payload);

  if (level === "error") {
    console.error(message);
    return;
  }

  if (level === "warn") {
    console.warn(message);
    return;
  }

  console.log(message);
}

export function logInfo(event: string, context: LogContext = {}) {
  writeLog("info", event, context);
}

export function logWarn(event: string, context: LogContext = {}) {
  writeLog("warn", event, context);
}

export function logError(event: string, context: LogContext = {}) {
  writeLog("error", event, context);
}
