// src/app/(auth)/dashboard/settings/tabs/SecurityTab.tsx

"use client";

import { useUpdateSecuritySettings } from "@/hooks/useUpdateSecuritySettings";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface SecurityTabProps {
    securitySettings?: {
        twoFactorEnabled: boolean;
        autoLogoutTimeout: number;
    };
}

function SecurityTab({ securitySettings }: SecurityTabProps) {
    const { mutate: updateSecuritySettings, isPending } =
        useUpdateSecuritySettings();

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(
        securitySettings?.twoFactorEnabled || false
    );

    const [autoLogoutTimeout, setAutoLogoutTimeout] = useState(
        securitySettings?.autoLogoutTimeout || 30
    );

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const handleToggle = async (setting: string, value: boolean) => {
        try {
            await updateSecuritySettings({
                twoFactorEnabled:
                    setting === "twoFactorEnabled" ? value : twoFactorEnabled,
                autoLogoutTimeout:
                    setting === "autoLogoutTimeout"
                        ? value
                            ? 30
                            : 0
                        : autoLogoutTimeout,
            });

            if (setting === "twoFactorEnabled") {
                setTwoFactorEnabled(value);
            } else if (setting === "autoLogoutTimeout") {
                setAutoLogoutTimeout(value ? 30 : 0);
            }

            toast.success("Security settings updated");
        } catch (error) {
            toast.error("Failed to update security settings");
        }
    };

    const handleChangePassword = () => {
        setIsPasswordModalOpen(true);
    };

    return (
        <div className="space-y-4 p-2">
            <h2 className="text-lg font-semibold bg-white p-2 rounded-[10px] shadow-sm shadow-gray-400">
                Security Preference
            </h2>
            <div className="bg-white p-4 rounded-[10px] shadow-sm shadow-gray-400">
                <h3 className="text-base font-semibold mb-4 border-b-2">
                    Password And Security
                </h3>
                {/* Two Factor Authentication */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <Label htmlFor="twoFactorEnabled">
                            Two Factor Authentication 2-FA
                        </Label>
                        <p className="text-sm text-gray-500">
                            Enable 2-FA For An Added Layer Of Security
                        </p>
                    </div>
                    <Switch
                        id="twoFactorEnabled"
                        checked={twoFactorEnabled}
                        onCheckedChange={(val) =>
                            handleToggle("twoFactorEnabled", val)
                        }
                        disabled={isPending}
                    />
                </div>
                {/* Automatic Log Out */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <Label htmlFor="autoLogoutTimeout">
                            Automatic Log Out
                        </Label>
                        <p className="text-sm text-gray-500">
                            Automatically Log Out After Thirty (30) Minutes Of
                            Inactivity.
                        </p>
                    </div>
                    <Switch
                        id="autoLogoutTimeout"
                        checked={autoLogoutTimeout > 0}
                        onCheckedChange={(val) =>
                            handleToggle("autoLogoutTimeout", val)
                        }
                        disabled={isPending}
                    />
                </div>
            </div>
            {/* Password Change Modal */}
            <Dialog
                open={isPasswordModalOpen}
                onOpenChange={setIsPasswordModalOpen}
            >
                <DialogTrigger asChild>
                    <Button onClick={() => setIsPasswordModalOpen(true)}>
                        Change Password
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter your current password and new password.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="currentPassword">
                                    Current Password
                                </Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <Label htmlFor="newPassword">
                                    New Password
                                </Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Change Password</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default SecurityTab;
