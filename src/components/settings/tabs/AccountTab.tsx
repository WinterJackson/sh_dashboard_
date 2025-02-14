// src/components/tabs/AccountTab.tsx

"use client";

import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useForm } from "react-hook-form";
import { ProfileUpdateData } from "@/lib/data-access/settings/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Role } from "@/lib/definitions";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface ExtendedProfileUpdateData extends ProfileUpdateData {
    username: string;
    email: string;
    imageUrl?: string;
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
    const { mutateAsync: updateProfile, isPending: isProfilePending } =
        useUpdateProfile();
    const { mutateAsync: updateUser, isPending: isUserPending } =
        useUpdateUser();
    const isPending = isProfilePending || isUserPending;

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
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

    const onSubmit = async (data: ExtendedProfileUpdateData) => {
        try {
            const { username, email, ...profileData } = data;
            // Update user credentials
            await updateUser({ username, email });
            // Update profile information
            await updateProfile(profileData);
            toast.success("Account updated successfully");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update account"
            );
        }
    };

    const imageSource = imageUrl || "/images/default-avatar.png";

    const MEDICAL_ROLES = ["DOCTOR", "NURSE", "STAFF"];
    const isMedicalStaff = MEDICAL_ROLES.includes(role);

    return (
        <div className="space-y-6 p-2">
            <h2 className="text-lg font-semibold bg-white p-2 rounded-[10px] shadow-sm shadow-gray-400">
                Account Information
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4 ">
                    <div className="bg-white p-4 rounded-[10px] shadow-sm shadow-gray-400">
                        {/* Username and Email */}
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

                        {/* Profile Picture */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="p-2 pl-1 block text-gray-600 text-sm font-medium">
                                    Profile Picture URL
                                </label>
                                <Input
                                    {...register("imageUrl")}
                                    placeholder="Enter image URL"
                                />
                                {imageUrl && (
                                    <div className="mt-2">
                                        <Image
                                            src={
                                                imageSource as
                                                    | string
                                                    | StaticImport
                                            }
                                            alt="Profile Preview"
                                            width={96}
                                            height={96}
                                            className="rounded-full object-cover w-24 h-24"
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
                        </div>
                    </div>

                    {/* Bio and Contact Information */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Bio Section */}
                        <div className="col-span-1 space-y-4 bg-white p-4 rounded-[10px] shadow-sm shadow-gray-400">
                            <h3 className="text-lg font-semibold bg-bluelight/5 p-1">
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

                        {/* Contact Information Section */}
                        <div className="col-span-1 space-y-4 bg-white p-4 rounded-[10px] shadow-sm shadow-gray-400">
                            <h3 className="text-lg font-semibold bg-bluelight/5 p-1">
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
                                    htmlFor="city"
                                    className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                >
                                    City
                                </label>
                                <Input
                                    id="city"
                                    {...register("city")}
                                    placeholder="Enter your city"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="state"
                                    className="block p-2 pl-1 text-gray-600 text-sm font-medium"
                                >
                                    State
                                </label>
                                <Input
                                    id="state"
                                    {...register("state")}
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

                    {/* Save Changes Button */}
                    <Button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isPending || Object.keys(errors).length > 0}
                    >
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
