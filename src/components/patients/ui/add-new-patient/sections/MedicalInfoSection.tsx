// src/components/patients/ui/add-new-patient/sections/MedicalInfoSection.tsx

"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { PatientFormValues } from "../AddPatientForm";

interface MedicalInfoSectionProps {
    form: UseFormReturn<PatientFormValues>;
}

export default function MedicalInfoSection({ form }: MedicalInfoSectionProps) {
    return (
        <div className="flex flex-col gap-6 bg-white shadow-sm shadow-gray-400 w-full p-4 rounded-xl">
            <span className="text-primary font-semibold border-b-2 border-gray-300">
                Medical Information
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Height */}
                <FormField
                    control={form.control}
                    name="medical.height"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter height"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Weight */}
                <FormField
                    control={form.control}
                    name="medical.weight"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter weight"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Blood Group */}
                <FormField
                    control={form.control}
                    name="medical.bloodGroup"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Blood Group</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., O+" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Allergies */}
                <FormField
                    control={form.control}
                    name="medical.allergies"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Allergies</FormLabel>
                            <FormControl>
                                <Input placeholder="List any allergies" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Alcohol Consumption */}
                <FormField
                    control={form.control}
                    name="medical.alcohol"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                            <FormLabel>Alcohol Consumption</FormLabel>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Drug Use */}
                <FormField
                    control={form.control}
                    name="medical.drugs"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                            <FormLabel>Drug Use</FormLabel>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
