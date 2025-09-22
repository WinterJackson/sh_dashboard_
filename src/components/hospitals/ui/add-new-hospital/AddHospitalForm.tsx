'use client';

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { Role } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import BasicInfoTab from "./tabs/BasicInfoTab";
import ContactTab from "./tabs/ContactTab";
import RegulatoryTab from "./tabs/RegulatoryTab";
import LocationTab from "./tabs/LocationTab";
import OperatingHoursTab from "./tabs/OperatingHoursTab";
import OwnershipTab from "./tabs/OwnershipTab";
import ProgressBar from "./ProgressBar";
import { useEdgeStore } from "@/lib/edgestore";
import { base64ToFile } from "@/lib/utils";
import { zodResolver } from '@hookform/resolvers/zod';
import { hospitalSchema, basicInfoSchema, contactSchema, regulatorySchema, locationSchema, operatingHoursSchema, ownershipSchema } from './hospitalValidation';
import { useAddHospital } from "@/hooks/useAddHospital";

interface AddHospitalFormProps {
    userRole: Role;
}

const AddHospitalFormComponent: React.FC<AddHospitalFormProps> = ({ userRole }) => {
    const { edgestore } = useEdgeStore();
    const router = useRouter();
    const [message, setMessage] = useState<{ text: string; type: "success" | "error"; } | null>(null);
    const [logoImage, setLogoImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [logoImageData, setLogoImageData] = useState<string | null>(null);
    const [currentTab, setCurrentTab] = useState("basic-info");
    const { mutate: addHospital, isPending: isSubmitting } = useAddHospital();

    const methods = useForm({
        resolver: zodResolver(hospitalSchema),
    });

    const handleLogoImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            setLogoImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                setLogoImageData(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: any) => {
        setMessage(null);

        let logoUrl: string | null = null;

        if (logoImageData) {
            try {
                const file = base64ToFile(logoImageData, "logo.jpg");
                const uploadResponse = await edgestore.doctorImages.upload({ file });
                logoUrl = uploadResponse.url;
            } catch (error) {
                console.error("Failed to upload logo image:", error);
                setMessage({ text: "Failed to upload logo image.", type: "error" });
                return;
            }
        }

        const processedData = {
            ...data,
            logoUrl,
            latitude: data.latitude ? parseFloat(data.latitude) : null,
            longitude: data.longitude ? parseFloat(data.longitude) : null,
        };

        addHospital(processedData, {
            onSuccess: () => {
                setMessage({ text: "Hospital added successfully!", type: "success" });
                methods.reset();
                setLogoImage(null);
                setPreviewImage(null);
                router.push("/dashboard/hospitals");
            },
            onError: (error) => {
                setMessage({ text: error.message || "Failed to add hospital. Please try again.", type: "error" });
            }
        });
    };

    const tabs = [
        { value: "basic-info", label: "Basic Info", schema: basicInfoSchema },
        { value: "contact", label: "Contact", schema: contactSchema },
        { value: "regulatory", label: "Regulatory", schema: regulatorySchema },
        { value: "location", label: "Location", schema: locationSchema },
        { value: "operating-hours", label: "Operating Hours", schema: operatingHoursSchema },
        { value: "ownership", label: "Ownership", schema: ownershipSchema },
    ];

    const currentStep = tabs.findIndex(tab => tab.value === currentTab) + 1;

    const handleNext = async () => {
        const currentTabIndex = tabs.findIndex(tab => tab.value === currentTab);
        const currentSchema = tabs[currentTabIndex].schema;
        const result = await currentSchema.safeParseAsync(methods.getValues());
        if (result.success) {
            if (currentTabIndex < tabs.length - 1) {
                setCurrentTab(tabs[currentTabIndex + 1].value);
            }
        } else {
            result.error.errors.forEach(error => {
                methods.setError(error.path[0] as any, { message: error.message });
            });
        }
    };

    return (
        <div className="bg-slate p-4 rounded-lg shadow-md">
            <FormProvider {...methods}>
                <Form {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 p-3 flex flex-col">
                        <ProgressBar currentStep={currentStep} totalSteps={tabs.length} />
                        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                            <TabsList className="w-full justify-start overflow-x-auto bg-background mb-6">
                                {tabs.map(tab => (
                                    <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                                ))}
                            </TabsList>
                            <TabsContent value="basic-info">
                                <BasicInfoTab previewImage={previewImage} logoImage={logoImage} handleLogoImageChange={handleLogoImageChange} />
                            </TabsContent>
                            <TabsContent value="contact">
                                <ContactTab />
                            </TabsContent>
                            <TabsContent value="regulatory">
                                <RegulatoryTab />
                            </TabsContent>
                            <TabsContent value="location">
                                <LocationTab />
                            </TabsContent>
                            <TabsContent value="operating-hours">
                                <OperatingHoursTab />
                            </TabsContent>
                            <TabsContent value="ownership">
                                <OwnershipTab />
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-between mt-4">
                            <Button type="button" onClick={() => setCurrentTab(tabs[Math.max(0, currentStep - 2)].value)} disabled={currentStep === 1}>
                                Previous
                            </Button>
                            {currentStep < tabs.length ? (
                                <Button type="button" onClick={handleNext}>
                                    Next
                                </Button>
                            ) : (
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Submitting..." : "Add Hospital"}
                                </Button>
                            )}
                        </div>

                        {message && (
                            <div className={`mt-4 text-sm p-3 rounded-md ${message.type === "success" ? "bg-constructive/20 text-constructive" : "bg-destructive/20 text-destructive"}`}>
                                {message.text}
                            </div>
                        )}
                    </form>
                </Form>
            </FormProvider>
        </div>
    );
};

const AddHospitalForm: React.FC<AddHospitalFormProps> = (props) => (
    <EdgeStoreProvider>
        <AddHospitalFormComponent {...props} />
    </EdgeStoreProvider>
);

export default AddHospitalForm;