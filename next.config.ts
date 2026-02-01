import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better serverless performance
  serverExternalPackages: ['@neondatabase/serverless'],
  
  // Image domains for external images
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'user-images.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google avatars
    ],
  },
  
  // Reduce cold start time
  poweredByHeader: false,
};

export default nextConfig;
