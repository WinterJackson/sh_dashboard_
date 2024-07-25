// src/app/middleware.ts

import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { Role } from "@/lib/definitions";

const roleProtectedRoutes = {
    "/dashboard/admin": [Role.SUPER_ADMIN, Role.ADMIN],
    "/dashboard/doctor": [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR],
    "/dashboard/nurse": [Role.SUPER_ADMIN, Role.ADMIN, Role.NURSE],
    // Add other role-specific routes here
};

export default withAuth(
    async (req: NextRequest) => {
        const token = await getToken({ req });
        if (!token) {
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }

        const role = token.role as Role;
        const pathname = req.nextUrl.pathname;

        for (const [route, roles] of Object.entries(roleProtectedRoutes)) {
            if (pathname.startsWith(route) && !roles.includes(role)) {
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/api/:path*"],
};
