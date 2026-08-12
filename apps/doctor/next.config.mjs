/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@curais/ui"],
  distDir: process.env.CURAIS_NEXT_DIST_DIR || ".next",
};

export default nextConfig;
