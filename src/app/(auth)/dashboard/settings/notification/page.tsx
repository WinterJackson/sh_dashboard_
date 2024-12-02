// src/app/(auth)/dashboard/settings/notification/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Toggle from "@/components/settings/toogle button/Toogle";
import React from "react";

export default async function NotificationSettingsPage() {
    // Fetch session data
    const session = await getServerSession(authOptions);

    // Redirect unauthenticated users to the sign-in page
    if (!session || !session.user) {
        redirect("/sign-in");
        return null;
    }

    return (
        <div className="flex flex-col w-full h-full gap-4">
            <div className="flex justify-between items-center gap-20">
                <p className="capitalize ">
                    Edit your notifications preferences here
                </p>
                <div className="flex gap-5 items-center pr-7">
                    {/* save button  */}
                    <button className="p-3 rounded-xl border-2 border-primary bg-primary hover:border-blue-400 hover:bg-blue-400 duration-400 px-7 text-white font-bold">
                        Save Changes
                    </button>
                    <button className="p-3 rounded-xl border-2 border-black  hover:border-blue-400 hover:bg-blue-400 duration-400 hover:text-white px-7 font-bold">
                        Cancel
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-8">
                <h1 className="font-bold text-primary">Notification</h1>
                <div className="bg-white flex flex-col gap-5 p-5 shadow-lg rounded-xl">
                    <div className="flex justify-between items-end max-w-[900px] ">
                        <div className="flex flex-col gap-4">
                            <h2 className="font-bold ">Appointment Alerts</h2>
                            <p className="capitalize">
                                Recieve notifications for upcoming appointments
                                and bookings.{" "}
                            </p>
                        </div>
                        <button className="flex">
                            <Toggle />
                        </button>
                    </div>
                    <div className="flex justify-between items-end max-w-[900px] ">
                        <div className="flex flex-col gap-4">
                            <h2 className="font-bold ">Email Alerts</h2>
                            <p className="capitalize">
                                Stay informed with email alerts and updates.
                            </p>
                        </div>
                        <button className="flex">
                            <Toggle />
                        </button>
                    </div>
                    <div className="flex justify-between items-end max-w-[900px] ">
                        <div className="flex flex-col gap-4">
                            <h2 className="font-bold ">Security Alerts</h2>
                            <p className="capitalize">
                                Enhance your account&apos;s security with
                                real-time security notifications.
                            </p>
                        </div>
                        <button className="flex">
                            <Toggle />
                        </button>
                    </div>
                    <div className="flex justify-between items-end max-w-[900px] ">
                        <div className="flex flex-col gap-4">
                            <h2 className="font-bold ">System Updates </h2>
                            <p className="capitalize">
                                stay Up-to-date with the latest system
                                improvements and changes.
                            </p>
                        </div>
                        <button className="flex">
                            <Toggle />
                        </button>
                    </div>
                    <div className="flex justify-between items-end max-w-[900px] ">
                        <div className="flex flex-col gap-4">
                            <h2 className="font-bold ">New Device Login</h2>
                            <p className="capitalize">
                                Be notified when a new device logs into your
                                account.
                            </p>
                        </div>
                        <button className="flex">
                            <Toggle />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
