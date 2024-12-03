// src/hooks/useCalculateAge.ts

import * as Sentry from "@sentry/nextjs";

export function calculateAge(dateOfBirth: string | Date): number {
    try {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();

        if (isNaN(birthDate.getTime())) {
            throw new Error("Invalid date format for dateOfBirth");
        }

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    } catch (error) {
        Sentry.captureException(error);
        throw error;
    }
}
