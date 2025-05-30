/** @type {import('next').NextConfig} **/

const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/v0/:path*',
                destination: 'http://localhost:5500/api/v0/:path*',
            },
        ];
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '5mb',
        },
    },
};

export default nextConfig;