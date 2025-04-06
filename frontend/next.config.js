/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com', 'res.cloudinary.com', 'plus.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Configure i18n to use English UK as default
  i18n: {
    // Default locale is English UK
    defaultLocale: 'en-GB',
    // List of supported locales
    locales: ['en-GB', 'es', 'fr', 'it', 'zh', 'he'],
    // Set localeDetection to false to avoid the error
    localeDetection: false,
  },
}

module.exports = nextConfig 