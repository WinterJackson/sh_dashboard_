// src/app/(auth)/reset-password/[token]/page.tsx

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token"); // Fetch the token from the URL

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Make API request to reset password
        const response = await fetch(`${process.env.API_URL}/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, newPassword: password }),
        });

        if (response.ok) {
            router.push("/login"); // Redirect to login page after success
        } else {
            const data = await response.json();
            setError(data.error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl mb-6">Reset Your Password</h1>
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
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
