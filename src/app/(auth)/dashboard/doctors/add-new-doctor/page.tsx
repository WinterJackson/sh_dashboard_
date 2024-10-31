// /src/app/(auth)/dashboard/doctors/add-new-doctor/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { calculateAge } from "@/hooks/useCalculateAge";
import { useSessionData } from "@/hooks/useSessionData";  // For getting user session

// FormData structure
type FormData = {
    bio: {
        firstName: string;
        lastName: string;
        gender: string;
        dateOfBirth: string;
    };
    contactInformation: {
        phoneNumber: string;
        city: string;
        state: string;
    };
    professionalInformation: {
        departmentId: number;
        qualifications: string;
    };
    about: string;
    selectedHospitalId: number;
    specializationId: number;
};

function AddDoctorPage() {
    const session = useSessionData();
    const user = session?.user;
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // State for file input
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [specialties, setSpecialties] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [age, setAge] = useState<number | null>(null);
    const [formErrors, setFormErrors] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        bio: {
            firstName: "",
            lastName: "",
            gender: "",
            dateOfBirth: "",
        },
        contactInformation: {
            phoneNumber: "",
            city: "",
            state: "",
        },
        professionalInformation: {
            departmentId: 0,
            qualifications: "",
        },
        about: "",
        selectedHospitalId: 0,
        specializationId: 0,
    });

    // Fetch specializations, departments, and hospitals when the component mounts
    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const response = await fetch("/api/specializations");
                const data = await response.json();
                setSpecialties(data);
            } catch (error) {
                console.error("Error fetching specializations:", error);
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await fetch("/api/departments");
                const data = await response.json();
                setDepartments(data);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        const fetchHospitals = async () => {
            try {
                const response = await fetch("/api/hospitals");
                const data = await response.json();
                setHospitals(data);
            } catch (error) {
                console.error("Error fetching hospitals:", error);
            }
        };

        fetchSpecializations();
        fetchDepartments();
        if (user?.role === "SUPER_ADMIN") {
            fetchHospitals(); // Only fetch hospitals if the user is a super admin
        }
    }, [user?.role]);

    // Handle form input changes
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
        section: keyof FormData,
        field: string
    ) => {
        let value: any = e.target.value;

        // Convert departmentId, specializationId, and selectedHospitalId to numbers if they are being updated
        if (
            (section === "professionalInformation" &&
                (field === "departmentId" || field === "specializationId")) ||
            field === "selectedHospitalId"
        ) {
            value = parseInt(value, 10); // Convert the value to an integer
        }

        // Update the formData state
        if (typeof formData[section] === "object") {
            setFormData({
                ...formData,
                [section]: {
                    ...formData[section],
                    [field]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [section]: value,
            });
        }

        // If the date of birth is being updated, calculate and set the age
        if (section === "bio" && field === "dateOfBirth") {
            const newAge = calculateAge(e.target.value);
            setAge(newAge); // Set the calculated age
        }
    };

    // Handle file selection when clicking on the div
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);

            // Preview the selected image
            const reader = new FileReader();
            reader.onload = () => setProfileImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Validate form fields before submission
    const validateFormData = (): boolean => {
        const {
            bio,
            contactInformation,
            professionalInformation,
            about,
            selectedHospitalId,
            specializationId,
        } = formData;

        if (
            !bio.firstName ||
            !bio.lastName ||
            !bio.gender ||
            !bio.dateOfBirth
        ) {
            setFormErrors("Please fill out all bio fields.");
            return false;
        }

        if (
            !contactInformation.phoneNumber ||
            !contactInformation.city ||
            !contactInformation.state
        ) {
            setFormErrors("Please complete the contact information.");
            return false;
        }

        if (
            !professionalInformation.departmentId ||
            !specializationId ||
            !about
        ) {
            setFormErrors(
                "Complete all professional fields and about section."
            );
            return false;
        }

        // Hospital validation: required for super admins
        if (user?.role === "SUPER_ADMIN" && !selectedHospitalId) {
            setFormErrors("Please select a hospital.");
            return false;
        }

        setFormErrors(null);
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Auto-assign hospital for admins
        if (user?.role === "ADMIN") {
            setFormData({
                ...formData,
                selectedHospitalId: user.hospitalId ?? 0, // Fallback to 0 if hospitalId is null
            });
        }

        if (!validateFormData()) {
            setLoading(false);
            return;
        }

        try {
            const userResponse = await fetch(`${process.env.API_URL}/doctors`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const userData = await userResponse.json();
            if (userResponse.ok) {
                setUserId(userData.result.user.userId);

                if (selectedFile) {
                    await handleFileUpload(userData.result.user.userId);
                }

                setUploadSuccess(true);
            } else {
                console.error(
                    "Error creating user and doctor:",
                    userData.message
                );
            }
        } catch (error) {
            console.error("Error during user creation:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle file upload after receiving the userId
    const handleFileUpload = async (userId: string) => {
        if (!selectedFile) return;

        try {
            const formData = new FormData();
            formData.append("image", selectedFile);
            formData.append("userId", userId);

            const response = await fetch("/api/upload/profile-image", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            console.log("Image uploaded successfully:", data.fileUrl);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    // Clear the selected image
    const handleClearImage = () => {
        setProfileImage(null);
        setSelectedFile(null);
    };

    return (
        <div className="h-full bg-white flex flex-col gap-6 p-6 mx-4 rounded-xl shadow-lg shadow-gray-300 overflow-y-scroll scrollbar-custom">
            <h1 className="font-bold text-xl">Add New Doctor</h1>

            <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
                <div className="flex gap-7 flex-wrap">
                    {/* Upload Profile Picture */}
                    <div className="flex flex-col p-2 w-1/3 gap-4 min-w-[360px] max-w-[500px] flex-1">
                        <h1 className="font-semibold text-primary">
                            Upload Profile Picture
                        </h1>
                        <div
                            className="relative group bg-gray-200 flex flex-col gap-4 py-10 items-center justify-center border-4 border-dashed border-slate-400 p-4 rounded-xl cursor-pointer"
                            onClick={() =>
                                document.getElementById("fileInput")?.click()
                            }
                        >
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: "none" }}
                                accept="image/*"
                                onChange={handleFileSelect}
                            />

                            {profileImage ? (
                                <Image
                                    src={profileImage}
                                    alt="Profile Preview"
                                    width={100}
                                    height={100}
                                    className="rounded-full"
                                />
                            ) : (
                                <Image
                                    alt="Upload Placeholder"
                                    src="/images/pastedimage.png"
                                    width={100}
                                    height={100}
                                    className="rounded-full"
                                />
                            )}

                            <div className="bg-slate-300 border-2 border-slate-400 p-4 px-12 rounded-[90px]">
                                <p className="text-xl font-semibold text-slate-500">
                                    Drag Image Here
                                </p>
                            </div>

                            <p className="text-base font-semibold">
                                Maximum image size 30mb
                            </p>

                            <div className="absolute inset-0 bg-bluelight/15 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {profileImage && (
                            <button
                                type="button"
                                onClick={handleClearImage}
                                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                            >
                                Clear Image
                            </button>
                        )}
                    </div>

                    {/* Bio Section */}
                    <div className="flex flex-col w-1/3 gap-4 min-w-[360px] max-w-[500px] flex-1">
                        <h1 className="font-semibold text-primary">Bio</h1>
                        <div className="flex flex-col">
                            <div className="py-3 border-b flex flex-col gap-2">
                                <label
                                    htmlFor="first-name"
                                    className="capitalize font-semibold"
                                >
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="first-name"
                                    name="firstName"
                                    className="outline-none"
                                    placeholder="Enter First Name"
                                    value={formData.bio.firstName}
                                    onChange={(e) =>
                                        handleChange(e, "bio", "firstName")
                                    }
                                />
                            </div>
                            <div className="py-3 border-b flex flex-col gap-2">
                                <label
                                    htmlFor="surname"
                                    className="capitalize font-semibold"
                                >
                                    Surname
                                </label>
                                <input
                                    type="text"
                                    id="surname"
                                    name="surname"
                                    className="outline-none"
                                    placeholder="Enter Surname"
                                    value={formData.bio.lastName}
                                    onChange={(e) =>
                                        handleChange(e, "bio", "lastName")
                                    }
                                />
                            </div>
                            {/* Date of Birth Input */}
                            <div className="py-3 border-b flex flex-col gap-2">
                                <label
                                    htmlFor="dateOfBirth"
                                    className="capitalize font-semibold"
                                >
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    className="outline-none"
                                    value={formData.bio.dateOfBirth}
                                    onChange={(e) =>
                                        handleChange(e, "bio", "dateOfBirth")
                                    }
                                />
                            </div>
                            {/* Display Calculated Age */}
                            {age !== null && (
                                <div className="py-3">
                                    <p className="font-semibold">
                                        Age: {age} years
                                    </p>
                                </div>
                            )}
                            <div className="py-3 border-b flex flex-col gap-2">
                                <label
                                    htmlFor="gender"
                                    className="capitalize font-semibold"
                                >
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    id="gender"
                                    className="outline-none"
                                    value={formData.bio.gender}
                                    onChange={(e) =>
                                        handleChange(e, "bio", "gender")
                                    }
                                >
                                    <option value="" disabled>
                                        Select Gender
                                    </option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="flex flex-col w-1/3 gap-4 min-w-[360px] max-w-[500px] flex-1">
                        <h1 className="font-semibold text-primary">
                            Contact Information
                        </h1>
                        <div className="py-3 border-b flex flex-col gap-2">
                            <label
                                htmlFor="phoneNumber"
                                className="capitalize font-semibold"
                            >
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                className="outline-none"
                                placeholder="+234 *********"
                                value={formData.contactInformation.phoneNumber}
                                onChange={(e) =>
                                    handleChange(
                                        e,
                                        "contactInformation",
                                        "phoneNumber"
                                    )
                                }
                            />
                        </div>
                        <div className="py-3 border-b flex flex-col gap-2">
                            <label
                                htmlFor="city"
                                className="capitalize font-semibold"
                            >
                                City
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                className="outline-none"
                                placeholder="Enter City"
                                value={formData.contactInformation.city}
                                onChange={(e) =>
                                    handleChange(
                                        e,
                                        "contactInformation",
                                        "city"
                                    )
                                }
                            />
                        </div>
                        <div className="py-3 border-b flex flex-col gap-2">
                            <label
                                htmlFor="state"
                                className="capitalize font-semibold"
                            >
                                State
                            </label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                className="outline-none"
                                placeholder="Enter State"
                                value={formData.contactInformation.state}
                                onChange={(e) =>
                                    handleChange(
                                        e,
                                        "contactInformation",
                                        "state"
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Information */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-primary font-semibold capitalize">
                        Professional Information
                    </h1>
                    <div className="py-3 border-b flex flex-col gap-2">
                        <label
                            htmlFor="specializationId"
                            className="capitalize font-semibold"
                        >
                            Specialization
                        </label>
                        <select
                            name="specializationId"
                            id="specializationId"
                            className="outline-none"
                            value={formData.specializationId}
                            onChange={(e) =>
                                handleChange(
                                    e,
                                    "specializationId",
                                    "specializationId"
                                )
                            }
                        >
                            <option value="" disabled>
                                Select Specialization
                            </option>
                            {specialties.map((specialization) => (
                                <option
                                    key={specialization.specializationId}
                                    value={specialization.specializationId}
                                >
                                    {specialization.name}{" "}
                                    {/* Display the name, but use the ID as the value */}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Department ID */}
                    <div className="py-3 border-b flex flex-col gap-2">
                        <label
                            htmlFor="departmentId"
                            className="capitalize font-semibold"
                        >
                            Department
                        </label>
                        <select
                            name="departmentId"
                            id="departmentId"
                            className="outline-none"
                            value={
                                formData.professionalInformation.departmentId
                            }
                            onChange={(e) =>
                                handleChange(
                                    e,
                                    "professionalInformation",
                                    "departmentId"
                                )
                            }
                        >
                            <option value="" disabled>
                                Select Department
                            </option>
                            {departments.map((department) => (
                                <option
                                    key={department.departmentId}
                                    value={department.departmentId}
                                >
                                    {department.name}{" "}
                                    {/* Display the name, but use the ID as the value */}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Qualifications */}
                    <div className="py-3 border-b flex flex-col gap-2">
                        <label
                            htmlFor="qualifications"
                            className="capitalize font-semibold"
                        >
                            Qualifications
                        </label>
                        <input
                            type="text"
                            id="qualifications"
                            name="qualifications"
                            className="outline-none"
                            placeholder="Enter Qualifications"
                            value={
                                formData.professionalInformation.qualifications
                            }
                            onChange={(e) =>
                                handleChange(
                                    e,
                                    "professionalInformation",
                                    "qualifications"
                                )
                            }
                        />
                    </div>
                </div>

                {/* Hospital Selection (Only for Super Admins) */}
                {user?.role === "SUPER_ADMIN" && (
                    <div className="py-3 border-b flex flex-col gap-2">
                        <label
                            htmlFor="selectedHospitalId"
                            className="capitalize font-semibold"
                        >
                            Select Hospital
                        </label>
                        <select
                            name="selectedHospitalId"
                            id="selectedHospitalId"
                            className="outline-none"
                            value={formData.selectedHospitalId}
                            onChange={(e) =>
                                handleChange(
                                    e,
                                    "selectedHospitalId",
                                    "selectedHospitalId"
                                )
                            }
                        >
                            <option value="" disabled>
                                Select Hospital
                            </option>
                            {hospitals.map((hospital) => (
                                <option
                                    key={hospital.hospitalId}
                                    value={hospital.hospitalId}
                                >
                                    {hospital.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* About Section */}
                <div className="flex flex-col gap-4">
                    <label
                        htmlFor="about"
                        className="text-primary font-semibold"
                    >
                        About
                    </label>
                    <textarea
                        name="about"
                        id="about"
                        className="bg-slate-200 h-[250px] resize-none outline-none rounded"
                        placeholder="About the Doctor"
                        value={formData.about}
                        onChange={(e) => handleChange(e, "about", "about")}
                    ></textarea>
                </div>

                {/* Form Errors */}
                {formErrors && <p className="text-red-600">{formErrors}</p>}

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-primary text-white py-2 px-6 rounded-lg"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Save Doctor"}
                    </button>
                </div>

                {uploadSuccess && (
                    <div className="mt-4 text-green-600">
                        Profile image uploaded and doctor information saved
                        successfully!
                    </div>
                )}
            </form>
        </div>
    );
}

export default AddDoctorPage;
