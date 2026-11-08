/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Content JSON is read at runtime, so include it in the standalone bundle.
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
  // Load Firestore from node_modules at runtime instead of bundling it.
  // Bundling breaks its internal circular imports, which crashed the contact form
  // ("Right-hand side of 'instanceof' is not an object").
  serverExternalPackages: ["@google-cloud/firestore"],
};

export default nextConfig;
