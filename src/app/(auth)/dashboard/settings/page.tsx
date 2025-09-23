// src/app/(auth)/dashboard/settings/page.tsx

export const dynamic = 'force-dynamic';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import dynamicImport from "next/dynamic";
const AccountTab = dynamicImport(() => import("@/components/settings/tabs/AccountTab"));
const NotificationsTab = dynamicImport(() => import("@/components/settings/tabs/NotificationsTab"));
const SecurityTab = dynamicImport(() => import("@/components/settings/tabs/SecurityTab"));
const SupportTab = dynamicImport(() => import("@/components/settings/tabs/SupportTab"));
import { fetchUserSettings } from "@/lib/data-access/settings/data";
import { Role } from "@/lib/definitions";
import type { ExtendedProfileUpdateData } from "@/components/settings/tabs/AccountTab";
import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/sign-in");
    }

    const userSettings = await fetchUserSettings(session.user.id);

    // If userSettings is null (e.g., user not found in DB, or no session during build),
    // redirect to sign-in. This handles the prerendering case gracefully.
    if (!userSettings) {
        redirect("/sign-in");
    }

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
        <div className="flex flex-col gap-3 pt-0">
            <div className="flex items-center gap-2 bg-slate p-2 rounded-[10px] w-full">
                <h1 className="text-xl font-bold">Settings</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info
                                size={18}
                                className="text-text-muted cursor-pointer"
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                Manage your account settings across the
                                following tabs:
                                <br />
                                <br />
                                - <strong>Account</strong>: View and
                                update personal profile and contact info.
                                <br />
                                <br />
                                - <strong>Notifications</strong>: Control
                                which types of notifications you receive.
                                <br />
                                <br />
                                - <strong>Security</strong>: Manage
                                password and two-factor authentication settings.
                                <br />
                                <br />
                                - <strong>Support</strong>: Reach out to
                                our help team for assistance.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <Tabs defaultValue="account" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto bg-slate rounded-[10px] px-2 py-1 h-auto">
                    <TabsTrigger value="account" className="whitespace-nowrap">Account</TabsTrigger>
                    <TabsTrigger value="notifications" className="whitespace-nowrap">Notifications</TabsTrigger>
                    <TabsTrigger value="security" className="whitespace-nowrap">Security</TabsTrigger>
                    <TabsTrigger value="support" className="whitespace-nowrap">Support</TabsTrigger>
                </TabsList>

                <div className="bg-slate p-2 mt-4 rounded-[10px]">
                <TabsContent value="account" className="mt-4 border-0">
                    <AccountTab
                        profile={profileData}
                        username={userSettings.username}
                        email={userSettings.email}
                        roleSpecific={roleSpecific}
                        role={userSettings.role as Role}
                    />
                </TabsContent>

                <TabsContent value="notifications" className="mt-4 border-0">
                    <NotificationsTab
                        notificationSettings={userSettings.notificationSettings}
                    />
                </TabsContent>

                <TabsContent value="security" className="mt-4 border-0">
                    <SecurityTab />
                </TabsContent>

                <TabsContent value="support" className="mt-4 border-0">
                    <SupportTab />
                </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}