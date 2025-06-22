/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: '/radar-store',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://anycode-sy.com/radar/api/:path*', // Proxy to backend
      },
    ];
  },
};

export default nextConfig;