// src/components/sidebar/ui/SidebarLinks.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    CalendarIcon,
    ChevronRightIcon,
    DashboardIcon,
    GearIcon,
    EnvelopeClosedIcon,
} from "@radix-ui/react-icons";
import { Role } from "@/lib/definitions";
import HospitalsDropdown from "./HospitalsDropdown";
import DoctorsDropdown from "./DoctorsDropdown";
import PatientsDropdown from "./PatientsDropdown";

interface SidebarLinksProps {
    role?: Role;
}

const SidebarLinks: React.FC<SidebarLinksProps> = ({ role }) => {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href;

    const linkBaseClasses =
        "py-2 px-4 pt-4 pb-4 font-semibold flex items-center border-b border-t border-border text-xs sm:text-sm";

    return (
        <div className="flex flex-col">
            <Link
                href="/dashboard"
                className={`${linkBaseClasses} ${
                    isActive("/dashboard")
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                }`}
            >
                <DashboardIcon className="mr-2 text-xl" />
                Dashboard
            </Link>

            {(role === Role.ADMIN || role === Role.SUPER_ADMIN) && (
                <HospitalsDropdown isActive={isActive} role={role} />
            )}

            <Link
                href="/dashboard/appointments"
                className={`${linkBaseClasses} ${
                    isActive("/dashboard/appointments")
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                }`}
            >
                <CalendarIcon className="mr-2 text-xl" />
                Appointments
                <ChevronRightIcon className="ml-auto text-xl" />
            </Link>

            {role !== Role.DOCTOR && (
                <DoctorsDropdown
                    isActive={isActive}
                    currentPath="/dashboard/doctors"
                />
            )}

            <PatientsDropdown isActive={isActive} role={role} />

            <Link
                href="/dashboard/messaging"
                className={`${linkBaseClasses} ${
                    isActive("/dashboard/messaging")
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                }`}
            >
                <EnvelopeClosedIcon className="mr-2 !text-base" />
                Messaging
            </Link>

            <Link
                href="/dashboard/settings"
                className={`${linkBaseClasses} ${
                    isActive("/dashboard/settings")
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                }`}
            >
                <GearIcon className="mr-2 text-xl" />
                Settings
            </Link>
        </div>
    );
};

export default SidebarLinks;
