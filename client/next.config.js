const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    swcMinify: true,
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    reactStrictMode: false,
    images: {
        domains: ['salam-dev.fra1.digitaloceanspaces.com'],
    },
    env: {
        NEXT_PUBLIC_API_URL: "https://api.nop.kz/api",
        NEXT_PUBLIC_SPACE_HOST: "https://salam-dev.fra1.digitaloceanspaces.com/nop"
    },
    rewrites: async () => {
        return {
            afterFiles: [{
                source: "/:path*",
                destination: "/not-found",
            }],
        }
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });
        return config;
    },
};

module.exports = nextConfig;
