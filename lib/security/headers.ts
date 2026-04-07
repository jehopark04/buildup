export type SecurityHeader = {
  key: string;
  value: string;
};

type BuildSecurityHeadersOptions = {
  isDev: boolean;
  enableInsecureRequestUpgrade?: boolean;
};

function buildContentSecurityPolicy({
  isDev,
  enableInsecureRequestUpgrade = false,
}: BuildSecurityHeadersOptions) {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  ];

  if (enableInsecureRequestUpgrade) {
    directives.push("upgrade-insecure-requests");
  }

  return `${directives.join("; ")};`;
}

export function buildSecurityHeaders({
  isDev,
  enableInsecureRequestUpgrade = false,
}: BuildSecurityHeadersOptions): SecurityHeader[] {
  return [
    {
      key: "Strict-Transport-Security",
      value: "max-age=31536000",
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
    {
      key: "X-Frame-Options",
      value: "DENY",
    },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=()",
    },
    {
      key: "Content-Security-Policy",
      value: buildContentSecurityPolicy({ isDev, enableInsecureRequestUpgrade }),
    },
  ];
}
