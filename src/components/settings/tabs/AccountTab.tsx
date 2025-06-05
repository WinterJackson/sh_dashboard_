// src/components/tabs/AccountTab.tsx

"use client";

import { useMarkOnboardingComplete } from "@/hooks/useMarkOnboardingComplete";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useForm } from "react-hook-form";
import { ProfileUpdateData } from "@/lib/data-access/settings/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Role } from "@/lib/definitions";
import Image from "next/image";
import { useEdgeStore } from "@/lib/edgestore";
import { useState, useEffect } from "react";
import { base64ToFile } from "@/lib/utils";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export interface ExtendedProfileUpdateData extends ProfileUpdateData {
    profileId?: string;
    username: string;
    email: string;
    imageUrl?: string;
    userId: string;
    hasCompletedOnboarding?: boolean;
}

interface AccountTabProps {
    profile: ExtendedProfileUpdateData;
    username: string;
    email: string;
    roleSpecific?: {
        doctor?: {
            aboutBio?: string;
            qualifications?: string;
            yearsOfExperience?: number;
            workingHours?: string;
            status?: string;
        };
        nurse?: {
            aboutBio?: string;
            qualifications?: string;
            yearsOfExperience?: number;
            workingHours?: string;
            status?: string;
        };
        staff?: {
            aboutBio?: string;
            qualifications?: string;
            yearsOfExperience?: number;
            workingHours?: string;
            status?: string;
        };
    };
    role: Role;
}

export default function AccountTab({
    profile,
    username,
    email,
    roleSpecific = {},
    role,
}: AccountTabProps) {
    const { data: session, update } = useSession();
    const { mutateAsync: updateProfile, isPending: isProfilePending } =
        useUpdateProfile();
    const { mutateAsync: updateUser, isPending: isUserPending } =
        useUpdateUser();
    const { mutateAsync: markOnboardingComplete } = useMarkOnboardingComplete();
    const isPending = isProfilePending || isUserPending;

    const { edgestore } = useEdgeStore();
    const [profileImageData, setProfileImageData] = useState<string | null>(
        null
    );
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const imageFileInputRef = useRef<HTMLInputElement>(null);

    const { toast } = useToast();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<ExtendedProfileUpdateData>({
        defaultValues: {
            ...profile,
            username,
            email,
            ...(roleSpecific.doctor || {}),
            ...(roleSpecific.nurse || {}),
            ...(roleSpecific.staff || {}),
        },
    });

    const imageUrl = watch("imageUrl");

    const handleProfileImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new window.Image();
            img.src = e.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                const size = Math.min(img.width, img.height);
                canvas.width = size;
                canvas.height = size;

                ctx.drawImage(
                    img,
                    (img.width - size) / 2,
                    (img.height - size) / 2,
                    size,
                    size,
                    0,
                    0,
                    size,
                    size
                );

                const resizedImage = canvas.toDataURL("image/jpeg");
                setProfileImageData(resizedImage);
                setPreviewImage(resizedImage);
            };
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data: ExtendedProfileUpdateData) => {
        try {
            const { firstName, lastName, phoneNo } = data;

            if (!firstName?.trim()) {
                toast({ title: "First Name Required", description: "First name is required.", variant: "destructive" });
                return;
            }

            if (!lastName?.trim()) {
                toast({ title: "Last Name Required", description: "Last name is required.", variant: "destructive" });
                return;
            }

            if (!phoneNo?.trim()) {
                toast({ title: "Phone Number Required", description: "Phone number is required.", variant: "destructive" });
                return;
            }

            let imageUrl = data.imageUrl;

            if (profileImageData) {
                const file = base64ToFile(profileImageData, "profile.jpg");
                const res = await edgestore.doctorImages.upload({
                    file,
                    options: { manualFileName: `profile-${profile.userId}` },
                });
                imageUrl = res.url;
                setValue("imageUrl", res.url);
            }

            const { username, email, ...profileData } = data;

            await updateUser({ username, email });
            await updateProfile({
                ...profileData,
                imageUrl,
            } as ProfileUpdateData & { imageUrl?: string });

            // Handle onboarding completion
            if (session?.user?.hasCompletedOnboarding === false) {
                await markOnboardingComplete(profile.userId);
                await update(); // refresh session
                // Redirect so OnboardingToast detects completion
                router.push("/dashboard");
                router.refresh();
              }

            await update();
            toast({ title: "Account Updated", description: "🎉 Account updated successfully", variant: "default" });
        } catch (error) {
            console.error("Error during account update:", error);
            toast({
                title: "Update Failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to update account",
                variant: "destructive",
            });
        }
    };

    const imageSource =
        previewImage || imageUrl || "/images/default-avatar.png";

    const MEDICAL_ROLES = ["DOCTOR", "NURSE", "STAFF"];
    const isMedicalStaff = MEDICAL_ROLES.includes(role);

    useEffect(() => {
        if (imageUrl) {
            setPreviewImage(imageUrl);
        }
    }, [imageUrl]);

    return (
        <div className="space-y-6 p-2">
            <h2 className="text-lg text-primary font-semibold bg-white p-2 rounded-[10px] shadow-sm shadow-gray-400">
                Account Information
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4 ">
                    <div className="bg-white p-4 rounded-[10px] shadow-sm shadow-gray-400">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="p-2 pl-1 block text-gray-600 text-sm font-medium">
                                    Username
                                </label>
                                <Input
                                    {...register("username", {
                                        required: "Username is required",
                                        minLength: {
                                            value: 3,
                                            message:
                                                "Username must be at least 3 characters",
                                        },
                                    })}
                                    placeholder="Enter your username"
                                />
                                {errors.username && (
                                    <p className="text-sm text-red-500">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="p-2 pl-1 block text-gray-600 text-sm font-medium">
                                    Email
                                </label>
                                <Input
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="gap-4">
                            <div>
                                <label className="p-2 pl-1 block text-gray-600 text-sm font-medium">
                                    Profile Picture
                                </label>

                                <div className="justify-items-center w-full p-2 pb-4 rounded-[5px] border-2 bg-black/5">
                                    <div className="justify-center items-center p-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfileImageChange}
                                            className="bg-white border-2 rounded-[10px] block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                                            ref={imageFileInputRef}
                                        />
                                        {previewImage && (
                                            <div className="mt-2 border-2 bg-white py-4 rounded-[10px] justify-items-center">
                                                <Image
                                                    src={imageSource}
                                                    alt="Profile Preview"
                                                    width={96}
                                                    height={96}
                                                    className="w-[96px] h-[96px] object-cover rounded-full border-2 border-primary m-2"
                                                    onError={(e) => {
                                                        (
                                                            e.target as HTMLImageElement
                                                        ).src =
                                                            "/images/default-avatar.png";
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreviewImage(
                                                profile.imageUrl || null
                                            );
                                            setProfileImageData(null);
                                            if (imageFileInputRef.current) {
                                                imageFileInputRef.current.value =
                                                    "";
                                            }
                                        }}
                                        className="bg-primary p-2 px-4 w-[110px] rounded-[10px] mt-2 text-sm text-white font-semibold hover:text-white hover:bg-red-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1 space-y-2 bg-white p-4 rounded-[10px] shadow-sm shadow-gray-400">
                            <h3 className="text-base text-primary font-semibold border-b-2 border-gray-300 p-1 pb-0 bg-bluelight/5">
                                Bio
                            </h3>
                            <div>
                                <label
                                    htmlFor="firstName"
                                    className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                >
                                    First Name
                                </label>
                                <Input
                                    id="firstName"
                                    {...register("firstName", {
                                        required: "First name is required",
                                    })}
                                    placeholder="Enter your first name"
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-red-500">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="lastName"
                                    className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                >
                                    Last Name
                                </label>
                                <Input
                                    id="lastName"
                                    {...register("lastName", {
                                        required: "Last name is required",
                                    })}
                                    placeholder="Enter your last name"
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-red-500">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="dateOfBirth"
                                    className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                >
                                    Date of Birth
                                </label>
                                <Input
                                    id="dateOfBirth"
                                    {...register("dateOfBirth")}
                                    type="date"
                                    className="w-auto"
                                    placeholder="Enter your date of birth"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="address"
                                    className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                >
                                    Address
                                </label>
                                <Textarea
                                    id="address"
                                    {...register("address")}
                                    placeholder="Enter your address"
                                />
                            </div>
                            {isMedicalStaff && (
                                <>
                                    <div>
                                        <label
                                            htmlFor="aboutBio"
                                            className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                        >
                                            About/Bio
                                        </label>
                                        <Textarea
                                            id="aboutBio"
                                            {...register("about")}
                                            placeholder="Enter your bio"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="qualifications"
                                            className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                        >
                                            Qualifications
                                        </label>
                                        <Input
                                            id="qualifications"
                                            {...register("qualifications")}
                                            placeholder="Enter your qualifications"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="yearsOfExperience"
                                            className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                        >
                                            Years of Experience
                                        </label>
                                        <Input
                                            id="yearsOfExperience"
                                            {...register("yearsOfExperience", {
                                                valueAsNumber: true,
                                            })}
                                            type="number"
                                            placeholder="Enter years of experience"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="col-span-1 space-y-2 pb-6 bg-white p-4 rounded-[10px] shadow-sm shadow-gray-400">
                            <h3 className="text-base text-primary font-semibold border-b-2 border-gray-300 p-1 pb-0 bg-bluelight/5">
                                Contact Information
                            </h3>
                            <div>
                                <label
                                    htmlFor="phoneNo"
                                    className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                >
                                    Phone Number
                                </label>
                                <Input
                                    id="phoneNo"
                                    {...register("phoneNo", {
                                        required: "Phone number is required",
                                    })}
                                    placeholder="Enter your phone number"
                                />
                                {errors.phoneNo && (
                                    <p className="text-sm text-red-500">
                                        {errors.phoneNo.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="gender"
                                    className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                >
                                    Gender
                                </label>
                                <Input
                                    id="gender"
                                    {...register("gender")}
                                    placeholder="Enter your gender"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="cityOrTown"
                                    className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                >
                                    City
                                </label>
                                <Input
                                    id="cityOrTown"
                                    {...register("cityOrTown")}
                                    placeholder="Enter your city"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="county"
                                    className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                >
                                    State
                                </label>
                                <Input
                                    id="county"
                                    {...register("county")}
                                    placeholder="Enter your state"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="emergencyContact"
                                    className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                >
                                    Emergency Contact
                                </label>
                                <Input
                                    id="emergencyContact"
                                    {...register("emergencyContact")}
                                    placeholder="Enter emergency contact"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="nextOfKin"
                                    className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                >
                                    Next of Kin
                                </label>
                                <Input
                                    id="nextOfKin"
                                    {...register("nextOfKin")}
                                    placeholder="Enter next of kin"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="nextOfKinPhoneNo"
                                    className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                >
                                    Next of Kin Phone No.
                                </label>
                                <Input
                                    id="nextOfKinPhoneNo"
                                    {...register("nextOfKinPhoneNo")}
                                    placeholder="Enter next of kin phone number"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isPending || Object.keys(errors).length > 0}
                        className="w-full"
                    >
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}