// File: src/components/doctors/ui/add-new-doctor/AddDoctorForm.tsx

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useEdgeStore } from "@/lib/edgestore";
import { base64ToFile } from "@/lib/utils";
import { calculateAge } from "@/hooks/useCalculateAge";
import {
    Specialization,
    Department,
    Hospital,
    Service,
    Role,
} from "@/lib/definitions";
import { addDoctorAPI } from "@/lib/data-access/doctors/data";
import { ChevronRight } from "lucide-react";

interface AddDoctorFormProps {
    specialties: Specialization[];
    departments: Department[];
    hospitals: Hospital[];
    services: Service[];
    filteredServices: (
        selectedDepartmentId: number,
        currentHospitalId: number,
        user?: { role: Role; hospitalId: number | null }
    ) => Promise<Service[]>;
    userRole: Role;
    userHospitalId: string | null;
    sessionUser: {
        role: Role;
        hospitalId: number | null;
        userId: string | null;
    };
}

const AddDoctorForm: React.FC<AddDoctorFormProps> = ({
    specialties,
    departments,
    hospitals,
    services,
    filteredServices,
    userRole,
    userHospitalId,
    sessionUser,
}) => {
    const { edgestore } = useEdgeStore();

    const [message, setMessage] = useState<{
        text: string;
        type: "success" | "error";
    } | null>(null);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [profileImageData, setProfileImageData] = useState<string | null>(
        null
    ); // Store base64 string

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedSpecialization, setSelectedSpecialization] = useState<
        number | null
    >(null);
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
        null
    );
    const [selectedHospital, setSelectedHospital] = useState<number | null>(
        userRole === Role.ADMIN
            ? userHospitalId
                ? parseInt(userHospitalId, 10)
                : null
            : null
    );
    const [selectedService, setSelectedService] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("Offline");
    const [selectedGender, setSelectedGender] = useState<string | null>(null);

    const [servicesList, setServicesList] = useState<Service[]>([]);

    const [isDropdownOpen, setIsDropdownOpen] = useState({
        hospital: false,
        specialization: false,
        department: false,
        service: false,
        status: false,
        gender: false,
    });

    const defaultFormValues = useMemo(
        () => ({
            firstName: "",
            lastName: "",
            email: "",
            phoneNo: "",
            dateOfBirth: "",
            gender: "",
            qualifications: "",
            about: "",
            specializationId: null,
            departmentId: null,
            hospitalId:
                userRole === Role.ADMIN
                    ? parseInt(userHospitalId || "", 10)
                    : null,
            serviceId: null,
            status: "Offline",
        }),
        [userRole, userHospitalId]
    );

    const methods = useForm({
        defaultValues: defaultFormValues,
    });

    const watchDateOfBirth = methods.watch("dateOfBirth");

    // Memoized filtered departments
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

    // filtered services
    const handleFetchServices = async () => {
        if (!selectedDepartment) {
            setServicesList([]);
            return;
        }

        const currentHospitalId =
            userRole === Role.SUPER_ADMIN
                ? selectedHospital
                : parseInt(userHospitalId || "0", 10);

        // Ensure `currentHospitalId` is not null
        if (currentHospitalId === null) {
            console.error("Hospital ID is required to fetch services");
            return;
        }

        try {
            // Destructure sessionUser to pass only role and hospitalId
            const { role, hospitalId } = sessionUser;

            const fetchedServices = await filteredServices(
                selectedDepartment,
                currentHospitalId,
                { role, hospitalId }
            );
            setServicesList(fetchedServices);
        } catch (error) {
            console.error("Failed to fetch services:", error);
            setServicesList([]);
        }
    };

    useEffect(() => {
        handleFetchServices();
    }, [selectedDepartment, selectedHospital, userRole, userHospitalId]);

    const handleProfileImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = () => {
                img.src = reader.result as string;

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        const size = Math.min(img.width, img.height); // Shortest side
                        canvas.width = size;
                        canvas.height = size;

                        // Draw the image centered
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

                        // Get the base64 image data
                        const resizedImage = canvas.toDataURL("image/jpeg");

                        // Update state with resized image
                        setProfileImageData(resizedImage); // holds the base64 image
                        setPreviewImage(resizedImage);
                    }
                };
            };
            reader.readAsDataURL(file); // Read file as a data URL
        }
    };

    const calculateDisplayAge = (dateOfBirth: string | undefined) => {
        if (!dateOfBirth) return "0 yrs";
        const age = calculateAge(dateOfBirth);
        return `${age} yrs`;
    };

    // Submit handler
    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        setMessage(null);

        let profileImageUrl: string | null = null;

        if (profileImageData) {
            try {
                // Convert base64 string to File object
                const file = base64ToFile(profileImageData, "profileImage.jpg");

                const uploadResponse = await edgestore.doctorImages.upload({
                    file,
                });
                profileImageUrl = uploadResponse.url;
            } catch (error) {
                console.error("Failed to upload profile image:", error);
                setMessage({
                    text: "Failed to upload profile image.",
                    type: "error",
                });
                setIsSubmitting(false);
                return;
            }
        }
        const processedData = {
            ...data,
            specializationId: selectedSpecialization,
            departmentId: selectedDepartment,
            hospitalId:
                userRole === Role.SUPER_ADMIN
                    ? selectedHospital
                    : userHospitalId,
            serviceId: selectedService,
            gender: selectedGender,
            status: selectedStatus,
            profileImageUrl,
        };

        try {
            await addDoctorAPI(processedData, sessionUser);
            setMessage({ text: "Doctor added successfully!", type: "success" });

            // Reset form fields
            methods.reset();

            // Reset dropdown states
            setSelectedSpecialization(null);
            setSelectedDepartment(null);
            setSelectedHospital(null);
            setSelectedService(null);
            setSelectedGender(null);
            setSelectedStatus("Offline");

            // Clear profile image
            setProfileImage(null);
            setPreviewImage(null);
        } catch (error: any) {
            console.error("Failed to add doctor:", error);
            setMessage({
                text: "Failed to add doctor. Please try again.",
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDropdownChange = (key: any, isOpen: any) => {
        setIsDropdownOpen((prev) => ({ ...prev, [key]: isOpen }));
    };

    return (
        <div className="bg-bluelight/5 m-2 rounded-[10px]">
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="space-y-6 p-3 flex flex-col"
                >
                    <div className="flex flex-row w-full gap-3">
                        {/* PROFILE IMAGE UPLOAD & PREVIEW */}
                        <div className="flex flex-col gap-6 bg-white shadow-lg shadow-gray-300 w-1/3 p-4 rounded-xl">
                            <span className="text-primary font-semibold border-b-2 border-gray-300">
                                Upload Profile Picture
                            </span>
                            <FormItem>
                                <FormLabel className="">
                                    Profile Image
                                </FormLabel>
                                <FormControl className="flex flex-col bg-black/20 items-center p-2 rounded-[10px]">
                                    <div className="w-full">
                                        <label
                                            htmlFor="profile-image-upload"
                                            className="cursor-pointer px-4 py-2 bg-primary text-white text-sm rounded-[10px] hover:bg-primary/60 focus:ring focus:ring-primary"
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
                                        <img
                                            src={previewImage}
                                            alt="Profile Picture Preview"
                                            className="max-w-full max-h-[250px] rounded-[10px] shadow-md"
                                        />
                                        {profileImage?.name && (
                                            <span className="mt-2 text-sm text-gray-700 font-medium">
                                                {profileImage.name}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <FormMessage />
                            </FormItem>
                        </div>

                        {/* BIO */}
                        <div className="flex flex-col gap-6 bg-white shadow-lg shadow-gray-300 w-1/3 p-4 rounded-xl">
                            <span className="text-primary font-semibold border-b-2 border-gray-300">
                                Bio
                            </span>
                            <FormItem>
                                <FormLabel>Surname</FormLabel>
                                <FormControl>
                                    <Input
                                        {...methods.register("lastName")}
                                        placeholder="Enter last name"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...methods.register("firstName")}
                                        placeholder="Enter first name"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                            <div className=" flex flex-row w-full gap-2">
                                <FormItem className="w-2/3">
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...methods.register("dateOfBirth")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                {/* AGE SPAN */}
                                <div className="flex flex-col w-1/3 h-full justify-center">
                                    <span className="flex h-1/4 text-sm mb-3 font">
                                        Age
                                    </span>
                                    <span className="flex h-3/4 text-lg bg-white px-2 rounded-[5px] border-2 border-gray-200">
                                        {calculateDisplayAge(watchDateOfBirth)}
                                    </span>
                                </div>
                            </div>

                            <FormItem className="flex flex-col flex-1 min-w-0">
                                <FormLabel>Gender</FormLabel>
                                <FormControl>
                                    <DropdownMenu
                                        onOpenChange={(isOpen) =>
                                            handleDropdownChange(
                                                "gender",
                                                isOpen
                                            )
                                        }
                                    >
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex bg-white items-center justify-between gap-3 p-3 border-gray-300 shadow-lg shadow-gray-300 rounded-[5px] h-[45px] max-w-[250px] text-black text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                                                {selectedGender ||
                                                    "Select Gender"}
                                                <ChevronRight
                                                    className={`ml-auto text-xl transform transition-transform duration-300 ${
                                                        isDropdownOpen.gender
                                                            ? "rotate-90"
                                                            : ""
                                                    }`}
                                                />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="p-1 max-h-[200px] justify-end w-[250px] mt-1 overflow-y-auto rounded-[5px] shadow-md bg-white">
                                            {["Male", "Female", "Other"].map(
                                                (gender) => (
                                                    <DropdownMenuItem
                                                        key={gender}
                                                        onClick={() =>
                                                            setSelectedGender(
                                                                gender
                                                            )
                                                        }
                                                        className="rounded-[5px]"
                                                    >
                                                        {gender}
                                                    </DropdownMenuItem>
                                                )
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </div>

                        {/* CONTACT INFORMATION */}
                        <div className="flex flex-col gap-6 bg-white shadow-lg shadow-gray-300 w-1/3 p-4 rounded-xl">
                            <span className="text-primary font-semibold border-b-2 border-gray-300">
                                Contact Information
                            </span>
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input
                                        {...methods.register("phoneNo")}
                                        placeholder="Enter phone number"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        {...methods.register("email", {
                                            required: "Email is required",
                                        })}
                                        placeholder="Enter email address"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </div>
                    </div>

                    <div className="flex flex-col w-full bg-white shadow-lg shadow-gray-300 p-4 rounded-xl">
                        <span className="text-primary font-semibold px-2 mb-8 border-b-2 border-gray-300">
                            Professional Information
                        </span>

                        {/* PROFESSIONAL INFORMATION */}
                        <div className="flex flex-row w-full gap-6 p-2 mb-8">
                            {userRole === Role.SUPER_ADMIN && (
                                <FormItem className="flex flex-col flex-1 min-w-0 bg-bluelight rounded-[10px]">
                                    <FormLabel className="px-2 py-4">
                                        Hospital
                                    </FormLabel>
                                    <FormControl>
                                        <DropdownMenu
                                            onOpenChange={(isOpen) =>
                                                handleDropdownChange(
                                                    "hospital",
                                                    isOpen
                                                )
                                            }
                                        >
                                            <DropdownMenuTrigger asChild>
                                                <button className="flex bg-white items-center justify-between gap-3 p-3 border-gray-300 shadow-lg shadow-gray-400 rounded-[5px] h-[45px] w-full text-black text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                                                    <span className="truncate max-w-[70%]">
                                                        {hospitals.find(
                                                            (h) =>
                                                                h.hospitalId ===
                                                                selectedHospital
                                                        )?.name ||
                                                            "Select Hospital"}
                                                    </span>
                                                    <ChevronRight
                                                        className={`ml-auto text-xl transform transition-transform duration-300 ${
                                                            isDropdownOpen.hospital
                                                                ? "rotate-90"
                                                                : ""
                                                        }`}
                                                    />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="p-1 max-h-[200px] w-full ml-6 mt-1 overflow-y-auto rounded-[10px] shadow-md bg-white">
                                                {hospitals.map((h) => (
                                                    <DropdownMenuItem
                                                        key={h.hospitalId}
                                                        onClick={() =>
                                                            setSelectedHospital(
                                                                h.hospitalId
                                                            )
                                                        }
                                                        className="rounded-[5px] truncate"
                                                    >
                                                        <span className="truncate">
                                                            {h.name}
                                                        </span>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}

                            <FormItem className="flex flex-col flex-1 min-w-0 bg-bluelight rounded-[10px]">
                                <FormLabel className="px-2 py-4">
                                    Department
                                </FormLabel>
                                <FormControl>
                                    <DropdownMenu
                                        onOpenChange={(isOpen) =>
                                            handleDropdownChange(
                                                "department",
                                                isOpen
                                            )
                                        }
                                    >
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex bg-white items-center justify-between gap-3 p-3 border-gray-300 shadow-lg shadow-gray-300 rounded-[5px] h-[45px] w-full text-black text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                                                <span className="truncate max-w-[70%]">
                                                    {filteredDepartments.find(
                                                        (d) =>
                                                            d.departmentId ===
                                                            selectedDepartment
                                                    )?.name ||
                                                        "Select Department"}
                                                </span>
                                                <ChevronRight
                                                    className={`ml-auto text-xl transform transition-transform duration-300 ${
                                                        isDropdownOpen.department
                                                            ? "rotate-90"
                                                            : ""
                                                    }`}
                                                />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="p-1 max-h-[200px] w-full ml-6 mt-1 overflow-y-auto rounded-[10px] shadow-md bg-white">
                                            {filteredDepartments.map((d) => (
                                                <DropdownMenuItem
                                                    key={d.departmentId}
                                                    onClick={() =>
                                                        setSelectedDepartment(
                                                            d.departmentId
                                                        )
                                                    }
                                                    className="rounded-[5px] truncate"
                                                >
                                                    <span className="truncate">
                                                        {d.name}
                                                    </span>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                            <FormItem className="flex flex-col flex-1 min-w-0 bg-bluelight rounded-[10px]">
                                <FormLabel className="px-2 py-4">
                                    Specialization
                                </FormLabel>
                                <FormControl>
                                    <DropdownMenu
                                        onOpenChange={(isOpen) =>
                                            handleDropdownChange(
                                                "specialization",
                                                isOpen
                                            )
                                        }
                                    >
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex bg-white items-center justify-between gap-3 p-3 border-gray-300 shadow-lg shadow-gray-300 rounded-[5px] h-[45px] w-full text-black text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                                                <span className="truncate max-w-[70%]">
                                                    {specialties.find(
                                                        (s) =>
                                                            s.specializationId ===
                                                            selectedSpecialization
                                                    )?.name ||
                                                        "Select Specialization"}
                                                </span>
                                                <ChevronRight
                                                    className={`ml-auto text-xl transform transition-transform duration-300 ${
                                                        isDropdownOpen.specialization
                                                            ? "rotate-90"
                                                            : ""
                                                    }`}
                                                />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="p-1 max-h-[200px] mt-1 overflow-y-auto rounded-[10px] shadow-md bg-white">
                                            {specialties.map((s) => (
                                                <DropdownMenuItem
                                                    key={s.specializationId}
                                                    onClick={() =>
                                                        setSelectedSpecialization(
                                                            s.specializationId
                                                        )
                                                    }
                                                    className="rounded-[5px] truncate"
                                                >
                                                    <span className="truncate">
                                                        {s.name}
                                                    </span>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                            <FormItem className="flex flex-col flex-1 min-w-0 bg-bluelight rounded-[10px]">
                                <FormLabel className="px-2 py-4">
                                    Service
                                </FormLabel>
                                <FormControl>
                                    <DropdownMenu
                                        onOpenChange={(isOpen) =>
                                            handleDropdownChange(
                                                "service",
                                                isOpen
                                            )
                                        }
                                    >
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex bg-white items-center justify-between gap-3 p-3 border-gray-300 shadow-lg shadow-gray-300 rounded-[5px] h-[45px] w-full text-black text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                                                <span className="truncate max-w-[70%]">
                                                    {servicesList.find(
                                                        (s: Service) =>
                                                            s.serviceId ===
                                                            selectedService
                                                    )?.serviceName ||
                                                        "Select Service"}
                                                </span>
                                                <ChevronRight
                                                    className={`ml-auto text-xl transform transition-transform duration-300 ${
                                                        isDropdownOpen.service
                                                            ? "rotate-90"
                                                            : ""
                                                    }`}
                                                />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="p-1 max-h-[200px] mt-1 overflow-y-auto rounded-[10px] shadow-md bg-white">
                                            {servicesList.map((s: Service) => (
                                                <DropdownMenuItem
                                                    key={s.serviceId}
                                                    onClick={() =>
                                                        setSelectedService(
                                                            s.serviceId
                                                        )
                                                    }
                                                    className="rounded-[5px] truncate"
                                                >
                                                    <span className="truncate">
                                                        {s.serviceName}
                                                    </span>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                            <FormItem className="flex flex-col flex-1 min-w-0 bg-bluelight rounded-[10px]">
                                <FormLabel className="px-2 py-4">
                                    Status
                                </FormLabel>{" "}
                                <FormControl>
                                    <DropdownMenu
                                        onOpenChange={(isOpen) =>
                                            handleDropdownChange(
                                                "status",
                                                isOpen
                                            )
                                        }
                                    >
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex bg-white items-center justify-between gap-3 p-3 border-gray-300 shadow-lg shadow-gray-300 rounded-[5px] h-[45px] w-full text-black text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                                                {selectedStatus ||
                                                    "Select Status"}
                                                <ChevronRight
                                                    className={`ml-auto text-xl transform transition-transform duration-300 ${
                                                        isDropdownOpen.status
                                                            ? "rotate-90"
                                                            : ""
                                                    }`}
                                                />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="p-1 max-h-[200px] w-[200px] mt-1 overflow-y-auto rounded-[10px] shadow-md bg-white">
                                            {["Online", "Offline"].map(
                                                (status) => (
                                                    <DropdownMenuItem
                                                        key={status}
                                                        onClick={() =>
                                                            setSelectedStatus(
                                                                status
                                                            )
                                                        }
                                                        className="rounded-[5px]"
                                                    >
                                                        {status}
                                                    </DropdownMenuItem>
                                                )
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </div>

                        {/* ABOUT SECTION */}
                        <div className="flex flex-col w-full gap-6 p-2">
                            <FormItem>
                                <FormLabel className="px-2 py-4">
                                    Qualifications
                                </FormLabel>{" "}
                                <FormControl>
                                    <Input
                                        {...methods.register("qualifications")}
                                        placeholder="Enter qualifications"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                            <FormItem>
                                <FormLabel className="px-2 py-4">
                                    About
                                </FormLabel>{" "}
                                <FormControl>
                                    <textarea
                                        {...methods.register("about")}
                                        placeholder="Write A Short Biography"
                                        className="w-full border rounded text-sm p-3"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </div>

                        <div className="flex flex-col w-full p-2">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Add Doctor"}
                            </Button>
                            {message && (
                                <span
                                    className={`mt-2 text-sm font-semibold bg-bluelight/5 p-4 ${
                                        message.type === "success"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {message.text}
                                </span>
                            )}
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default AddDoctorForm;
