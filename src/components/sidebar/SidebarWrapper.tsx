// src/components/sidebar/SidebarWrapper.tsx

"use client";

import { Profile, Session } from "@/lib/definitions";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

type SidebarWrapperProps = {
    session: Session | null;
    profileData: Profile;
};

export default function SidebarWrapper({
    session,
    profileData,
}: SidebarWrapperProps) {
    const pathname = usePathname();

    return (
        <Sidebar
            pathname={pathname}
            session={session}
            profileData={profileData}
        />
    );
}
