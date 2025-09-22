// src/components/tabs/NotificationsTab.tsx

"use client";

import { Switch } from "@/components/ui/switch";
import { useUpdateNotificationSettings } from "@/hooks/useUpdateNotificationSettings";
import { NotificationSettings } from "@/lib/definitions";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface NotificationsTabProps {
    notificationSettings: NotificationSettings;
}

function NotificationsTabContent({
    notificationSettings,
}: NotificationsTabProps) {
    const { mutate: updateSettings, isPending } =
        useUpdateNotificationSettings();

    const handleToggle = (
        setting: keyof NotificationSettings,
        value: boolean
    ) => {
        const updatedSettings = { ...notificationSettings, [setting]: value };

        updateSettings(updatedSettings, {
            onSuccess: () => {
                toast.success("Notification preferences updated");
            },
            onError: (error) => {
                toast.error(error.message || "Failed to update preferences");
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4 p-3 rounded-[10px] bg-card shadow-sm shadow-shadow-main">
                <h2 className="text-lg text-primary font-semibold border-b-2 border-border pb-2">
                    Notification Preferences
                </h2>
                {/* Appointment Alerts */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 border-b border-border gap-2">
                    <div className="space-y-1">
                        <Label>Appointment Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                            Receive notifications for upcoming appointments
                        </p>
                    </div>
                    <Switch
                        checked={notificationSettings.appointmentAlerts}
                        onCheckedChange={(checked) =>
                            handleToggle("appointmentAlerts", checked)
                        }
                        disabled={isPending}
                    />
                </div>

                {/* Email Alerts */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 border-b border-border gap-2">
                    <div className="space-y-1">
                        <Label>Email Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                            Get important updates via email
                        </p>
                    </div>
                    <Switch
                        checked={notificationSettings.emailAlerts}
                        onCheckedChange={(checked) =>
                            handleToggle("emailAlerts", checked)
                        }
                        disabled={isPending}
                    />
                </div>

                {/* Security Alerts */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 border-b border-border gap-2">
                    <div className="space-y-1">
                        <Label>Security Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                            Receive critical security notifications
                        </p>
                    </div>
                    <Switch
                        checked={notificationSettings.securityAlerts}
                        onCheckedChange={(checked) =>
                            handleToggle("securityAlerts", checked)
                        }
                        disabled={isPending}
                    />
                </div>

                {/* System Updates */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 border-b border-border gap-2">
                    <div className="space-y-1">
                        <Label>System Updates</Label>
                        <p className="text-sm text-muted-foreground">
                            Stay informed about platform changes
                        </p>
                    </div>
                    <Switch
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={(checked) =>
                            handleToggle("systemUpdates", checked)
                        }
                        disabled={isPending}
                    />
                </div>

                {/* New Device Login */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2">
                    <div className="space-y-1">
                        <Label>New Device Login</Label>
                        <p className="text-sm text-muted-foreground">
                            Get alerted about new sign-ins
                        </p>
                    </div>
                    <Switch
                        checked={notificationSettings.newDeviceLogin}
                        onCheckedChange={(checked) =>
                            handleToggle("newDeviceLogin", checked)
                        }
                        disabled={isPending}
                    />
                </div>
            </div>
        </div>
    );
}

export default function NotificationsTab(props: NotificationsTabProps) {
    return (
        <Suspense
            fallback={
                <div className="space-y-6 p-1">
                    <div className="space-y-4 p-3 rounded-[10px] bg-card shadow-sm shadow-shadow-main">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-16 w-full rounded-lg" />
                        <Skeleton className="h-16 w-full rounded-lg" />
                        <Skeleton className="h-16 w-full rounded-lg" />
                        <Skeleton className="h-16 w-full rounded-lg" />
                        <Skeleton className="h-16 w-full rounded-lg" />
                    </div>
                </div>
            }
        >
            <NotificationsTabContent {...props} />
        </Suspense>
    );
}
