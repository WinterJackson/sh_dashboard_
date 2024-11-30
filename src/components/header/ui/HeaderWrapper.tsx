// src/components/ui/dashboard/HeaderWrapper.tsx

"use client";

import React, { useState } from "react";
import Header from "./../Header";
import dynamic from "next/dynamic";

// Dynamic imports for dialogs
const AddAppointmentDialog = dynamic(() => import("@/components/appointments/AddAppointmentDialog"));
const ReferPatientDialog = dynamic(() => import("@/components/referral/ReferPatientDialog"));

// Define the expected type of profileData based on HeaderProps
type ProfileData = {
    firstName: string;
    user: {
        role: string;
    };
    imageUrl: string | null;
} | null;

interface HeaderWrapperProps {
    profileData: ProfileData;
}

const HeaderWrapper: React.FC<HeaderWrapperProps> = ({ profileData }) => {
    const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);
    const [openReferDialog, setOpenReferDialog] = useState(false);

    const handleAddAppointment = () => setOpenAppointmentDialog(true);
    const handleReferPatient = () => setOpenReferDialog(true);
    const handleDialogClose = () => {
        setOpenAppointmentDialog(false);
        setOpenReferDialog(false);
    };

    return (
        <>
            <Header
                profileData={profileData}
                onAddAppointment={handleAddAppointment}
                onReferPatient={handleReferPatient}
            />
            {openAppointmentDialog && <AddAppointmentDialog onClose={handleDialogClose} />}
            {openReferDialog && <ReferPatientDialog onClose={handleDialogClose} />}
        </>
    );
};

export default HeaderWrapper;
