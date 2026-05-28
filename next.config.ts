import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // /Users/music に別の package-lock.json があるためルートを明示
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
