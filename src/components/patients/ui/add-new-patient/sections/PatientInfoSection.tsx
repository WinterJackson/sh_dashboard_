// src/components/patients/ui/add-new-patient/sections/PatientInfoSection.tsx

"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { PatientFormValues } from "../AddPatientForm";

interface PatientInfoSectionProps {
    form: UseFormReturn<PatientFormValues>;
}

export default function PatientInfoSection({ form }: PatientInfoSectionProps) {
    return (
        <div className="flex flex-col gap-6 bg-background border border-border p-6 rounded-xl shadow-sm w-full">
            <span className="text-primary font-semibold border-b-2 border-border pb-2">
                Additional Information
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Marital Status */}
                <FormField
                    control={form.control}
                    name="patient.maritalStatus"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Marital Status</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., Single, Married"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Occupation */}
                <FormField
                    control={form.control}
                    name="patient.occupation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter occupation"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Status */}
                <FormField
                    control={form.control}
                    name="patient.status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Patient Status</FormLabel>
                            <FormControl>
                                <Input readOnly {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Admission Date */}
                <FormField
                    control={form.control}
                    name="patient.admissionDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Admission Date</FormLabel>
                            <FormControl>
                                <Input className="w-auto" type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Discharge Date */}
                <FormField
                    control={form.control}
                    name="patient.dischargeDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discharge Date</FormLabel>
                            <FormControl>
                                <Input className="w-auto" type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Next of Kin Name */}
                <FormField
                    control={form.control}
                    name="patient.nextOfKinName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Next of Kin Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Next of Kin Relationship */}
                <FormField
                    control={form.control}
                    name="patient.nextOfKinRelationship"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., Parent, Spouse"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Next of Kin Phone */}
                <FormField
                    control={form.control}
                    name="patient.nextOfKinPhoneNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Next of Kin Phone</FormLabel>
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

                {/* Next of Kin Email */}
                <FormField
                    control={form.control}
                    name="patient.nextOfKinEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Next of Kin Email</FormLabel>
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

                {/* Next of Kin Address */}
                <FormField
                    control={form.control}
                    name="patient.nextOfKinHomeAddress"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Next of Kin Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Reason for Consultation */}
                <FormField
                    control={form.control}
                    name="patient.reasonForConsultation"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Reason for Consultation</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe why the patient is consulting"
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
