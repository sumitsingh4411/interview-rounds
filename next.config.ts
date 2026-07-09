import type { NextConfig } from "next";

// The app is served under a subpath of nextjoblist.com. Keep this in sync with
// BASE_PATH in src/lib/base-path.ts. `basePath` prefixes routes, <Link>, and
// bundled assets; hand-built URLs use withBasePath() instead.
const nextConfig: NextConfig = {
  basePath: "/interview-rounds",
};

export default nextConfig;
