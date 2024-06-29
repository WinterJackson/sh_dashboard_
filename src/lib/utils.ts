// src/lib/utils.ts file

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isEmail } from "validator";
const prisma = require("@/lib/prisma")

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function validateEmail(email: string): boolean {
    if (!email || !isEmail(email)) {
        throw new Error("Invalid email format");
    }

    return true;
}

export function validatePassword(password: string): boolean {
    const minLength = 8;
    const maxLength = 64;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[^a-zA-Z0-9 ]/.test(password); // Includes common symbols

    const meetsRequirements =
        password.length >= minLength &&
        password.length <= maxLength &&
        hasLowercase &&
        hasUppercase &&
        hasDigit &&
        hasSpecialChar;

    if (!meetsRequirements) {
        throw new Error(
            "Password must be 8-64 characters long and include lowercase, uppercase, digits, and special characters"
        );
    }

    return true;
}

export const getFirstName = (fullName: string) => {
    return fullName.split(" ")[0];
};

export async function fetchAppointments() {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                patient: true,
                doctor: true,
            },
        });
        return appointments;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
}