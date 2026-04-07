import type { NextConfig } from "next";
import { buildSecurityHeaders } from "./lib/security/headers";

const nextConfig: NextConfig = {
  typedRoutes: true,
  async headers() {
    const vercelEnv = process.env.VERCEL_ENV;
    const enableInsecureRequestUpgrade =
      vercelEnv === "preview" || vercelEnv === "production";

    return [
      {
        source: "/:path*",
        headers: buildSecurityHeaders({
          isDev: process.env.NODE_ENV === "development",
          enableInsecureRequestUpgrade,
        }),
      },
    ];
  },
};

export default nextConfig;
