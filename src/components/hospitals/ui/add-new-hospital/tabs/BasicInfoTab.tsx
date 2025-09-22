// src/components/hospitals/ui/add-new-hospital/tabs/BasicInfoTab.tsx

"use client";

import { useFormContext } from "react-hook-form";
import {
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React from "react";

interface BasicInfoTabProps {
    previewImage: string | null;
    logoImage: File | null;
    handleLogoImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
    previewImage,
    logoImage,
    handleLogoImageChange,
}) => {
    const { register } = useFormContext();

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row w-full gap-6">
                {/* LOGO IMAGE UPLOAD & PREVIEW */}
                <div className="flex flex-col gap-6 bg-background border border-border p-4 rounded-xl shadow-sm w-full lg:w-1/3">
                    <span className="text-primary font-semibold border-b-2 border-border pb-2">
                        Upload Hospital Logo
                    </span>
                    <FormItem>
                        <FormLabel>Logo Image</FormLabel>
                        <FormControl className="flex flex-col bg-slate items-center p-2 rounded-[10px] mt-4">
                            <div className="w-full">
                                <label
                                    htmlFor="logo-image-upload"
                                    className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground text-sm rounded-[10px] hover:bg-primary/60 focus:ring focus:ring-primary"
                                >
                                    Choose File
                                </label>
                                <input
                                    id="logo-image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLogoImageChange}
                                />
                            </div>
                        </FormControl>
                        {previewImage && (
                            <div className="mt-3 p-4 flex flex-col items-center">
                                <Image
                                    src={previewImage}
                                    alt="Logo Preview"
                                    width={250}
                                    height={250}
                                    className="max-w-full max-h-[250px] rounded-[10px] shadow-md"
                                />
                                {logoImage?.name && (
                                    <span className="mt-2 text-sm text-muted-foreground font-medium">
                                        {logoImage.name}
                                    </span>
                                )}
                            </div>
                        )}
                        <FormMessage />
                    </FormItem>
                </div>

                {/* HOSPITAL DETAILS */}
                <div className="flex flex-col gap-6 bg-background border border-border p-4 rounded-xl shadow-sm w-full lg:w-2/3">
                    <span className="text-primary font-semibold border-b-2 border-border pb-2">
                        Hospital Details
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormItem>
                            <FormLabel>Hospital Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...register("hospitalName")}
                                    placeholder="Enter hospital name"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        <FormItem>
                            <FormLabel>Hospital Link (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    {...register("hospitalLink")}
                                    placeholder="Enter hospital link"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        <FormItem>
                            <FormLabel>Website (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    {...register("website")}
                                    placeholder="Enter website URL"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        <FormItem>
                            <FormLabel>Referral Code (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    {...register("referralCode")}
                                    placeholder="Enter referral code"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        <FormItem>
                            <FormLabel>Category (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    {...register("category")}
                                    placeholder="e.g., Private Practice"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        <FormItem className="md:col-span-2">
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...register("description")}
                                    placeholder="Enter a short description of the hospital"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicInfoTab;
