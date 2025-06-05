// src/app/(auth)/dashboard/settings/tabs/SecurityTab.tsx

"use client";

import { useUpdateSecuritySettings } from "@/hooks/useUpdateSecuritySettings";
import { useChangePassword } from "@/hooks/useChangePassword";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import MFASwitch from "@/components/settings/toogle-button/MFASwitch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserSettings } from "@/hooks/useUserSettings";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

// Password validation schema
const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/[0-9]/, "Must contain at least one number"),
        confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SecurityTab() {
    const { data, isLoading, isError, refetch } = useUserSettings();
    const { mutate: updateSecuritySettings, isPending } =
        useUpdateSecuritySettings();
    const { mutateAsync: changePassword, isPending: isChangingPassword } =
        useChangePassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    // Local state
    const [autoLogoutTimeout, setAutoLogoutTimeout] = useState(
        data?.securitySettings?.autoLogoutTimeout ?? 30
    );
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Sync local state with fetched data
    useEffect(() => {
        if (data?.securitySettings?.autoLogoutTimeout !== undefined) {
            setAutoLogoutTimeout(data.securitySettings.autoLogoutTimeout);
        }
    }, [data?.securitySettings?.autoLogoutTimeout]);

    // Handle auto logout change
    const handleAutoLogoutChange = async (enabled: boolean) => {
        const newTimeout = enabled ? 30 : 0;
        try {
            await updateSecuritySettings(
                { autoLogoutTimeout: newTimeout },
                {
                    onSuccess: () => {
                        setAutoLogoutTimeout(newTimeout);
                        toast.success("Security settings updated");
                        refetch();
                    },
                    onError: (error) => {
                        toast.error("Failed to update security settings");
                        console.error("Auto Logout Update Error:", error);
                    },
                }
            );
        } catch (error) {
            toast.error("Failed to update auto-logout");
            console.error("Auto Logout Mutation Error:", error);
        }
    };

    // Submit password change
    const handlePasswordSubmit = async (formData: PasswordFormData) => {
        try {
            await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            toast.success("Password changed successfully");
            reset();
            setIsPasswordModalOpen(false);
            refetch();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to change password"
            );
        }
    };

    // Show loading state
    if (isLoading) {
        return <div></div>;
    }

    // Show error state with retry
    if (isError || !data) {
        return (
            <div className="p-4">
                Failed to load security settings.{" "}
                <Button onClick={() => refetch()}>
                    Try Again
                </Button>
            </div>
        );
    }

    const { email, securitySettings } = data;

    return (
        <div className="space-y-4 p-2 w-full">
            <h2 className="text-lg text-primary font-semibold bg-white p-2 rounded-[10px] shadow-sm shadow-gray-400 w-full">
                Security Preference
            </h2>

            {/* Security options container */}
            <div className="bg-white p-4 rounded-[10px] shadow-sm shadow-gray-400 w-full">
                <h3 className="text-base font-semibold mb-4 border-b-2 border-gray-300 p-1 pb-0 w-full">
                    Password And Security
                </h3>

                {/* MFA toggle */}
                <MFASwitch
                    initialEnabled={securitySettings?.twoFactorEnabled || false}
                    autoLogoutTimeout={autoLogoutTimeout}
                    userEmail={email}
                    onUpdateSuccess={refetch}
                />

                {/* Auto-logout toggle */}
                <div className="flex items-center justify-between mb-4 p-2 border-2 border-gray-100 rounded-[10px]">
                    <div className="w-full">
                        <Label htmlFor="autoLogoutTimeout" className="font-semibold">
                            Automatic Log Out
                        </Label>
                        <p className="text-sm text-gray-500">
                            Log out after 30 minutes of inactivity
                        </p>
                    </div>
                    <Switch
                        id="autoLogoutTimeout"
                        checked={autoLogoutTimeout > 0}
                        onCheckedChange={handleAutoLogoutChange}
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
                            <div className="w-full relative">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type={showCurrent ? "text" : "password"}
                                    placeholder="Enter current password"
                                    {...register("currentPassword")}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-9 text-gray-500"
                                    onClick={() => setShowCurrent((prev) => !prev)}
                                >
                                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                {errors.currentPassword && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.currentPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* New Password */}
                            <div className="w-full relative">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type={showNew ? "text" : "password"}
                                    placeholder="Enter new password"
                                    {...register("newPassword")}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-9 text-gray-500"
                                    onClick={() => setShowNew((prev) => !prev)}
                                >
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.newPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="w-full relative">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    {...register("confirmPassword")}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-9 text-gray-500"
                                    onClick={() => setShowConfirm((prev) => !prev)}
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
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
                                {isChangingPassword
                                    ? "Changing..."
                                    : "Change Password"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
