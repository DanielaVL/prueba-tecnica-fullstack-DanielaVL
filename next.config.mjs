/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
      };
      config.resolve.alias = {
        ...config.resolve.alias,
        'node:path': 'path-browserify',
        'node:util': 'util/',
        'node:crypto': 'crypto-browserify',
        'node:stream': 'stream-browserify',
      };
    }
    return config;
  },
  transpilePackages: ['yaml', 'swagger-jsdoc', 'next-swagger-doc'],
};

export default nextConfig;
