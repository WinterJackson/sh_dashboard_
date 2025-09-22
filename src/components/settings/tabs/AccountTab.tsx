// src/components/tabs/AccountTab.tsx

"use client";

import { useMarkOnboardingComplete } from "@/hooks/useMarkOnboardingComplete";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useForm, FormProvider } from "react-hook-form";
import { ProfileUpdateData } from "@/lib/data-access/settings/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Role } from "@/lib/definitions";
import Image from "next/image";
import { useEdgeStore } from "@/lib/edgestore";
import { useState, useEffect, useRef, Suspense } from "react";
import { base64ToFile } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

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

function AccountTabContent({
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

    const methods = useForm<ExtendedProfileUpdateData>({
        defaultValues: {
            ...profile,
            username,
            email,
            ...(roleSpecific.doctor || {}),
            ...(roleSpecific.nurse || {}),
            ...(roleSpecific.staff || {}),
        },
    });

    const { handleSubmit, watch, setValue } = methods;

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
                toast({
                    title: "First Name Required",
                    description: "First name is required.",
                    variant: "destructive",
                });
                return;
            }

            if (!lastName?.trim()) {
                toast({
                    title: "Last Name Required",
                    description: "Last name is required.",
                    variant: "destructive",
                });
                return;
            }

            if (!phoneNo?.trim()) {
                toast({
                    title: "Phone Number Required",
                    description: "Phone number is required.",
                    variant: "destructive",
                });
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

            if (session?.user?.hasCompletedOnboarding === false) {
                await markOnboardingComplete(profile.userId);
                await update();
                router.push("/dashboard");
                router.refresh();
            }

            await update();
            toast({
                title: "Account Updated",
                description: "🎉 Account updated successfully",
                variant: "default",
            });
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
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col lg:flex-row w-full gap-6">
                    <div className="flex flex-col gap-6 bg-background border border-border p-4 rounded-xl shadow-sm w-full lg:w-1/3">
                        <span className="text-primary font-semibold border-b-2 border-border pb-2">
                            User Credentials
                        </span>
                        <FormField
                            control={methods.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter your username"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={methods.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter your email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-6 bg-background border border-border p-4 rounded-xl shadow-sm w-full lg:w-2/3">
                        <span className="text-primary font-semibold border-b-2 border-border pb-2">
                            Profile Picture
                        </span>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Image
                                src={imageSource}
                                alt="Profile Preview"
                                width={96}
                                height={96}
                                className="w-24 h-24 object-cover rounded-full border-2 border-primary"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        "/images/default-avatar.png";
                                }}
                            />
                            <div className="flex-grow">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfileImageChange}
                                    className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                                    ref={imageFileInputRef}
                                />
                                <p className="m-2 text-xs text-muted-foreground">
                                    PNG, JPG, GIF up to 5MB.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="bg-destructive/40 mb-8"
                                onClick={() => {
                                    setPreviewImage(profile.imageUrl || null);
                                    setProfileImageData(null);
                                    if (imageFileInputRef.current) {
                                        imageFileInputRef.current.value = "";
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 bg-background border border-border p-4 rounded-xl shadow-sm">
                        <h3 className="text-base text-primary font-semibold border-b-2 border-border pb-2">
                            Personal Information
                        </h3>
                        <FormField
                            control={methods.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter your first name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={methods.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter your last name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={methods.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="date" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={methods.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter your gender"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={methods.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter your address"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4 bg-background border border-border p-4 rounded-xl shadow-sm">
                        <h3 className="text-base text-primary font-semibold border-b-2 border-border pb-2">
                            Contact Information
                        </h3>
                        <FormField
                            control={methods.control}
                            name="phoneNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter your phone number"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={methods.control}
                            name="cityOrTown"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter your city"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={methods.control}
                            name="county"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter your state"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={methods.control}
                            name="emergencyContact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Emergency Contact</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter emergency contact"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={methods.control}
                            name="nextOfKin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Next of Kin</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter next of kin"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={methods.control}
                            name="nextOfKinPhoneNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Next of Kin Phone No.</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter next of kin phone number"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {isMedicalStaff && (
                    <div className="space-y-4 bg-background border border-border p-4 rounded-xl shadow-sm">
                        <h3 className="text-base text-primary font-semibold border-b-2 border-border pb-2">
                            Professional Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={methods.control}
                                name="about"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>About/Bio</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Enter your bio"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={methods.control}
                                name="qualifications"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Qualifications</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter your qualifications"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={methods.control}
                                name="yearsOfExperience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Years of Experience
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="Enter years of experience"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}

export default function AccountTab(props: AccountTabProps) {
    return (
        <Suspense
            fallback={
                <div className="space-y-6 p-2">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-20 w-1/2" />
                </div>
            }
        >
            <AccountTabContent {...props} />
        </Suspense>
    );
}
