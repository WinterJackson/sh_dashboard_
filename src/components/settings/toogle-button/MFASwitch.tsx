// src/app/components/settings/toggle-button/MFASwitch.tsx

"use client";

import { useState, useEffect } from "react";
import { useUpdateSecuritySettings } from "@/hooks/useUpdateSecuritySettings";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface MFASwitchProps {
    initialEnabled: boolean;
    autoLogoutTimeout: number;
    userEmail: string | null | undefined;
    onUpdateSuccess?: () => void;
}

export default function MFASwitch({
    initialEnabled,
    autoLogoutTimeout,
    userEmail,
    onUpdateSuccess,
}: MFASwitchProps) {
    const { mutate: updateSettings, isPending } = useUpdateSecuritySettings();
    const [enabled, setEnabled] = useState(initialEnabled);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
    const [token, setToken] = useState("");
    const [status, setStatus] = useState<string | null>(null);

    const isMfaDisabled = !userEmail;

    // Keep internal state in sync with prop
    useEffect(() => {
        console.log("MFASwitch: initialEnabled changed to", initialEnabled);
        setEnabled(initialEnabled);
    }, [initialEnabled]);

    // Prevent opening when no email
    useEffect(() => {
        if (isModalOpen && isMfaDisabled) {
            console.warn("MFASwitch: cannot enable MFA—no email");
            toast.error("Email is required to enable MFA");
            setIsModalOpen(false);
        }
    }, [isModalOpen, isMfaDisabled]);

    // Reset QR, token, status on close
    useEffect(() => {
        if (!isModalOpen) {
            console.log("MFASwitch: modal closed, clearing QR and token");
            setQrCodeDataUrl(null);
            setToken("");
            setStatus(null);
        }
    }, [isModalOpen]);

    // Debug email
    useEffect(() => {
        console.log("MFASwitch: userEmail is", userEmail);
    }, [userEmail]);

    // Handle the switch toggle
    const handleToggle = (val: boolean) => {
        console.log("MFASwitch: toggle clicked, val =", val);
        if (isMfaDisabled) {
            toast.error("Email is required to enable MFA");
            return;
        }
        if (val) {
            console.log("MFASwitch: opening setup modal");
            setIsModalOpen(true);
        } else {
            console.log("MFASwitch: disabling MFA");
            updateSettings(
                { twoFactorEnabled: false, autoLogoutTimeout },
                {
                    onSuccess: () => {
                        console.log("MFASwitch: MFA disabled successfully");
                        setEnabled(false);
                        toast.success("Two-factor authentication disabled");
                        setIsModalOpen(false);
                        onUpdateSuccess?.();
                    },
                    onError: (error) => {
                        console.error("MFASwitch: error disabling MFA", error);
                        toast.error("Failed to disable MFA");
                        setEnabled(true);
                    },
                }
            );
        }
    };

    // Fetch QR code from server when modal opens
    useEffect(() => {
        if (isModalOpen && userEmail) {
            console.log("MFASwitch: fetching QR from /api/auth/mfa/enable");
            fetch("/api/auth/mfa/enable", {
                method: "POST",
                credentials: "include",
            })
                .then(async (res) => {
                    const text = await res.text();
                    if (!res.ok) {
                        console.error(
                            "MFASwitch: enable endpoint error:",
                            text
                        );
                        throw new Error(text);
                    }
                    return JSON.parse(text);
                })
                .then((data) => {
                    console.log("MFASwitch: enable response data:", data);
                    if (data.qrCodeDataUrl) {
                        setQrCodeDataUrl(data.qrCodeDataUrl);
                    } else {
                        toast.error("Failed to generate QR code");
                    }
                })
                .catch((err) => {
                    console.error("MFASwitch: QR Code Fetch Error:", err);
                    toast.error("Failed to fetch QR code");
                });
        }
    }, [isModalOpen, userEmail]);

    // Verify the user-entered token
    const handleVerify = async () => {
        console.log("MFASwitch: verifying token", token);
        try {
            const res = await fetch("/api/auth/mfa/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ token }),
            });
            const result = await res.json();
            console.log("MFASwitch: verify response", result);

            if (result.verified) {
                console.log("MFASwitch: token valid, enabling MFA in settings");
                updateSettings(
                    { twoFactorEnabled: true, autoLogoutTimeout },
                    {
                        onSuccess: () => {
                            console.log("MFASwitch: MFA enabled successfully");
                            setEnabled(true);
                            toast.success("Two-factor authentication enabled");
                            setIsModalOpen(false);
                            onUpdateSuccess?.();
                        },
                        onError: (error) => {
                            console.error(
                                "MFASwitch: error saving MFA setting",
                                error
                            );
                            toast.error("Failed to save MFA setting");
                        },
                    }
                );
            } else {
                console.warn("MFASwitch: invalid TOTP token");
                setStatus("❌ Invalid token");
            }
        } catch (error) {
            console.error("MFASwitch: Verification Error:", error);
            toast.error("Verification failed");
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-4 p-2 border-2 border-gray-100 rounded-[10px]">
                <div className="w-full">
                    <Label htmlFor="mfaToggle" className="font-semibold">
                        Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-gray-500">
                        {isMfaDisabled
                            ? "Add an email address to enable MFA"
                            : "Use an authenticator app for login codes"}
                    </p>
                </div>
                <Switch
                    id="mfaToggle"
                    checked={enabled}
                    onCheckedChange={handleToggle}
                    disabled={isMfaDisabled || isPending}
                />
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <span />
                </DialogTrigger>
                <DialogContent className="w-full max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Set Up Two-Factor Authentication
                        </DialogTitle>
                        <DialogDescription>
                            Scan the QR code below and enter the 6-digit code.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {qrCodeDataUrl ? (
                            <>
                                <div className="flex justify-center">
                                    {/* <img> for SVG or PNG data URL */}
                                    <img
                                        src={qrCodeDataUrl}
                                        alt="Scan this QR code with your authenticator app"
                                        className="w-40 h-40"
                                    />
                                </div>

                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    pattern="\d{6}"
                                    placeholder="Enter 6-digit code"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="max-w-xs mx-auto"
                                />

                                <Button
                                    onClick={handleVerify}
                                    className="w-full"
                                    disabled={
                                        !/^\d{6}$/.test(token) || isPending
                                    }
                                >
                                    Verify
                                </Button>

                                {status && (
                                    <p className="text-sm text-center text-red-500">
                                        {status}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-center">Generating QR code…</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
