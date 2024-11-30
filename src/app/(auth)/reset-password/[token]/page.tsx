// src/app/(auth)/reset-password/[token]/page.tsx

"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();
    const { token } = useParams();

    console.log("Token from URL:", token);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${process.env.API_URL}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword: password }),
            });

            if (response.ok) {
                setSuccess("Password updated successfully! Redirecting to sign-in...");
                setTimeout(() => {
                    router.push("/sign-in");
                }, 2000); // Redirect after 2 seconds
            } else {
                const data = await response.json();
                setError(data.error || "Failed to reset password. Please try again.");
            }
        } catch (error) {
            setError("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl mb-6">Set Your Password</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    className="p-2 border rounded-md"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="p-2 border rounded-md"
                />
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
                    Set Password
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;

