// src/components/patients/ui/add-new-patient/AddPatientForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormProvider } from "react-hook-form";
import { useCreatePatient } from "@/hooks/useCreatePatient";
import { Role } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import MedicalInfoSection from "./sections/MedicalInfoSection";
import PatientInfoSection from "./sections/PatientInfoSection";
import UserInfoSection from "./sections/UserInfoSection";
import { CreatePatientInput } from "@/lib/data-access/patients/data";
import ProfileImageSection from "./sections/ProfileImageSection";
import { useState } from "react";
import { base64ToFile } from "@/lib/utils";
import { useEdgeStore } from "@/lib/edgestore";

const patientSchema = z.object({
    user: z.object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
    }),
    profile: z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        gender: z.string().optional(),
        phoneNo: z.string().optional(),
        address: z.string().optional(),
        dateOfBirth: z.string().optional(),
        cityOrTown: z.string().optional(),
        county: z.string().optional(),
        imageUrl: z.string().optional(),
        nextOfKin: z.string().optional(),
        nextOfKinPhoneNo: z.string().optional(),
        emergencyContact: z.string().optional(),
    }),
    patient: z.object({
        maritalStatus: z.string().optional(),
        occupation: z.string().optional(),
        nextOfKinName: z.string().optional(),
        nextOfKinRelationship: z.string().optional(),
        nextOfKinHomeAddress: z.string().optional(),
        nextOfKinPhoneNo: z.string().optional(),
        nextOfKinEmail: z.string().optional(),
        reasonForConsultation: z.string().min(1, "Reason is required"),
        admissionDate: z.string().optional(),
        dischargeDate: z.string().optional(),
        status: z.string().default("Outpatient"),
    }),
    medical: z.object({
        height: z.number().optional(),
        weight: z.number().optional(),
        bloodGroup: z.string().optional(),
        allergies: z.string().optional(),
        alcohol: z.boolean().default(false),
        drugs: z.boolean().default(false),
    }),
    hospitalId: z.number().min(1, "Hospital is required"),
});

export type PatientFormValues = z.infer<typeof patientSchema>;

interface AddPatientFormProps {
    hospitalId: number | null;
    userRole: Role;
}

export default function AddPatientForm({
    hospitalId: initialHospitalId,
    userRole,
}: AddPatientFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { edgestore } = useEdgeStore();
    const [profileImageData, setProfileImageData] = useState<string | null>(null);

    const createPatientMutation = useCreatePatient({
        role: userRole,
        hospitalId: initialHospitalId ?? 0,
    });

    const form = useForm<PatientFormValues>({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            user: { username: "", email: "" },
            profile: { firstName: "", lastName: "" },
            patient: { status: "Outpatient", reasonForConsultation: "" },
            medical: { alcohol: false, drugs: false },
            hospitalId: initialHospitalId ?? undefined,
        },
    });

    const onSubmit = async (data: PatientFormValues) => {
        if (!data.hospitalId || data.hospitalId < 1) {
            toast({
                title: "Hospital Required",
                description: "Please select a valid hospital.",
                variant: "destructive",
            });
            return;
        }

        let imageUrl = data.profile.imageUrl;
        if (profileImageData) {
            try {
                const file = base64ToFile(profileImageData, "profile.jpg");
                const res = await edgestore.doctorImages.upload({ file });
                imageUrl = res.url;
            } catch (error) {
                toast({
                    title: "Image Upload Failed",
                    description: "Could not upload the profile image.",
                    variant: "destructive",
                });
                return;
            }
        }

        const payload: CreatePatientInput = {
            user: {
                username: data.user.username,
                email: data.user.email,
                password: data.user.username,
            },
            profile: { ...data.profile, imageUrl },
            patient: data.patient,
            medical: data.medical,
            hospitalId: data.hospitalId,
            createdByRole: userRole,
        };

        createPatientMutation.mutate(payload, {
            onSuccess: () => {
                toast({
                    title: "Patient Created",
                    description: `Patient account created. Default password is "${data.user.username}".`,
                    duration: 7000,
                });
                router.push("/dashboard/patients");
            },
            onError: (error) => {
                toast({
                    title: "Creation Failed",
                    description:
                        error instanceof Error
                            ? error.message
                            : "Unable to create patient.",
                    variant: "destructive",
                    duration: 5000,
                });
            },
        });
    };

    const isSubmitting = createPatientMutation.status === "pending";

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 p-6 bg-slate rounded-[10px] shadow-md"
            >
                <div className="flex flex-col lg:flex-row w-full gap-6">
                    <ProfileImageSection setProfileImageData={setProfileImageData} />
                    <div className="flex flex-col gap-6 w-full lg:w-2/3">
                        <UserInfoSection form={form} userRole={userRole} />
                    </div>
                </div>
                <PatientInfoSection form={form} />
                <MedicalInfoSection form={form} />

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/dashboard/patients")}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Patient"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}