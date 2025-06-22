/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://anycode-sy.com/radar/api/:path*', // Proxy to backend
            },
        ];
    }
};

export default nextConfig