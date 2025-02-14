// src/app/(auth)/dashboard/settings/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AccountTab from "@/components/settings/tabs/AccountTab";
import NotificationsTab from "@/components/settings/tabs/NotificationsTab";
import SecurityTab from "@/components/settings/tabs/SecurityTab";
import SupportTab from "@/components/settings/tabs/SupportTab";
import { fetchUserSettings } from "@/lib/data-access/settings/data";
import { Role } from "@/lib/definitions";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/sign-in");
    }

    // Fetch user settings data
    const userSettings = await fetchUserSettings(session.user.id);

    return (
        <Tabs defaultValue="account" className="w-full bg-bluelight/5 p-2 rounded-[10px]">
            <TabsList className="grid w-full grid-cols-4 bg-white rounded-[10px] shadow-sm shadow-gray-400">
                <TabsTrigger value="account" className="hover:bg-primary hover:text-white rounded-tl-[10px] rounded-bl-[10px]">Account</TabsTrigger>
                <TabsTrigger value="notifications" className="border-l-2 hover:bg-primary hover:text-white">Notifications</TabsTrigger>
                <TabsTrigger value="security" className="border-l-2 hover:bg-primary hover:text-white">Security</TabsTrigger>
                <TabsTrigger value="support" className="border-l-2 hover:bg-primary hover:text-white rounded-tr-[10px] rounded-br-[10px]">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
                <AccountTab
                    profile={{
                        ...userSettings.profile,
                        username: userSettings.username,
                        email: userSettings.email,
                    }}
                    username={userSettings.username}
                    email={userSettings.email}
                    roleSpecific={userSettings.roleSpecific}
                    role={userSettings.role as Role}
                />
            </TabsContent>

            <TabsContent value="notifications">
                <NotificationsTab
                    notificationSettings={userSettings.notificationSettings}
                />
            </TabsContent>

            <TabsContent value="security">
                <SecurityTab securitySettings={userSettings.securitySettings} />
            </TabsContent>

            <TabsContent value="support">
                <SupportTab />
            </TabsContent>
        </Tabs>
    );
}
