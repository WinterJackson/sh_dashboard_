// src/app/middleware.ts

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@/lib/definitions";
import { NextRequest } from "next/server";

// Define role-based access groups
const accessGroups = {
    superAdminAdmin: [Role.SUPER_ADMIN, Role.ADMIN],
    allRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.STAFF],
    doctorNurse: [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE],
    doctorOnly: [Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR],
    nurseOnly: [Role.SUPER_ADMIN, Role.ADMIN, Role.NURSE],
    adminOnly: [Role.SUPER_ADMIN],
};

// Define route access configuration
const protectedRoutes = [
    { path: "/dashboard/admin", roles: accessGroups.superAdminAdmin },
    { path: "/dashboard/doctor", roles: accessGroups.doctorOnly },
    { path: "/dashboard/nurse", roles: accessGroups.nurseOnly },
    { path: "/dashboard/appointments", roles: accessGroups.allRoles },
    { path: "/dashboard/doctors", roles: accessGroups.superAdminAdmin },
    { path: "/dashboard/patients", roles: accessGroups.allRoles },
    { path: "/dashboard/hospitals", roles: accessGroups.superAdminAdmin },
    { path: "/dashboard/messaging", roles: accessGroups.doctorNurse },
    { path: "/dashboard/settings", roles: accessGroups.allRoles },
    { path: "/dashboard/profile", roles: accessGroups.allRoles },
    // API Routes
    { path: "/api/administrators", roles: accessGroups.superAdminAdmin },
    { path: "/api/appointments", roles: accessGroups.allRoles },
    { path: "/api/auth", roles: accessGroups.superAdminAdmin },
    { path: "/api/beds", roles: accessGroups.superAdminAdmin },
    { path: "/api/departments", roles: accessGroups.superAdminAdmin },
    { path: "/api/doctors", roles: accessGroups.doctorOnly },
    { path: "/api/hospitals", roles: accessGroups.superAdminAdmin },
    { path: "/api/messages", roles: accessGroups.doctorNurse },
    { path: "/api/nurses", roles: accessGroups.nurseOnly },
    { path: "/api/patients", roles: accessGroups.allRoles },
    { path: "/api/payments", roles: accessGroups.superAdminAdmin },
    { path: "/api/profiles", roles: accessGroups.allRoles },
    { path: "/api/referrals", roles: accessGroups.doctorOnly },
    { path: "/api/reset-password", roles: accessGroups.superAdminAdmin },
    { path: "/api/roles", roles: accessGroups.adminOnly },
    { path: "/api/specializations", roles: accessGroups.superAdminAdmin },
    { path: "/api/staff", roles: accessGroups.superAdminAdmin },
    { path: "/api/upload", roles: accessGroups.superAdminAdmin },
    { path: "/api/users", roles: accessGroups.superAdminAdmin },
];

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req });

    // Redirect to login if no token is found
    if (!token) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const role = token.role as Role;

    const pathname = req.nextUrl.pathname;

    // Optimized role-based access control
    const routeConfig = protectedRoutes.find(({ path }) => pathname.startsWith(path));
    
    if (routeConfig && !routeConfig.roles.includes(role)) {
        // Redirect to unauthorized page if role is not allowed
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
    matcher: ["/dashboard/:path*", "/api/:path*"],
};
