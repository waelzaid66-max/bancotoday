import type { NextConfig } from "next";

function apiRewriteTarget(): string {
  const base = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080").replace(
    /\/+$/,
    "",
  );
  return base;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Allow Replit's proxied preview (cross-origin iframe) to load /_next/* assets
  allowedDevOrigins: ["*"],
  // Allow Server Actions from Replit proxy (port mismatch in x-forwarded-host vs origin)
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "127.0.0.1:3000",
        process.env.REPLIT_DOMAINS ?? "",
        `${process.env.REPLIT_DOMAINS ?? ""}:6800`,
      ].filter(Boolean),
    },
  },
  transpilePackages: [
    "@workspace/design-tokens",
    "@workspace/search-contract",
    "@workspace/taxonomy",
    "@workspace/api-client-react",
  ],
  ...(process.env.NEXT_STANDALONE === "true" ? { output: "standalone" as const } : {}),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
    ];
  },
  async rewrites() {
    const apiBase = apiRewriteTarget();
    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/api/:path*`,
      },
      {
        source: "/l/:id",
        destination: `${apiBase}/l/:id`,
      },
    ];
  },
};

export default nextConfig;
