// src/app/(auth)/dashboard/settings/tabs/SecurityTab.tsx

"use client";

import { useUpdateSecuritySettings } from "@/hooks/useUpdateSecuritySettings";
import { useChangePassword } from "@/hooks/useChangePassword";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Password change form schema
const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Confirm password is required")
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface SecurityTabProps {
    securitySettings?: {
        twoFactorEnabled: boolean;
        autoLogoutTimeout: number;
    };
}

function SecurityTab({ securitySettings }: SecurityTabProps) {
    const { mutate: updateSecuritySettings, isPending } = useUpdateSecuritySettings();

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(
        securitySettings?.twoFactorEnabled || false
    );

    const [autoLogoutTimeout, setAutoLogoutTimeout] = useState(
        securitySettings?.autoLogoutTimeout || 30
    );

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const { mutateAsync: changePassword, isPending: isChangingPassword } = useChangePassword();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema)
    });

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

    const handlePasswordSubmit = async (data: PasswordFormData) => {
        try {
            await changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            toast.success("Password changed successfully");
            reset();
            setIsPasswordModalOpen(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to change password");
        }
    };

    return (
        <div className="space-y-4 p-2 w-full">
            <h2 className="text-lg text-primary font-semibold bg-white p-2 rounded-[10px] shadow-sm shadow-gray-400 w-full">
                Security Preference
            </h2>
            <div className="bg-white p-4 rounded-[10px] shadow-sm shadow-gray-400 w-full">
                <h3 className="text-base font-semibold mb-4 border-b-2 border-gray-300 p-1 pb-0 w-full">
                    Password And Security
                </h3>
                {/* Two Factor Authentication */}
                <div className="flex items-center justify-between mb-4 border-2 border-gray-100 p-2 rounded-[10px] w-full">
                    <div className="w-full">
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
                <div className="flex items-center justify-between mb-4 border-2 border-gray-100 p-2 rounded-[10px] w-full">
                    <div className="w-full">
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
                    <Button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="w-full"
                    >
                        Change Password
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-md">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter your current password and set a new password
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handlePasswordSubmit)}>
                        <div className="space-y-4 w-full">
                            {/* Current Password */}
                            <div className="w-full">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    placeholder="Enter current password"
                                    {...register("currentPassword")}
                                />
                                {errors.currentPassword && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.currentPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* New Password */}
                            <div className="w-full">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                    {...register("newPassword")}
                                />
                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.newPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="w-full">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    {...register("confirmPassword")}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="w-full mt-4">
                            <Button 
                                type="submit"
                                disabled={isChangingPassword}
                                className="w-full"
                            >
                                {isChangingPassword ? "Changing..." : "Change Password"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default SecurityTab;