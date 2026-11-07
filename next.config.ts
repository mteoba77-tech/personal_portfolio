import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Content JSON is read at runtime, so include it in the standalone bundle.
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
};

export default nextConfig;
