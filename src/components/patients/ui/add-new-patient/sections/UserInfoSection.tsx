// src/components/patients/ui/add-new-patient/sections/UserInfoSection.tsx

"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PatientFormValues } from "../AddPatientForm";
import { Role } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { useFetchHospitals } from "@/hooks/useFetchHospitals";

interface UserInfoSectionProps {
    form: UseFormReturn<PatientFormValues>;
    userRole: Role;
}

export default function UserInfoSection({
    form,
    userRole,
}: UserInfoSectionProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const { data: hospitals = [] } = useFetchHospitals({
        role: userRole,
        hospitalId: null,
        userId: null,
    });

    const filteredHospitals = hospitals.filter((h) =>
        h.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        // For super-admins, auto-select the first hospital once they're loaded
        if (userRole === Role.SUPER_ADMIN && hospitals.length > 0 && !form.getValues("hospitalId")) {
            form.setValue("hospitalId", hospitals[0].hospitalId);
        }
    }, [userRole, hospitals, form]);

    return (
        <div className="flex flex-col gap-6 bg-background border border-border p-6 rounded-xl shadow-sm w-full">
            <span className="text-primary font-semibold border-b-2 border-border pb-2">
                Patient Info
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hospital Select for SUPER_ADMIN */}
                {userRole === Role.SUPER_ADMIN && (
                    <FormField
                        control={form.control}
                        name="hospitalId"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2 mb-2">
                                <FormLabel className="text-sm font-semibold">
                                    Hospital
                                </FormLabel>
                                <FormControl>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            placeholder="Search hospital name..."
                                            className="px-3 py-2 mt-4 bg-slate border rounded-[5px] text-sm"
                                        />
                                        <select
                                            value={field.value ?? ""}
                                            onChange={(e) => {
                                                const selectedId = Number(
                                                    e.target.value
                                                );
                                                if (selectedId > 0) {
                                                    field.onChange(selectedId);
                                                }
                                            }}
                                            className="px-2 py-3 bg-slate mt-4 focus:outline outline-2 outline-primary max-h-40 overflow-y-auto text-sm rounded-[5px]"
                                        >
                                            <option
                                                value=""
                                                disabled
                                                className="text-gray-400 text-sm"
                                            >
                                                Select a hospital
                                            </option>
                                            {filteredHospitals.map(
                                                (hospital) => (
                                                    <option
                                                        key={
                                                            hospital.hospitalId
                                                        }
                                                        value={
                                                            hospital.hospitalId
                                                        }
                                                        className="text-sm"
                                                    >
                                                        {hospital.hospitalName}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Username */}
                <FormField
                    control={form.control}
                    name="user.username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter username"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Email */}
                <FormField
                    control={form.control}
                    name="user.email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* First Name */}
                <FormField
                    control={form.control}
                    name="profile.firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter first name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Last Name */}
                <FormField
                    control={form.control}
                    name="profile.lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter last name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Phone Number */}
                <FormField
                    control={form.control}
                    name="profile.phoneNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter phone number"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Date of Birth */}
                <FormField
                    control={form.control}
                    name="profile.dateOfBirth"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                                <Input
                                    className="w-auto"
                                    type="date"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Address */}
                <FormField
                    control={form.control}
                    name="profile.address"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
