// src/app/(auth)/dashboard/settings/tabs/SecurityTab.tsx

"use client";

import { useUpdateSecuritySettings } from "@/hooks/useUpdateSecuritySettings";
import { useChangePassword } from "@/hooks/useChangePassword";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState, Suspense } from "react";
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
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useUserSecurity } from "@/hooks/useUserSecurity";
import { Skeleton } from "@/components/ui/skeleton";

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

function SecurityTabContent() {
    const { data, isLoading, isError, refetch } = useUserSecurity();
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

    const [autoLogoutTimeout, setAutoLogoutTimeout] = useState(
        data?.securitySettings?.autoLogoutTimeout ?? 30
    );
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (data?.securitySettings?.autoLogoutTimeout !== undefined) {
            setAutoLogoutTimeout(data.securitySettings.autoLogoutTimeout);
        }
    }, [data?.securitySettings?.autoLogoutTimeout]);

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

    if (isLoading) {
        return (
            <div className="space-y-6 p-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="p-4">
                Failed to load security settings.{" "}
                <Button onClick={() => refetch()}>Try Again</Button>
            </div>
        );
    }

    const { email, securitySettings } = data;

    return (
        <div className="space-y-6">
            <div className="space-y-4 p-3 rounded-[10px] bg-card shadow-sm shadow-shadow-main">
                <h2 className="text-lg text-primary font-semibold border-b-2 border-border pb-2">
                    Security Preferences
                </h2>

                <MFASwitch
                    initialEnabled={securitySettings?.twoFactorEnabled || false}
                    autoLogoutTimeout={autoLogoutTimeout}
                    userEmail={email}
                    onUpdateSuccess={refetch}
                />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 border-b border-border">
                    <div className="space-y-1">
                        <Label
                            htmlFor="autoLogoutTimeout"
                            className="font-semibold"
                        >
                            Automatic Log Out
                        </Label>
                        <p className="text-sm text-muted-foreground">
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
                            <div className="w-full relative">
                                <Label htmlFor="currentPassword">
                                    Current Password
                                </Label>
                                <Input
                                    id="currentPassword"
                                    type={showCurrent ? "text" : "password"}
                                    placeholder="Enter current password"
                                    {...register("currentPassword")}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-9 text-muted-foreground"
                                    onClick={() =>
                                        setShowCurrent((prev) => !prev)
                                    }
                                >
                                    {showCurrent ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                                {errors.currentPassword && (
                                    <p className="text-destructive text-sm mt-1">
                                        {errors.currentPassword.message}
                                    </p>
                                )}
                            </div>

                            <div className="w-full relative">
                                <Label htmlFor="newPassword">
                                    New Password
                                </Label>
                                <Input
                                    id="newPassword"
                                    type={showNew ? "text" : "password"}
                                    placeholder="Enter new password"
                                    {...register("newPassword")}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-9 text-muted-foreground"
                                    onClick={() => setShowNew((prev) => !prev)}
                                >
                                    {showNew ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                                {errors.newPassword && (
                                    <p className="text-destructive text-sm mt-1">
                                        {errors.newPassword.message}
                                    </p>
                                )}
                            </div>

                            <div className="w-full relative">
                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    {...register("confirmPassword")}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-9 text-muted-foreground"
                                    onClick={() =>
                                        setShowConfirm((prev) => !prev)
                                    }
                                >
                                    {showConfirm ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                                {errors.confirmPassword && (
                                    <p className="text-destructive text-sm mt-1">
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

export default function SecurityTab() {
    return (
        <Suspense
            fallback={
                <div className="p-2">
                    <Skeleton className="h-32 w-full rounded-lg" />
                </div>
            }
        >
            <SecurityTabContent />
        </Suspense>
    );
}
