// next.config.mjs

import 'dotenv/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS,
        BASE_URL: process.env.BASE_URL,
        API_URL: process.env.API_URL,
        PORT: process.env.PORT,
    },
    async redirects() {
        return [
            {
                source: '/api',
                destination: '/api-landing', // Redirect to custom API landing page
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
