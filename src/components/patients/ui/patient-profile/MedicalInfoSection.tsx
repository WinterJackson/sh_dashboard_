// src/components/patients/MedicalInfoSection.tsx

"use client";

import { useState, useEffect } from "react";
import { MedicalInformation } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateMedicalInfo } from "@/hooks/useUpdateMedicalInfo";

export default function MedicalInfoSection({
    data,
}: {
    data?: MedicalInformation;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<MedicalInformation>>(
        data || {}
    );
    const updateMedicalInfo = useUpdateMedicalInfo();

    useEffect(() => {
        if (data) {
            setFormData(data);
        }
    }, [data]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "alcohol" || name === "drugs"
                    ? value === "true"
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data?.patientId) return;

        try {
            await updateMedicalInfo.mutateAsync({
                patientId: data.patientId,
                data: formData,
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update medical info:", error);
        }
    };

    return (
        <div className="bg-slate p-4 rounded-[10px] shadow-md shadow-shadow-main">
            <div className="flex justify-between items-center mb-6 p-2 bg-background rounded-[10px]">
                <h2 className="text-base text-primary font-semibold">
                    Medical Information
                </h2>
                <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline"
                    className="bg-primary text-primary-foreground hover:bg-primary/50"
                >
                    {isEditing ? "Cancel" : "Edit"}
                </Button>
            </div>

            {isEditing ? (
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-4 gap-4 p-2"
                >
                    <div className="space-y-2 bg-background rounded-[10px] shadow-md shadow-shadow-main p-2">
                        <label className="block text-sm text-foreground font-medium">
                            Height (m)
                        </label>
                        <Input
                            type="number"
                            name="height"
                            value={formData.height || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2 bg-background rounded-[10px] shadow-md shadow-shadow-main p-2">
                        <label className="block text-sm text-foreground font-medium">
                            Weight (kg)
                        </label>
                        <Input
                            type="number"
                            name="weight"
                            value={formData.weight || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2 bg-background rounded-[10px] shadow-md shadow-shadow-main p-2">
                        <label className="block text-sm text-foreground font-medium">
                            Blood Group
                        </label>
                        <Input
                            type="text"
                            name="bloodGroup"
                            value={formData.bloodGroup || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2 bg-background rounded-[10px] shadow-md shadow-shadow-main p-2">
                        <label className="block text-sm text-foreground font-medium">
                            Body Type
                        </label>
                        <Input
                            type="text"
                            name="bodyType"
                            value={formData.bodyType || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2 bg-background rounded-[10px] shadow-md shadow-shadow-main p-2">
                        <label className="block text-sm text-foreground font-medium">
                            Allergies
                        </label>
                        <Input
                            type="text"
                            name="allergies"
                            value={formData.allergies || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2 bg-background rounded-[10px] shadow-md shadow-shadow-main p-2">
                        <label className="block text-sm text-foreground font-medium">
                            Alcohol Use
                        </label>
                        <select
                            name="alcohol"
                            value={formData.alcohol?.toString() || "false"}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-[5px] text-sm bg-background"
                        >
                            <option className="text-sm" value="true">Yes</option>
                            <option className="text-sm" value="false">No</option>
                        </select>
                    </div>

                    <div className="space-y-2 bg-background rounded-[10px] shadow-md shadow-shadow-main p-2">
                        <label className="block text-sm text-foreground font-medium">
                            Drug Use
                        </label>
                        <select
                            name="drugs"
                            value={formData.drugs?.toString() || "false"}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-[5px] text-sm bg-background"
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <div className="col-span-4">
                        <Button type="submit" className="w-full">
                            Save Changes
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-4 gap-4 p-2">
                    <div className="bg-background rounded-[10px] shadow-md shadow-shadow-main p-2">
                        <p className="font-medium text-sm text-foreground  text-nowrap">Height (m)</p>
                        <p className="font-semibold p-3 pl-3 border text-sm text-destructive">{data?.height || "N/A"} m</p>
                    </div>
                    <div className="bg-background rounded-[10px] shadow-md shadow-shadow-main p-2">
                        <p className="font-medium text-sm text-foreground  text-nowrap">Weight (Kg)</p>
                        <p className="font-semibold p-3 pl-3 border text-sm text-destructive">{data?.weight || "N/A"} kg</p>
                    </div>
                    <div className="bg-background rounded-[10px] shadow-md shadow-shadow-main p-2">
                        <p className="font-medium text-sm text-foreground  text-nowrap">Blood Group</p>
                        <p className="font-semibold p-3 pl-3 border text-sm text-destructive">{data?.bloodGroup || "N/A"}</p>
                    </div>
                    <div className="bg-background rounded-[10px] shadow-md shadow-shadow-main p-2">
                        <p className="font-medium text-sm text-foreground  text-nowrap">Body Type</p>
                        <p className="font-semibold p-3 pl-3 border text-sm text-destructive">{data?.bodyType || "N/A"}</p>
                    </div>
                    <div className="bg-background rounded-[10px] shadow-md shadow-shadow-main p-2">
                        <p className="font-medium text-sm text-foreground  text-nowrap">Allergies</p>
                        <p className="font-semibold p-3 pl-3 border text-sm text-destructive">{data?.allergies || "N/A"}</p>
                    </div>
                    <div className="bg-background rounded-[10px] shadow-md shadow-shadow-main p-2">
                        <p className="font-medium text-sm text-foreground  text-nowrap">Alcohol Use</p>
                        <p className="font-semibold p-3 pl-3 border text-sm text-destructive">{data?.alcohol ? "Yes" : "No"}</p>
                    </div>
                    <div className="bg-background rounded-[10px] shadow-md shadow-shadow-main p-2">
                        <p className="font-medium text-sm text-foreground  text-nowrap">Drug Use</p>
                        <p className="font-semibold p-3 pl-3 border text-sm text-destructive">{data?.drugs ? "Yes" : "No"}</p>
                    </div>
                    <div className="bg-background rounded-[10px] shadow-md shadow-shadow-main p-2">
                        <p className="font-medium text-sm text-foreground  text-nowrap">BMI</p>
                        <p className="font-semibold p-3 pl-3 border text-sm text-destructive">{data?.bmi?.toFixed(1) || "N/A"}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
