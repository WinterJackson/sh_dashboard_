// src/components/hospitals/ui/hospitals-table/HospitalRow.tsx

"use client";

import React from "react";
import Link from "next/link";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Hospital, Role } from "@/lib/definitions";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useRouter } from "next/navigation";

type HospitalRowProps = {
    hospital: Hospital;
    onDelete: (hospitalId: number) => void;
    onSelect: (hospitalId: number, checked: boolean) => void;
    isSelected: boolean;
    userRole: Role;
};

const HospitalRow: React.FC<HospitalRowProps> = ({
    hospital,
    onDelete,
    onSelect,
    isSelected,
    userRole,
}) => {
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/dashboard/hospitals/${hospital.hospitalId}`);
    };

    return (
        <tr className="group bg-background shadow-md py-2 hover:bg-primary hover:text-primary-foreground">
            {/* Checkbox Column */}
            {userRole === Role.SUPER_ADMIN && (
                <td className="text-center w-[8%] p-2">
                    <input
                        type="checkbox"
                        className="w-[15px] h-[15px] accent-primary bg-background"
                        checked={isSelected}
                        onChange={(e) =>
                            onSelect(hospital.hospitalId, e.target.checked)
                        }
                    />
                </td>
            )}

            {/* Logo Column */}
            <td className="w-[15%] p-2">
                <div className="flex items-center justify-center">
                    <img
                        src="/images/shlogo.png"
                        alt="Hospital logo"
                        width={100}
                        height={100}
                        className="rounded-[5px] object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                "/images/default-hospital.png";
                        }}
                    />
                </div>
            </td>

            {/* Name and Email Column */}
            <td className="w-[20%] p-2 overflow-hidden">
                <Link href={`/dashboard/hospitals/${hospital.hospitalId}`}>
                    <div className="flex flex-col">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <p
                                        className="
                                          font-semibold text-[14px]
                                          truncate max-w-[150px]
                                          lg:truncate-none lg:max-w-full lg:whitespace-normal
                                          cursor-pointer
                                        "
                                    >
                                        {hospital.hospitalName}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent className="bg-background text-foreground">
                                    <p>{hospital.hospitalName}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <p
                                        className="
                                          text-sm text-primary
                                          group-hover:text-primary-foreground
                                          truncate max-w-[150px]
                                          lg:truncate-none lg:max-w-full lg:whitespace-nowrap
                                          cursor-pointer
                                        "
                                    >
                                        {hospital.email || "N/A"}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent className="bg-background text-foreground">
                                    <p>{hospital.email || "No email"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </Link>
            </td>

            {/* ID */}
            <td className="text-center w-[10%] p-2 text-[14px]">{hospital.hospitalId}</td>

            {/* Phone */}
            <td className="text-center w-[20%] p-2 text-[14px] whitespace-nowrap">
                {hospital.phone || "N/A"}
            </td>

            {/* County */}
            <td className="text-center w-[10%] p-2 text-[14px]">
                {hospital.county || "N/A"}
            </td>

            {/* Town */}
            <td className="text-center w-[10%] p-2 text-[14px]">
                {hospital.town || "N/A"}
            </td>

            {/* Type Column */}
            <td className="text-center w-[12%] p-2 text-[14px]">
                {hospital.ownershipType
                    ? hospital.ownershipType.replace("_", " ").toLowerCase()
                    : "N/A"}
            </td>

            {/* Level Column*/}
            <td className="text-center w-[10%] p-2 text-[14px]">
                {hospital.kephLevel
                    ? hospital.kephLevel.replace("LEVEL_", "L")
                    : "N/A"}
            </td>

            {/* Ref Code Column*/}
            <td className="text-center w-[10%] p-2 text-[14px]">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="truncate max-w-[100px] cursor-pointer">
                                {hospital.referralCode &&
                                hospital.referralCode.length > 5
                                    ? `${hospital.referralCode.slice(0, 5)}...`
                                    : hospital.referralCode || "N/A"}
                            </p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{hospital.referralCode || "No referral code"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </td>

            {/* Action Column only for SUPER_ADMIN */}
            {userRole === Role.SUPER_ADMIN && (
                <td className="text-center w-[5%] p-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button>
                                <MoreHorizIcon className="cursor-pointer" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-background rounded-xl shadow-md p-2 w-24">
                            <DropdownMenuItem
                                onClick={handleEdit}
                                className="rounded-[5px] flex items-center"
                            >
                                <DriveFileRenameOutlineIcon className="mr-2" />{" "}
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(hospital.hospitalId)}
                                className="rounded-[5px] flex items-center"
                            >
                                <DeleteOutlineIcon className="mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </td>
            )}
        </tr>
    );
};

export default HospitalRow;
