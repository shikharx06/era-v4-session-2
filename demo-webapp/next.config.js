/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "loremflickr.com", pathname: "/**" },
      { protocol: "https", hostname: "via.placeholder.com", pathname: "/**" },
    ],
  },
  eslint: {
    // Temporarily ignore linting during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't fail builds on TypeScript errors
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
