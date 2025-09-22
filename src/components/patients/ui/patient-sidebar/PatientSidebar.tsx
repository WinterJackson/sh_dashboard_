// src/components/patients/patient-sidebar/PatientSidebar.tsx

"use client";

import AddAppointmentDialog from "@/components/appointments/ui/appointment-modals/AddAppointmentDialog";
import { Button } from "@/components/ui/button";
import { calculateAge } from "@/hooks/useCalculateAge";
import { formatDate } from "@/hooks/useFormatDate";
import { BasicInfoInput, useUpdateBasicInfo } from "@/hooks/useUpdateBasicInfo";
import { KinInfoInput, useUpdateKinInfo } from "@/hooks/useUpdateKinInfo";
import { Patient } from "@/lib/definitions";
import Image from "next/image";
import { useState } from "react";
import pp from "../../../../../public/images/profile-placeholder.png";
import { BasicInfoDialog } from "./BasicInfoDialog";
import { KinInfoDialog } from "./KinInfoDialog";

export default function PatientSidebar({ patient }: { patient: Patient }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isBasicEditOpen, setIsBasicEditOpen] = useState(false);
    const [isKinEditOpen, setIsKinEditOpen] = useState(false);

    const { mutateAsync: mutateBasic } = useUpdateBasicInfo(patient.patientId);
    const { mutateAsync: mutateKin } = useUpdateKinInfo(patient.patientId);

    const updateBasic = async (data: BasicInfoInput): Promise<void> => {
        await mutateBasic(data);
    };

    const updateKin = async (data: KinInfoInput): Promise<void> => {
        await mutateKin(data);
    };

    const profile = patient.user?.profile;
    const user = patient.user;

    return (
        <div className="bg-slate shadow-md shadow-shadow-main rounded-[10px] p-4 w-[300px]">
            <div className="flex bg-background items-center py-2 px-1 rounded-[10px]">
                <div className="w-1/2 p-2">
                    <Image
                        src={profile?.imageUrl || pp}
                        alt={`${profile?.firstName} ${profile?.lastName}'s profile`}
                        width={100}
                        height={100}
                        className="rounded-full border-2"
                    />
                </div>
                <div className="flex flex-col gap-1 w-1/2 p-2">
                    <h2 className="text-base text-foreground font-semibold">
                        {profile?.firstName} {profile?.lastName}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Reg: {patient.patientId}
                    </p>
                    <p className="text-muted-foreground text-sm">
                        {profile?.gender || "N/A"}
                    </p>
                    <p className="text-muted-foreground text-sm">
                        {profile?.dateOfBirth
                            ? calculateAge(profile.dateOfBirth)
                            : "N/A"}{" "}
                        Years
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Date Joined: {formatDate(patient.createdAt)}
                    </p>
                </div>
            </div>

            <div className="mt-4 bg-background border-t border-foreground">
                <h3 className="mt-2 flex justify-between items-center p-2 font-semibold text-base text-primary bg-slate">
                    <span>Basic Information</span>
                    <Button
                        size="sm"
                        className="rounded-[10px] bg-primary text-primary-foreground hover:text-primary-foreground hover:bg-primary/50"
                        onClick={() => setIsBasicEditOpen(true)}
                    >
                        Edit
                    </Button>
                </h3>
                <div className="mt-2 space-y-2 p-2">
                    <p className="text-[15px]">
                        <strong>Marital Status:</strong>{" "}
                        {patient.maritalStatus || "N/A"}
                    </p>
                    <p className="text-[15px]">
                        <strong>Occupation:</strong>{" "}
                        {patient.occupation || "N/A"}
                    </p>
                    <p className="text-[15px]">
                        <strong>Home Address:</strong>{" "}
                        {profile?.address || "N/A"}
                    </p>
                    <p className="text-[15px]">
                        <strong>Phone:</strong> {profile?.phoneNo || "N/A"}
                    </p>
                    <p className="text-[15px]">
                        <strong>Email:</strong> {user?.email || "N/A"}
                    </p>
                </div>
            </div>

            <div className="mt-4 bg-background border-t border-foreground">
                <h3 className="flex mt-2 justify-between items-center p-2 font-semibold text-base text-primary bg-slate rounded-[10px]">
                    <span>Next Of Kin Information</span>
                    <Button
                        size="sm"
                        className="rounded-[10px] bg-primary text-primary-foreground hover:text-primary-foreground hover:bg-primary/50"
                        onClick={() => setIsKinEditOpen(true)}
                    >
                        Edit
                    </Button>
                </h3>
                <div className="mt-2 space-y-2 p-2">
                    <p className="text-[15px]">
                        <strong>Name:</strong> {patient.nextOfKinName || "N/A"}
                    </p>
                    <p className="text-[15px]">
                        <strong>Relationship:</strong>{" "}
                        {patient.nextOfKinRelationship || "N/A"}
                    </p>
                    <p className="text-[15px]">
                        <strong>Home Address:</strong>{" "}
                        {patient.nextOfKinHomeAddress || "N/A"}
                    </p>
                    <p className="text-[15px]">
                        <strong>Phone:</strong>{" "}
                        {patient.nextOfKinPhoneNo || "N/A"}
                    </p>
                    <p className="text-[15px]">
                        <strong>Email:</strong>{" "}
                        {patient.nextOfKinEmail || "N/A"}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex flex-col space-y-4 border-t border-foreground">
                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-background mt-6 shadow-sm shadow-shadow-main px-4 py-3 text-foreground text-xs font-semibold rounded-[10px] hover:bg-primary hover:border-primary hover:text-primary-foreground"
                >
                    Add Appointment +
                </button>

                <AddAppointmentDialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    patient={patient}
                />

                <button className="bg-background shadow-sm shadow-shadow-main px-4 py-3 text-foreground text-xs font-semibold rounded-[10px] hover:bg-primary hover:border-primary hover:text-primary-foreground">
                    Send Message
                </button>
            </div>

            {/* Basic Info Dialog */}
            <BasicInfoDialog
                patient={patient}
                open={isBasicEditOpen}
                onOpen={() => setIsBasicEditOpen(true)}
                onClose={() => setIsBasicEditOpen(false)}
                onSubmitHandler={updateBasic}
            />

            {/* Next of Kin Info Dialog */}
            <KinInfoDialog
                patient={patient}
                open={isKinEditOpen}
                onOpen={() => setIsKinEditOpen(true)}
                onClose={() => setIsKinEditOpen(false)}
                onSubmit={updateKin}
            />
        </div>
    );
}
