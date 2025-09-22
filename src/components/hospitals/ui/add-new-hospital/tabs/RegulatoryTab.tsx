// src/components/hospitals/ui/add-new-hospital/tabs/RegulatoryTab.tsx

"use client";

import { useFormContext } from "react-hook-form";
import {
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { KEPHLevel, HospitalOwnershipType } from "@/lib/definitions";

const RegulatoryTab = () => {
    const { register } = useFormContext();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormItem>
                    <FormLabel>KEPH Level (Optional)</FormLabel>
                    <FormControl>
                        <select
                            {...register("kephLevel")}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            {Object.values(KEPHLevel).map((level) => (
                                <option key={level} value={level}>
                                    {level.replace("_", " ")}
                                </option>
                            ))}
                        </select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                <FormItem>
                    <FormLabel>Ownership Type (Optional)</FormLabel>
                    <FormControl>
                        <select
                            {...register("ownershipType")}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            {Object.values(HospitalOwnershipType).map(
                                (type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                )
                            )}
                        </select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                <FormItem>
                    <FormLabel>Facility Type (Optional)</FormLabel>
                    <FormControl>
                        <Input
                            {...register("facilityType")}
                            placeholder="e.g., Medical Center"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                <FormItem>
                    <FormLabel>Regulatory Body (Optional)</FormLabel>
                    <FormControl>
                        <Input
                            {...register("regulatoryBody")}
                            placeholder="e.g., KMPDC"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                <FormItem>
                    <FormLabel>Regulating Body (Optional)</FormLabel>
                    <FormControl>
                        <Input
                            {...register("regulatingBody")}
                            placeholder="e.g., PPB"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                <FormItem>
                    <FormLabel>Regulation Status (Optional)</FormLabel>
                    <FormControl>
                        <Input
                            {...register("regulationStatus")}
                            placeholder="e.g., Licensed"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                <FormItem>
                    <FormLabel>Registration Number (Optional)</FormLabel>
                    <FormControl>
                        <Input
                            {...register("registrationNumber")}
                            placeholder="Enter registration number"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                <FormItem>
                    <FormLabel>License Number (Optional)</FormLabel>
                    <FormControl>
                        <Input
                            {...register("licenseNumber")}
                            placeholder="Enter license number"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                <FormItem>
                    <FormLabel>NHIF Accreditation (Optional)</FormLabel>
                    <FormControl>
                        <Input
                            {...register("nhifAccreditation")}
                            placeholder="Yes/No"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                <FormItem>
                    <FormLabel>Regulated? (Optional)</FormLabel>
                    <FormControl>
                        <Input
                            {...register("regulated")}
                            placeholder="Yes/No"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </div>
        </div>
    );
};

export default RegulatoryTab;
