import type { NextConfig } from 'next';

// Cloudflare Pages serves the generated static `out/` directory directly.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
