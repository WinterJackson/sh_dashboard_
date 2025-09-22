"use client";

import React, { useState, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctorValidationSchema, DoctorFormValues } from "./doctorValidation";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { EdgeStoreProvider, useEdgeStore } from "@/lib/edgestore";
import Image from "next/image";
import { base64ToFile } from "@/lib/utils";
import { calculateAge } from "@/hooks/useCalculateAge";
import { Specialization, Department, Hospital, Role } from "@/lib/definitions";
import { useAddDoctorAPI } from "@/hooks/useAddDoctorAPI";
import { Textarea } from "@/components/ui/textarea";

interface AddDoctorFormProps {
    specialties: Specialization[];
    departments: Department[];
    hospitals: Hospital[];
    userRole: Role;
    userHospitalId: string | null;
    sessionUser: {
        role: Role;
        hospitalId: number | null;
        userId: string | null;
    };
}

const AddDoctorFormComponent: React.FC<AddDoctorFormProps> = ({
    specialties,
    departments,
    hospitals,
    userRole,
    userHospitalId,
    sessionUser,
}) => {
    const { edgestore } = useEdgeStore();
    const { mutate: addDoctor, isPending: isSubmitting } = useAddDoctorAPI();

    const [message, setMessage] = useState<{
        text: string;
        type: "success" | "error";
    } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [profileImageData, setProfileImageData] = useState<string | null>(null);

    const methods = useForm<DoctorFormValues>({
        resolver: zodResolver(doctorValidationSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNo: "",
            dateOfBirth: "",
            gender: null,
            qualifications: "",
            about: "",
            specializationId: undefined,
            departmentId: undefined,
            hospitalId:
                userRole === Role.ADMIN
                    ? parseInt(userHospitalId || "0", 10)
                    : undefined,
            status: "Offline",
            profileImageUrl: null,
        },
    });

    const watchDateOfBirth = methods.watch("dateOfBirth");

    const filteredDepartments = useMemo(() => {
        if (userRole === Role.ADMIN && userHospitalId) {
            return departments.filter((dept) =>
                dept.hospitals.some(
                    (rel) => rel.hospitalId === parseInt(userHospitalId, 10)
                )
            );
        }
        return departments;
    }, [userRole, userHospitalId, departments]);

    const handleProfileImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = document.createElement("img");
                img.src = reader.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
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
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const calculateDisplayAge = (dateOfBirth: string | undefined) => {
        if (!dateOfBirth) return "0 yrs";
        return `${calculateAge(dateOfBirth)} yrs`;
    };

    const onSubmit = async (data: DoctorFormValues) => {
        setMessage(null);
        let profileImageUrl: string | null = data.profileImageUrl || null;

        if (profileImageData) {
            try {
                const file = base64ToFile(profileImageData, "profileImage.jpg");
                const uploadResponse = await edgestore.doctorImages.upload({
                    file,
                });
                profileImageUrl = uploadResponse.url;
            } catch (error) {
                setMessage({
                    text: "Failed to upload profile image.",
                    type: "error",
                });
                return;
            }
        }

        const processedData = { ...data, profileImageUrl, bio: data.about };

        addDoctor(
            { doctorData: processedData, user: sessionUser },
            {
                onSuccess: () => {
                    setMessage({
                        text: "Doctor added successfully!",
                        type: "success",
                    });
                    methods.reset();
                    setPreviewImage(null);
                },
                onError: (error) => {
                    setMessage({
                        text:
                            error.message ||
                            "Failed to add doctor. Please try again.",
                        type: "error",
                    });
                },
            }
        );
    };

    return (
        <div className="bg-slate p-3 rounded-lg shadow-md">
            <FormProvider {...methods}>
                <Form {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(onSubmit)}
                        className="space-y-6 p-3 flex flex-col"
                    >
                        <div className="flex flex-col lg:flex-row w-full gap-6">
                            <div className="flex flex-col gap-6 bg-background border border-border p-4 rounded-xl shadow-sm w-full lg:w-1/3">
                                <span className="text-primary font-semibold border-b-2 border-border pb-2">
                                    Upload Profile Picture
                                </span>
                                <FormItem>
                                    <FormLabel>Profile Image</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfileImageChange}
                                        />
                                    </FormControl>
                                    {previewImage && (
                                        <div className="mt-3 p-4 flex flex-col items-center">
                                            <Image
                                                src={previewImage}
                                                alt="Profile Preview"
                                                width={250}
                                                height={250}
                                                className="max-w-full max-h-[250px] rounded-[10px] shadow-md"
                                            />
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            </div>

                            <div className="flex flex-col gap-6 bg-background border border-border p-4 rounded-xl shadow-sm w-full lg:w-1/3">
                                <span className="text-primary font-semibold border-b-2 border-border pb-2">
                                    Bio
                                </span>
                                <FormField
                                    control={methods.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Surname</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter last name"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={methods.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter first name"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex flex-row w-full gap-4">
                                    <FormField
                                        control={methods.control}
                                        name="dateOfBirth"
                                        render={({ field }) => (
                                            <FormItem className="w-2/3">
                                                <FormLabel>
                                                    Date of Birth
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex flex-col w-1/3">
                                        <FormLabel>Age</FormLabel>
                                        <span className="flex h-10 items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                            {calculateDisplayAge(
                                                watchDateOfBirth
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <FormField
                                    control={methods.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={
                                                    field.value || undefined
                                                }
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Gender" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Male">
                                                        Male
                                                    </SelectItem>
                                                    <SelectItem value="Female">
                                                        Female
                                                    </SelectItem>
                                                    <SelectItem value="Other">
                                                        Other
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex flex-col gap-6 bg-background border border-border p-4 rounded-xl shadow-sm w-full lg:w-1/3">
                                <span className="text-primary font-semibold border-b-2 border-border pb-2">
                                    Contact Information
                                </span>
                                <FormField
                                    control={methods.control}
                                    name="phoneNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter phone number"
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
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    {...field}
                                                    placeholder="Enter email address"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-full bg-background border border-border p-4 rounded-xl shadow-sm">
                            <span className="text-primary font-semibold px-2 mb-4 border-b-2 border-border pb-2">
                                Professional Information
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
                                {userRole === Role.SUPER_ADMIN && (
                                    <FormField
                                        control={methods.control}
                                        name="hospitalId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hospital</FormLabel>
                                                <Select
                                                    onValueChange={(value) =>
                                                        field.onChange(parseInt(value))
                                                    }
                                                    defaultValue={field.value?.toString()}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a Hospital" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {hospitals.length > 0 ? (
                                                            hospitals.map((h) => (
                                                                <SelectItem
                                                                    key={h.hospitalId}
                                                                    value={h.hospitalId.toString()}
                                                                >
                                                                    {h.hospitalName}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem value="no-hospitals" disabled>
                                                                No hospitals available
                                                            </SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <FormField
                                    control={methods.control}
                                    name="departmentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department</FormLabel>
                                            <Select
                                                onValueChange={(value) =>
                                                    field.onChange(
                                                        parseInt(value)
                                                    )
                                                }
                                                defaultValue={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a Department" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {filteredDepartments.map(
                                                        (d) => (
                                                            <SelectItem
                                                                key={
                                                                    d.departmentId
                                                                }
                                                                value={d.departmentId.toString()}
                                                            >
                                                                {d.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={methods.control}
                                    name="specializationId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Specialization
                                            </FormLabel>
                                            <Select
                                                onValueChange={(value) =>
                                                    field.onChange(
                                                        parseInt(value)
                                                    )
                                                }
                                                defaultValue={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Specialization" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {specialties.map((s) => (
                                                        <SelectItem
                                                            key={
                                                                s.specializationId
                                                            }
                                                            value={s.specializationId.toString()}
                                                        >
                                                            {s.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={methods.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Online">
                                                        Online
                                                    </SelectItem>
                                                    <SelectItem value="Offline">
                                                        Offline
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-6 p-2">
                            <FormField
                                control={methods.control}
                                name="qualifications"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Qualifications</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter qualifications"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={methods.control}
                                name="about"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>About</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Write a short biography"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Add Doctor"}
                            </Button>
                        </div>
                        {message && (
                            <div
                                className={`mt-4 text-sm p-3 rounded-md ${
                                    message.type === "success"
                                        ? "bg-constructive/20 text-constructive"
                                        : "bg-destructive/20 text-destructive"
                                }`}
                            >
                                {message.text}
                            </div>
                        )}
                    </form>
                </Form>
            </FormProvider>
        </div>
    );
};

const AddDoctorForm: React.FC<AddDoctorFormProps> = (props) => (
    <EdgeStoreProvider>
        <AddDoctorFormComponent {...props} />
    </EdgeStoreProvider>
);

export default AddDoctorForm;
