/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Specify files to ignore
    ignoreDuringBuilds: ['lib/supabase/database.types.ts'],
  },
  typescript: {
    ignoreBuildErrors: true, // For development only, remove in production
  },
  images: {
    unoptimized: true,
    domains: ['api.dicebear.com'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
