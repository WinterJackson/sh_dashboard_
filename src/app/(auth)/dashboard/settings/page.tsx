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
import type { ExtendedProfileUpdateData } from "@/components/settings/tabs/AccountTab";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/sign-in");
    }

    const userSettings = await fetchUserSettings(session.user.id);

    const profileData: ExtendedProfileUpdateData = {
        profileId: userSettings.profile?.profileId ?? "",
        userId: userSettings.profile?.userId ?? session.user.id,
        firstName: userSettings.profile?.firstName ?? "",
        lastName: userSettings.profile?.lastName ?? "",
        gender: userSettings.profile?.gender,
        phoneNo: userSettings.profile?.phoneNo ?? "",
        address: userSettings.profile?.address,
        dateOfBirth: userSettings.profile?.dateOfBirth?.toISOString() ?? "",
        cityOrTown: userSettings.profile?.cityOrTown,
        county: userSettings.profile?.county,
        imageUrl: userSettings.profile?.imageUrl,
        nextOfKin: userSettings.profile?.nextOfKin,
        nextOfKinPhoneNo: userSettings.profile?.nextOfKinPhoneNo,
        emergencyContact: userSettings.profile?.emergencyContact,
        username: userSettings.username,
        email: userSettings.email,
    };

    const raw = userSettings.roleSpecific;
    const roleSpecific = {
        doctor: raw.doctor
            ? {
                  aboutBio: raw.doctor.bio ?? undefined,
                  qualifications: raw.doctor.qualifications ?? undefined,
                  yearsOfExperience: raw.doctor.yearsOfExperience ?? undefined,
                  workingHours: raw.doctor.workingHours ?? undefined,
                  status: raw.doctor.status ?? undefined,
              }
            : undefined,
        nurse: raw.nurse
            ? {
                  aboutBio: raw.nurse.bio ?? undefined,
                  yearsOfExperience: raw.nurse.yearsOfExperience ?? undefined,
                  workingHours: raw.nurse.workingHours ?? undefined,
                  status: raw.nurse.status ?? undefined,
              }
            : undefined,
        staff: raw.staff
            ? {
                  aboutBio: raw.staff.bio ?? undefined,
                  yearsOfExperience: raw.staff.yearsOfExperience ?? undefined,
                  workingHours: raw.staff.workingHours ?? undefined,
                  status: raw.staff.status ?? undefined,
              }
            : undefined,
    };

    return (
        <>
            <h1 className="text-xl font-bold bg-bluelight/5 p-2 rounded-[10px]">
                Settings
            </h1>
            <Tabs
                defaultValue="account"
                className="w-full bg-bluelight/5 p-2 rounded-[10px]"
            >
                <TabsList className="grid w-full grid-cols-4 bg-white rounded-[10px] shadow-sm shadow-gray-400">
                    <TabsTrigger
                        value="account"
                        className="hover:bg-primary hover:text-white rounded-tl-[10px] rounded-bl-[10px]"
                    >
                        Account
                    </TabsTrigger>
                    <TabsTrigger
                        value="notifications"
                        className="border-l-2 hover:bg-primary hover:text-white"
                    >
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="border-l-2 hover:bg-primary hover:text-white"
                    >
                        Security
                    </TabsTrigger>
                    <TabsTrigger
                        value="support"
                        className="border-l-2 hover:bg-primary hover:text-white rounded-tr-[10px] rounded-br-[10px]"
                    >
                        Support
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <AccountTab
                        profile={profileData}
                        username={userSettings.username}
                        email={userSettings.email}
                        roleSpecific={roleSpecific}
                        role={userSettings.role as Role}
                    />
                </TabsContent>

                <TabsContent value="notifications">
                    <NotificationsTab
                        notificationSettings={userSettings.notificationSettings}
                    />
                </TabsContent>

                <TabsContent value="security">
                    <SecurityTab />
                </TabsContent>

                <TabsContent value="support">
                    <SupportTab />
                </TabsContent>
            </Tabs>
        </>
    );
}
