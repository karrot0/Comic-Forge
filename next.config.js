/** @type {import('next').NextConfig} */
const nextConfig = {
  crossOrigin: 'anonymous',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
