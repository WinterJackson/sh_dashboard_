// src/app/(auth)/dashboard/patients/[patientId]/page.tsx

import { notFound, redirect } from "next/navigation";
import PatientProfile from "@/components/patients/PatientProfile";
import { fetchPatientDetailsById } from "@/lib/data-access/patients/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function PatientProfilePage({
    params,
}: {
    params: { patientId: string };
}) {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return null;
    }

    const patientId = parseInt(params.patientId);

    if (isNaN(patientId)) {
        return notFound();
    }

    const patient = await fetchPatientDetailsById(patientId);

    if (!patient) {
        return notFound();
    }

    return <PatientProfile patient={patient} />;
}
