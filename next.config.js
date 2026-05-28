/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
};

module.exports = nextConfig;
