// src/app/middleware.ts

import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { rateLimitEdge } from "@/lib/utils/rateLimiter";
import { Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import type { JWT } from "next-auth/jwt";

// Extend NextAuth JWT with custom fields
type AppToken = JWT & {
    exp?: number;
    role?: string;
    twoFactorEnabled?: boolean;
    mfaVerified?: boolean;
    hasCompletedOnboarding?: boolean;
};

interface ProtectedRoute {
    path: string;
    roles: Role[];
    enforceMfa?: boolean;
}

// Define role groups
const accessGroups = {
    allRoles: [
        Role.SUPER_ADMIN,
        Role.ADMIN,
        Role.DOCTOR,
        Role.NURSE,
        Role.STAFF,
    ],
    doctorNurse: [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE],
    doctorOnly: [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR],
    nurseOnly: [Role.SUPER_ADMIN, Role.ADMIN, Role.NURSE],
    superAdminOnly: [Role.SUPER_ADMIN],
    adminOnly: [Role.SUPER_ADMIN, Role.ADMIN],
    public: [],
};

// Paths to rate-limit for auth and other routes
const rateLimitedAuthRoutes = ["/api/auth/"];
const authExemptPaths = [
    "/api/auth/logout",
    "/api/auth/session",
    "/api/auth/csrf",
];
const rateLimitedOtherRoutes = ["/api/users"];

// List of protected routes with roles and MFA requirement
const protectedRoutes: ProtectedRoute[] = [
    { path: "/verify-token", roles: accessGroups.allRoles },
    { path: "/dashboard", roles: accessGroups.allRoles },
    {
        path: "/dashboard/admin",
        roles: accessGroups.adminOnly,
        enforceMfa: true,
    },
    { path: "/dashboard/nurse", roles: accessGroups.nurseOnly },
    { path: "/dashboard/appointments", roles: accessGroups.allRoles },
    { path: "/dashboard/doctors", roles: accessGroups.adminOnly },
    { path: "/dashboard/patients", roles: accessGroups.allRoles },
    {
        path: "/dashboard/hospitals",
        roles: accessGroups.superAdminOnly,
        enforceMfa: false,
    },
    { path: "/dashboard/messaging", roles: accessGroups.allRoles },
    { path: "/dashboard/settings", roles: accessGroups.allRoles },
    {
        path: "/api/administrators",
        roles: accessGroups.superAdminOnly,
        enforceMfa: true,
    },
    { path: "/api/appointments", roles: accessGroups.allRoles },
    { path: "/api/auth/", roles: accessGroups.public },
    { path: "/api/auth/logout", roles: accessGroups.allRoles },
    { path: "/api/auth/register", roles: accessGroups.public },
    {
        path: "/api/auth/register/admin",
        roles: accessGroups.superAdminOnly,
        enforceMfa: true,
    },
    {
        path: "/api/auth/register/super_admin",
        roles: accessGroups.superAdminOnly,
        enforceMfa: true,
    },
    {
        path: "/api/auth/mfa/enable",
        roles: accessGroups.allRoles,
        enforceMfa: true,
    },
    { path: "/api/auth/mfa/verify", roles: accessGroups.allRoles },
    { path: "/api/auth/reset-password", roles: accessGroups.public },
    { path: "/api/auth/reset-password/resend", roles: accessGroups.public },
];

// Return config for a given request path
function getRouteConfig(pathname: string): ProtectedRoute | undefined {
    return protectedRoutes.find(
        (cfg) => pathname === cfg.path || pathname.startsWith(`${cfg.path}/`)
    );
}

// Check expiration, role, and MFA for a request
function isAuthorized(req: NextRequest, tokenRaw: JWT | null) {
    const token = tokenRaw as AppToken;
    if (!token) return false;

    const now = Math.floor(Date.now() / 1000);
    if (token.exp && token.exp < now) return false; // token expired

    if (!token.id) return false; // missing user ID

    const cfg = getRouteConfig(req.nextUrl.pathname);
    if (!cfg) return true; // route not protected

    if (!token.role || !cfg.roles.includes(token.role as Role)) return false; // role not allowed

    if (cfg.enforceMfa && !token.mfaVerified) return false; // MFA not verified

    return true;
}

export default withAuth(
    async function middleware(req: NextRequestWithAuth) {
        try {
            const pathname = req.nextUrl.pathname;

            // Rate-limit auth and other routes
            let limit: number | null = null;
            if (
                rateLimitedAuthRoutes.some((route) =>
                    pathname.startsWith(route)
                ) &&
                !authExemptPaths.includes(pathname)
            ) {
                limit = 5;
            } else if (
                rateLimitedOtherRoutes.some((route) =>
                    pathname.startsWith(route)
                )
            ) {
                limit = 20;
            }
            if (limit !== null) {
                const rateRes = await rateLimitEdge(req, limit);
                if (rateRes) return rateRes;
            }

            const token = req.nextauth.token as AppToken | null;
            if (token) {
                const cfg = getRouteConfig(pathname);

                // If MFA is required but not verified, redirect to verify-token
                if (
                    cfg?.enforceMfa &&
                    (token.twoFactorEnabled ?? false) &&
                    !token.mfaVerified
                ) {
                    if (!pathname.startsWith("/verify-token")) {
                        const verifyUrl = new URL("/verify-token", req.url);
                        verifyUrl.searchParams.set(
                            "callbackUrl",
                            encodeURIComponent(
                                req.nextUrl.pathname + req.nextUrl.search
                            )
                        );
                        return NextResponse.redirect(verifyUrl);
                    }
                }
            }

            return NextResponse.next();
        } catch (err) {
            Sentry.captureException(err);
            console.error("Middleware error:", err);
            const errorRes = NextResponse.redirect(new URL("/error", req.url));
            errorRes.cookies.delete("next-auth.session-token");
            return errorRes;
        }
    },
    {
        secret: process.env.NEXTAUTH_SECRET,
        callbacks: {
            authorized: ({ req, token }) => {
                const result = isAuthorized(req, token ?? null);
                console.log(
                    `Authorization ${result ? "granted" : "denied"} for ${
                        req.nextUrl.pathname
                    }`
                );
                return result;
            },
        },
        pages: {
            signIn: "/sign-in",
            error: "/unauthorized",
        },
    }
);

export const config = {
    matcher: ["/dashboard", "/dashboard/:path*", "/api/:path*"],
};
