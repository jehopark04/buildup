import { activityCatalog } from "@/lib/activities";

export const runtime = "nodejs";
export const maxDuration = 5;

function getHealthStatus() {
  const catalogLoaded = activityCatalog.length > 0;

  return {
    ok: catalogLoaded,
    status: catalogLoaded ? "ok" : "error",
    service: "career-mvp",
    timestamp: new Date().toISOString(),
    checks: {
      activityCatalog: catalogLoaded ? "ok" : "empty",
    },
  } as const;
}

function getHealthHeaders() {
  return {
    "Cache-Control": "no-store, max-age=0",
  };
}

export async function GET() {
  const health = getHealthStatus();

  return Response.json(health, {
    status: health.ok ? 200 : 503,
    headers: getHealthHeaders(),
  });
}

export async function HEAD() {
  const health = getHealthStatus();

  return new Response(null, {
    status: health.ok ? 200 : 503,
    headers: getHealthHeaders(),
  });
}
