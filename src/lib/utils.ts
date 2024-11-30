// src/lib/utils.ts file

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isEmail } from "validator";
import { randomBytes } from "crypto";

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

export function generateRandomPassword(length = 12): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=.";
    return Array.from(randomBytes(length))
        .map((byte) => chars[byte % chars.length])
        .join("");
}


export const base64ToFile = (base64: string, filename: string): File => {
    const [header, base64Data] = base64.split(',');
    let mimeType = 'image/jpeg';  // Default to JPEG if MIME type is not found

    // Detect MIME type (jpg/png) from the base64 header
    if (header.includes('image/png')) {
        mimeType = 'image/png';
    } else if (header.includes('image/jpeg')) {
        mimeType = 'image/jpeg';
    }

    const byteCharacters = atob(base64Data); // Decode base64 string
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays, { type: mimeType });
    return new File([blob], filename, { type: mimeType });
};

