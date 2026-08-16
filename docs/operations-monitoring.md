# BUILDUP Monitoring Baseline

## Current recommendation

For the current MVP, use `Better Stack` as the first uptime monitor.

Why this fits now:

- We only need to watch 2 endpoints: the homepage and `/api/health`.
- Better Stack's free plan covers `10 monitors`, `10 heartbeats`, `1 status page`, and `Slack + e-mail alerts`.
- The free check interval is `3 minutes`, which is enough for this project stage.
- If we later add error tracking or logs, Better Stack can extend from the same tool.

Reference:

- https://betterstack.com/uptime/pricing
- https://betterstack.com/docs/uptime/uptime-monitor/
- https://betterstack.com/docs/uptime/check-frequency/

Comparison notes:

- `UptimeRobot` is also a valid backup choice and offers `50 free monitors`, but its free plan checks every `5 minutes` and has fewer integrations.
- `Cronitor` is better once we need heartbeat monitoring for scheduled jobs, but it is not the best first choice for this app-only MVP.

Reference:

- https://uptimerobot.com/pricing/
- https://cronitor.io/pricing

## Health endpoint

The app exposes a lightweight health route:

- `GET /api/health`
- `HEAD /api/health`

Expected behavior:

- Returns `200 OK` when the app is running and the activity catalog is loaded.
- Returns `503` if the app is up but the core activity catalog is unexpectedly empty.
- Sends `Cache-Control: no-store, max-age=0` so monitors always check the live state.

Example response:

```json
{
  "ok": true,
  "status": "ok",
  "service": "buildup",
  "timestamp": "2026-04-07T07:00:00.000Z",
  "checks": {
    "activityCatalog": "ok"
  }
}
```

## Better Stack setup

Create 2 monitors only.

### 1. API health monitor

- Type: `HTTP status code`
- URL: `https://<your-production-domain>/api/health`
- Method: `GET`
- Expected status: `2xx`
- Check frequency: `3 minutes`
- Alert channel: `owner email`
- Escalation: `off` for now

This is the primary monitor. If this fails, treat it as a likely production outage.

### 2. Homepage monitor

- Type: `Keyword` or `HTTP status code`
- URL: `https://<your-production-domain>/`
- Method: `GET`
- Keyword: `BUILDUP`
- Check frequency: `3 minutes`
- Alert channel: `owner email`

This catches cases where the domain still responds but the main page is broken or serving an unexpected result.

## Alert policy

Keep the alert policy intentionally small:

- Send alerts to 1 owner email first.
- Add Slack only after the project has a shared operating channel.
- Do not add SMS or phone-call alerts yet.

Recommended first channel:

- Better Stack e-mail alert only
- One recipient: the current service owner
- Trigger: any failed check on either monitor
- Recovery alert: enabled

Why this is enough now:

- One-person operation does not benefit from multi-channel fan-out yet.
- E-mail is the lowest-friction alert path for launch.
- Better Stack already owns the uptime signal, so alert routing should stay there too.

## Error logging baseline

For the current MVP, use deployment platform logs as the main server log sink.

Current app logging policy:

- Structured JSON logs are emitted for `/api/contact`.
- Every response includes `X-Request-Id`.
- Failed API requests, upstream delivery failures, and unhandled exceptions are logged.
- User message bodies are not logged.

Look for these log events first:

- `contact.unsupported_media_type`
- `contact.origin_rejected`
- `contact.payload_too_large`
- `contact.rate_limited`
- `contact.invalid_json`
- `contact.validation_failed`
- `contact.config_missing`
- `contact.delivery_failed`
- `contact.unhandled_exception`

Operational recommendation:

- If deploying on Vercel, use the Functions logs for `/api/contact`.
- Search by `requestId`, `event`, or `status`.
- Keep Sentry out for now unless server errors become frequent or you add more dynamic server logic.

## Contact delivery policy

The contact mail send path uses a minimal resilience policy:

- Timeout: `5 seconds`
- Max attempts: `2`
- Retry only on:
  - network failures
  - timeout failures
  - upstream `5xx` responses
- No retry on upstream `4xx`

This is intentionally small to avoid duplicate sends and keep the behavior predictable.

## Triage guide

Use the two-monitor matrix below:

- `/api/health` down and homepage down: likely full app outage, deployment issue, or platform issue.
- `/api/health` up and homepage down: likely rendering regression, routing issue, or page-level failure.
- `/api/health` down and homepage up: likely API routing issue or health route regression.
- Both up: service is externally reachable.

## Deployment checklist

After each production deploy:

1. Open `/api/health` and confirm `200 OK`.
2. Open the homepage and confirm the main hero renders.
3. Confirm both Better Stack monitors are green.
4. Pause monitors only during planned maintenance windows.
