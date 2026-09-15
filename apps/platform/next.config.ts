import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@comeaux/brand", "@comeaux/catalog", "@comeaux/training", "@comeaux/ai-core", "@comeaux/external-gateway"],
  poweredByHeader: false,
  reactStrictMode: true
};

export default config;
