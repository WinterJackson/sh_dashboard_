// next.config.mjs

import { withSentryConfig } from "@sentry/nextjs";
import "dotenv/config";
import webpack from "webpack";

// Build-time validation of the TOTP key
const rawKey = process.env.TOTP_ENCRYPTION_KEY;
if (!rawKey) {
    console.error("❌ TOTP_ENCRYPTION_KEY is not defined! 2FA will not work.");
} else if (rawKey.length < 32) {
    console.error(
        `❌ TOTP_ENCRYPTION_KEY must be at least 32 characters; got ${rawKey.length}`
    );
} else {
    console.log(
        `✅ TOTP_ENCRYPTION_KEY length OK: ${rawKey.length} characters`
    );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        esmExternals: "loose",
    },
    reactStrictMode: true,
    productionBrowserSourceMaps: true,
    env: {
        POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS,
        BASE_URL: process.env.BASE_URL,
        API_URL: process.env.API_URL,
        PORT: process.env.PORT,
        TOTP_ENCRYPTION_KEY: rawKey,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "files.edgestore.dev",
            },
        ],
    },
    async redirects() {
        return [
            {
                source: "/api",
                destination: "/api-landing",
                permanent: true,
            },
        ];
    },
    webpack(config, { isServer }) {
        if (isServer) {
            config.entry = config.entry;
        }

        config.resolve.fallback = {
            ...config.resolve.fallback,
            buffer: "buffer/",
        };

        if (!isServer) {
            config.plugins.push(
                new webpack.ProvidePlugin({
                    Buffer: ["buffer", "Buffer"],
                })
            );
        }

        return config;
    },
};

export default withSentryConfig(nextConfig, {
    org: "snarkhealth-a4",
    project: "snarkhealth",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    reactComponentAnnotation: { enabled: true },
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
});
