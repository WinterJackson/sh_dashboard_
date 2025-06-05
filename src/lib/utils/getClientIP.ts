// src/lib/utils/getClientIP.ts

import { NextRequest } from "next/server";
import type { IncomingMessage } from "http";
import { headers } from "next/headers";

/**
 * Extracts the client IP address from various request sources.
 *
 * Supports:
 * - App Router API Routes (via NextRequest)
 * - Node.js IncomingMessage (used in next-auth callbacks)
 * - Server Components (via headers())
 */
export function getClientIP(
    req?: NextRequest | IncomingMessage | any
): string {
    if (!req) {
        // Fallback for server components or middleware
        try {
            const headerStore = headers();
            const forwardedFor =
                headerStore.get("x-forwarded-for") || undefined;

            if (forwardedFor) {
                return forwardedFor.split(",")[0].trim();
            }
        } catch (e) {
            // `headers()` only works in server components/middleware
        }

        return "unknown";
    }

    // Case 1: App Router API route (NextRequest)
    if (req instanceof Request || "headers" in req && typeof req.headers.get === "function") {
        const forwardedFor = req.headers.get("x-forwarded-for");
        if (typeof forwardedFor === "string") {
            return forwardedFor.split(",")[0].trim();
        }

        return req.ip || "unknown";
    }

    // Case 2: Traditional Node.js IncomingMessage (from next-auth callbacks)
    if ("socket" in req && req.socket?.remoteAddress) {
        return req.socket.remoteAddress;
    }

    // Case 3: Raw object with headers (e.g., Express-style)
    if (req.headers && typeof req.headers === "object") {
        const forwardedFor = req.headers["x-forwarded-for"];
        if (typeof forwardedFor === "string") {
            return forwardedFor.split(",")[0].trim();
        }
    }

    // Default fallback
    return "unknown";
}