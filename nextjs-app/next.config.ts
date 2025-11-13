import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable React Strict Mode for highlighting potential problems
  swcMinify: true, // Use the SWC compiler for faster builds and smaller bundle sizes

  // Enable experimental features
  experimental: {
    // Add experimental features as they become available
  },

  // Environment variables that should be available on client-side
  env: {
    CUSTOM_KEY: 'weekly-blitz-trivia',
    APP_VERSION: '1.0.0',
  },

  typescript: {
    ignoreBuildErrors: false, // Temporarily ignore TypeScript errors during build
  },

  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during builds
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
