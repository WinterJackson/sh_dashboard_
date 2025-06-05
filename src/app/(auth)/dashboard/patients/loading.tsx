// src/app/(auth)/dashboard/patients/loading.tsx

"use client"

import { BeatLoader } from "react-spinners";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-[70vh]">
            <BeatLoader color="rgb(1, 107, 210, 0.2)" size={20} />
        </div>
    );
}
