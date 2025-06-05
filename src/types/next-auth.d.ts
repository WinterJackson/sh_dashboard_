// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user?: {
            id: string;
            role: string;
            hospitalId: number | null;
            hospital: string | null;
            username: string;
            isActive: boolean;
            twoFactorEnabled: boolean;
            mfaVerified: boolean;
            hasCompletedOnboarding: boolean;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
        role: string;
        hospitalId: number | null;
        hospital: string | null;
        username: string;
        isActive: boolean;
        twoFactorEnabled: boolean;
        mfaVerified: boolean;
        hasCompletedOnboarding: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        hospitalId: number | null;
        hospital: string | null;
        username: string;
        isActive: boolean;
        twoFactorEnabled: boolean;
        mfaVerified: boolean;
        hasCompletedOnboarding: boolean;
        lastRefreshed?: number;
    }
}
