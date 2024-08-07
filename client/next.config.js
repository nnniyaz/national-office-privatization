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
        domains: ['ardodev.fra1.cdn.digitaloceanspaces.com'],
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
