// src/lib/totp.ts

import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import QRCode from "qrcode";
import * as OTPAuth from "otpauth";

if (!process.env.TOTP_ENCRYPTION_KEY || process.env.TOTP_ENCRYPTION_KEY.length < 32) {
    throw new Error("TOTP_ENCRYPTION_KEY must be at least 32 characters");
}

const ENCRYPTION_KEY = Buffer.from(
    process.env.TOTP_ENCRYPTION_KEY.padEnd(32, "x"),
    "utf-8"
).slice(0, 32);

const IV_LENGTH = 16;

export interface EncryptedSecret {
    encryptedSecret: string;
    iv: string;
    qrCodeDataUrl: string;
}

/**
 * Generate a new TOTP secret, encrypt it, and produce a QR code for provisioning.
 */
export async function generateTOTPSecret(email: string): Promise<EncryptedSecret> {
    console.log("⏳ generateTOTPSecret() called for:", email);

    // 1. Generate a Base32 secret
    const secretObj = new OTPAuth.Secret({ size: 20 });
    const base32 = secretObj.base32;
    console.log("🔑 Generated TOTP base32 secret:", base32);

    // 2. Create a random IV
    const iv = randomBytes(IV_LENGTH);
    console.log("🔐 Generated IV:", iv.toString("hex"));

    // 3. Encrypt the Base32 secret
    const cipher = createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(base32, "utf8", "hex");
    encrypted += cipher.final("hex");
    console.log("🔒 Encrypted secret:", encrypted);

    // 4. Build the otpauth:// URI
    const totp = new OTPAuth.TOTP({
        issuer: "SnarkHealth Dashboard",
        label: email,
        secret: secretObj,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
    });
    const otpAuthURL = totp.toString();
    console.log("🔗 OTP Auth URL:", otpAuthURL);

    // 5. Generate QR code data URL
    const qrCodeDataUrl = await generateQRCode(otpAuthURL);
    console.log("🖼️ QR Code generated:", qrCodeDataUrl);
    console.log("📏 QR Code data URL length:", qrCodeDataUrl.length);

    return {
        encryptedSecret: encrypted,
        iv: iv.toString("hex"),
        qrCodeDataUrl,
    };
}

/**
 * Decrypt an encrypted TOTP secret.
 */
export async function decryptTOTPSecret(
    encryptedSecret: string,
    ivHex: string
): Promise<string> {
    try {
        console.log("🔓 decryptTOTPSecret() called with IV:", ivHex);
        const iv = Buffer.from(ivHex, "hex");
        const decipher = createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedSecret, "hex", "utf8");
        decrypted += decipher.final("utf8");
        console.log("✅ Decrypted TOTP secret:", decrypted);
        return decrypted;
    } catch (error) {
        console.error("❌ TOTP Decryption Failed:", error);
        throw new Error("Invalid secret format or tampered data");
    }
}

/**
 * Verify a user-provided TOTP token against the decrypted Base32 secret.
 */
export async function verifyTOTP(token: string, secretBase32: string): Promise<boolean> {
    try {
        console.log("🔍 verifyTOTP() called with token:", token);
        const secret = OTPAuth.Secret.fromBase32(secretBase32);
        const totp = new OTPAuth.TOTP({
            secret,
            algorithm: "SHA1",
            digits: 6,
            period: 30,
        });
        const delta = totp.validate({ token, window: 1 });
        const isValid = delta !== null;
        console.log("✅ TOTP verification result:", isValid);
        return isValid;
    } catch (error) {
        console.error("❌ TOTP Verification Error:", error);
        return false;
    }
}

/**
 * Generate a QR code data URL from an otpauth:// URI.
 */
export async function generateQRCode(otpAuthURL: string): Promise<string> {
    try {
        console.log("🎨 generateQRCode() called for URL:", otpAuthURL);
        const dataUrl = await QRCode.toDataURL(otpAuthURL);
        console.log("✅ QR Code generation successful");
        return dataUrl;
    } catch (error) {
        console.error("❌ QR code generation failed:", error);
        throw new Error("Failed to generate QR code");
    }
}
