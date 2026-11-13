import type { NextConfig } from "next";

// The app is served under a sub-path: http://<server-ip>:8016/peta-poc
const BASE_PATH = "/peta-poc";

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
