// src/components/patients/ui/add-new-patient/sections/ProfileImageSection.tsx

"use client";

import React, { useState } from "react";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import Image from "next/image";

interface ProfileImageSectionProps {
    setProfileImageData: (data: string | null) => void;
}

export default function ProfileImageSection({ setProfileImageData }: ProfileImageSectionProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleProfileImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreviewImage(result);
                setProfileImageData(result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col gap-6 bg-background border border-border p-6 rounded-xl shadow-sm w-full lg:w-1/3">
            <span className="text-primary font-semibold border-b-2 border-border pb-2">
                Upload Profile Picture
            </span>
            <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <FormControl className="flex flex-col bg-slate items-center p-2 rounded-[10px] mt-4">
                    <div className="w-full">
                        <label
                            htmlFor="profile-image-upload"
                            className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground text-sm rounded-[10px] hover:bg-primary/60 focus:ring focus:ring-primary"
                        >
                            Choose File
                        </label>
                        <input
                            id="profile-image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfileImageChange}
                        />
                    </div>
                </FormControl>
                {previewImage && (
                    <div className="mt-3 p-4 flex flex-col items-center">
                        <Image
                            src={previewImage}
                            alt="Profile Picture Preview"
                            width={250}
                            height={250}
                            className="max-w-full max-h-[250px] rounded-[10px] shadow-md"
                        />
                        {imageFile?.name && (
                            <span className="mt-2 text-sm text-muted-foreground font-medium">
                                {imageFile.name}
                            </span>
                        )}
                    </div>
                )}
                <FormMessage />
            </FormItem>
        </div>
    );
}
