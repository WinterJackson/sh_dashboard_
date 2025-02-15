// src/components/tabs/NotificationsTab.tsx

"use client";

import { Switch } from "@/components/ui/switch";
import { useUpdateNotificationSettings } from "@/hooks/useUpdateNotificationSettings";
import { NotificationSettings } from "@/lib/definitions";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface NotificationsTabProps {
    notificationSettings: NotificationSettings;
}

export default function NotificationsTab({
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
        <div className="space-y-6 p-2">
            <h2 className="text-lg text-primary font-semibold bg-white p-2 rounded-[10px] shadow-sm shadow-gray-400">
                Notification Preferences
            </h2>
            <div className="space-y-4 p-3 rounded-[10px] bg-white shadow-sm shadow-gray-400">
                {/* Appointment Alerts */}
                <div className="flex items-center justify-between p-2 border-2 border-gray-200 rounded-[10px] bg-white">
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
                <div className="flex items-center justify-between p-2 border-2 border-gray-200 rounded-[10px] bg-white">
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
                <div className="flex items-center justify-between p-2 border-2 border-gray-200 rounded-[10px] bg-white">
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
                <div className="flex items-center justify-between p-2 border-2 border-gray-200 rounded-[10px] bg-white">
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
                <div className="flex items-center justify-between p-2 border-2 border-gray-200 rounded-[10px] bg-white">
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
