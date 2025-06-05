// src/lib/utils/rateLimiter.ts

import { RateLimiterPostgreSQL } from "rate-limiter-flexible";
import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

// PostgreSQL pool setup
const pgPool = new Pool({
    connectionString: process.env.POSTGRES_PRISMA_URL,
    max: 1,
});

// Default rate limiter config (fallback)
const defaultRateLimiter = new RateLimiterPostgreSQL({
    storeClient: pgPool,
    tableName: "rate_limit",
    points: 10, // default: allow 10 requests per minute
    duration: 60, // in seconds
    blockDuration: 300, // block for 5 minutes if exceeded
    keyPrefix: "default",
});

// Auth-specific rate limiter (stricter)
export const authRateLimiter = new RateLimiterPostgreSQL({
    storeClient: pgPool,
    tableName: "auth_rate_limit",
    points: 5, // stricter: 5 requests per minute
    duration: 60,
    blockDuration: 300,
    keyPrefix: "auth",
});

function getClientIp(request: NextRequest): string {
    return (
        request.ip ||
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
    );
}

/**
 * Apply rate limiting to an incoming edge request.
 *
 * @param request - The incoming Next.js request object
 * @param limit - Optional custom limit (points per minute). If not provided, uses the default limit.
 */
export async function rateLimitEdge(
    request: NextRequest,
    limit?: number
): Promise<NextResponse | null> {
    try {
        const ip = getClientIp(request);

        // Choose appropriate limiter based on whether a custom limit was passed
        const limiter =
            typeof limit === "number"
                ? new RateLimiterPostgreSQL({
                      storeClient: pgPool,
                      tableName: "rate_limit",
                      points: limit,
                      duration: 60,
                      blockDuration: 300,
                      keyPrefix: `custom_limit_${limit}`,
                  })
                : defaultRateLimiter;

        await limiter.consume(ip);
        return null;
    } catch (rejRes) {
        Sentry.captureException(rejRes);

        const res = NextResponse.json(
            { message: "Too many requests. Try again later." },
            { status: 429 }
        );

        if (
            typeof rejRes === "object" &&
            rejRes !== null &&
            "msBeforeNext" in rejRes
        ) {
            res.headers.set(
                "Retry-After",
                String(Math.round((rejRes as any).msBeforeNext / 1000))
            );
        }

        return res;
    }
}
