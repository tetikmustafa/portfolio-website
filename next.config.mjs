/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

// next.config.js
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  output: 'export', // Static export gerekiyor
  trailingSlash: true,
};
