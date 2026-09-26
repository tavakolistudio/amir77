/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages serves the generated static `out/` directory directly.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
