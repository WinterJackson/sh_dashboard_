// src/app/middleware.ts

import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { Role } from "@/lib/definitions";

// Role-based protected frontend and backend routes
const roleProtectedRoutes = {
    // Frontend (dashboard) routes
    "/dashboard/admin": [Role.SUPER_ADMIN, Role.ADMIN],
    "/dashboard/doctor": [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR],
    "/dashboard/nurse": [Role.SUPER_ADMIN, Role.ADMIN, Role.NURSE],
    "/dashboard/appointments": [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.STAFF],
    "/dashboard/doctors": [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR],
    "/dashboard/patients": [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.STAFF],
    "/dashboard/hospitals": [Role.SUPER_ADMIN, Role.ADMIN],
    "/dashboard/messaging": [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE],
    "/dashboard/settings": [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.STAFF],
    "/dashboard/profile": [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.STAFF],

    // API routes
    "/api/administrators": [Role.SUPER_ADMIN, Role.ADMIN],
    "/api/appointments": [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.STAFF],
    "/api/auth": [Role.SUPER_ADMIN, Role.ADMIN],
    "/api/beds": [Role.SUPER_ADMIN, Role.ADMIN],
    "/api/departments": [Role.SUPER_ADMIN, Role.ADMIN],
    "/api/doctors": [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR],
    "/api/hospitals": [Role.SUPER_ADMIN, Role.ADMIN],
    "/api/messages": [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE],
    "/api/nurses": [Role.SUPER_ADMIN, Role.ADMIN, Role.NURSE],
    "/api/patients": [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.STAFF],
    "/api/payments": [Role.SUPER_ADMIN, Role.ADMIN],
    "/api/profiles": [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.STAFF],
    "/api/referrals": [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR],
    "/api/reset-password": [Role.SUPER_ADMIN, Role.ADMIN],
    "/api/roles": [Role.SUPER_ADMIN],
    "/api/specializations": [Role.SUPER_ADMIN, Role.ADMIN],
    "/api/staff": [Role.SUPER_ADMIN, Role.ADMIN, Role.STAFF],
    "/api/upload": [Role.SUPER_ADMIN, Role.ADMIN],
    "/api/users": [Role.SUPER_ADMIN, Role.ADMIN],
};

export default withAuth(
    async (req: NextRequest) => {
        const token = await getToken({ req });
        
        // Redirect to login if no token is found
        if (!token) {
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }

        const role = token.role as Role;
        const pathname = req.nextUrl.pathname;

        // Check role-based access for each route
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

// Middleware matcher to apply to both frontend and API routes
export const config = {
    matcher: ["/dashboard/:path*", "/api/:path*"],
};
