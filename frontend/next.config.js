/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'images.unsplash.com',
      'example.com',
      'placehold.co',
      'picsum.photos',
      'cdn.stuhouses.com',
      'res.cloudinary.com',
      'storage.googleapis.com'
    ],
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
    locales: ['en', 'fr', 'it', 'zh', 'he'],
    defaultLocale: 'en',
  },
  // Enable server-side rendering for API requests
  serverRuntimeConfig: {
    // Will only be available on the server side
    dbConfig: {
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT,
      ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
  },
  // Expose environment variables to the browser
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },
  // Optimizations for production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
}

module.exports = nextConfig 