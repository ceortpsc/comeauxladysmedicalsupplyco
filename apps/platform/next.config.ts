import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
  transpilePackages: ["@comeaux/brand", "@comeaux/catalog", "@comeaux/training", "@comeaux/ai-core"],
  poweredByHeader: false,
  reactStrictMode: true
};

export default config;
