// src/app/(auth)/dashboard/patients/page.tsx

"use client";

import React, { useState } from "react";
import AdminPatients from "@/components/patients/AdminPatients";
import Doc_Patients from "@/components/patients/Doc_Patients";

type Props = {};

export default function Patientspage({}: Props) {
    // const [showOptions, setShowOptions] = useState(false);
 

    // Test conditional rendering
    const [admin, setAdmin] =useState(false)
    // Test conditional rendering

    
    // const options = () => {
    //     setShowOptions(!showOptions);
    // };
    return (
        <>
        {admin ? (
            <AdminPatients/>
        ):(
            <Doc_Patients/>
        )
        }
        </>
    );
}
