import type { NextConfig } from "next";

// The app is served under a sub-path: http://<server-ip>:8016/peta-poc
const BASE_PATH = "/peta-poc";

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  // The bare host (http://<host>:<port>/) sends people to the app instead of a 404.
  redirects: async () => [
    { source: "/", destination: BASE_PATH, basePath: false, permanent: false },
    // /peta-poc opens the first module. A config redirect, so no page has to call redirect() while prerendering.
    { source: "/", destination: "/talent-recommendation", permanent: false },
  ],
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
