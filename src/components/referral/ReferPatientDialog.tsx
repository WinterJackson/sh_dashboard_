// src/components/referral/ReferPatientDialog.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFetchPatientDetails } from "@/hooks/useFetchPatientDetails";
import { useCreateReferral } from "@/hooks/useCreateReferral";
import { useUser } from "@/app/context/UserContext";
import { Hospital, Role } from "@/lib/definitions";

interface ReferPatientDialogProps {
    onClose: () => void;
}

const ReferPatientDialog: React.FC<ReferPatientDialogProps> = ({ onClose }) => {
    const { register, handleSubmit, setValue } = useForm();
    const [saved, setSaved] = useState<boolean>(false);
    const [currentSection, setCurrentSection] = useState(1);
    const router = useRouter();
    const { user } = useUser();

    const role = user?.role as Role;
    const hospitalId = user?.hospitalId;
    const userId = user?.id;

    const [patientName, setPatientName] = useState("");

    // Use the hook to fetch patient details
    const {
        data: fetchedPatientDetails,
        isLoading,
        isError,
    } = useFetchPatientDetails(patientName, {
        role,
        hospitalId: hospitalId ?? null,
        userId: userId ?? null,
    });

    useEffect(() => {
        if (fetchedPatientDetails) {
            setValue("patientId", fetchedPatientDetails.patientId);
            setValue("gender", fetchedPatientDetails.gender);
            setValue(
                "dateOfBirth",
                fetchedPatientDetails.dateOfBirth
                    ? new Date(fetchedPatientDetails.dateOfBirth)
                          .toISOString()
                          .split("T")[0]
                    : ""
            ); // Date format 'YYYY-MM-DD'
            setValue("homeAddress", fetchedPatientDetails.homeAddress);
            setValue("state", fetchedPatientDetails.state);
            setValue("phoneNo", fetchedPatientDetails.phoneNo);
            setValue("email", fetchedPatientDetails.email);
            setValue("status", fetchedPatientDetails.status);
        } else if (isError) {
            setValue("patientId", "");
            setValue("gender", "");
            setValue("dateOfBirth", "");
            setValue("homeAddress", "");
            setValue("state", "");
            setValue("phoneNo", "");
            setValue("email", "");
            setValue("status", "");
        }
    }, [fetchedPatientDetails, isError, setValue]);

    // Function to auto-fill referring physician details
    const autoFillPhysicianDetails = useCallback(() => {
        if (user?.role === "DOCTOR" || user?.role === "NURSE") {
            // Determine prefix based on role
            const prefix = user.role === "DOCTOR" ? "Dr." : "Nurse";

            // Construct the full name using optional chaining
            const fullName = `${prefix} ${user.profile?.firstName || ""} ${
                user.profile?.lastName || ""
            }`;

            // Fetch department name based on user role
            const departmentName =
                user?.doctor?.department?.name ||
                user?.nurse?.department?.name ||
                "";

            // Fetch specialization based on user role
            const specialization =
                user?.doctor?.specialization ||
                user?.nurse?.specialization ||
                "";

            const hospital =
                user?.doctor?.hospital?.name ||
                user?.nurse?.hospital?.name ||
                "";

            // Auto-fill the form fields
            setValue("physicianName", fullName);
            setValue("physicianDepartment", departmentName);
            setValue("physicianSpecialty", specialization);
            setValue("physicianEmail", user?.email || "");
            setValue("physicianPhoneNumber", user.profile?.phoneNo || "");
            setValue("hospitalName", (hospital));
        }
    }, [user, setValue]);

    useEffect(() => {
        autoFillPhysicianDetails();
    }, [autoFillPhysicianDetails]);

    // Transform the user object to match the expected type
    const userForReferral = user
        ? { role: user.role as Role, hospitalId: user.hospitalId }
        : undefined;

    // Use the hook to create a referral, passing the user object
    const { mutate: createReferral, status } = useCreateReferral(userForReferral);
    const isCreatingReferral = status === "pending";

    const onSubmit = async (data: any) => {
        try {
            if (!hospitalId) {
                throw new Error("Hospital ID is missing");
            }

            // Prepare referral data
            const referralData = {
                patientId: data.patientId,
                patientName: data.patientName,
                gender: data.gender,
                dateOfBirth: data.dateOfBirth,
                homeAddress: data.homeAddress,
                state: data.state,
                phoneNo: data.phoneNo,
                email: data.email,
                physicianName: data.physicianName,
                physicianDepartment: data.physicianDepartment,
                physicianSpecialty: data.physicianSpecialty,
                physicianEmail: data.physicianEmail,
                physicianPhoneNumber: data.physicianPhoneNumber,
                hospitalName: data.hospitalName,
                type: data.type,
                primaryCareProvider: data.primaryCareProvider,
                referralAddress: data.referralAddress,
                referralPhone: data.referralPhone,
                reasonForConsultation: data.reasonForConsultation,
                diagnosis: data.diagnosis,
                status: data.status,
            };

            // Call the mutation
            createReferral(referralData, {
                onSuccess: (newReferral) => {
                    if (newReferral) {
                        setSaved(true);
                        // Optionally redirect to the referrals page
                        // router.replace('/dashboard/referrals');
                    }
                },
                onError: (error) => {
                    console.error("Failed to refer patient:", error);
                },
            });
        } catch (error) {
            console.error("Error submitting referral:", error);
        }
    };

    const handleClose = () => {
        onClose();
    };

    const renderSection1 = () => (
        <div className="relative h-auto grid gap-3">
            <details
                className="text-primary cursor-pointer pl-1 text-sm bg-primary/10 py-1 rounded-[5px]"
                title="Click to expand and read instructions."
            >
                <summary className="font-semibold items-center">
                    Help - Patient&apos;s Information.
                </summary>
                <div className="absolute bg-[#E5F0FB] outline outline-1 outline-secondary/50 z-10 rounded-[10px] mt-3 mr-2 pt-4 pb-4 pr-2">
                    <p className="ml-5 text-gray-500">
                        You are required to provide the following:
                    </p>
                    <ol className="list-disc ml-10 text-gray-500 text-[13px]">
                        <li>full name of the patient being referred.</li>
                        <li>gender of the patient.</li>
                        <li>date of birth of the patient.</li>
                        <li>phone number of the patient.</li>
                        <li>email of the patient.</li>
                        <li>
                            status of the patient (Inpatient or Outpatient).
                        </li>
                        <li>home address of the patient.</li>
                        <li>state where the patient resides.</li>
                    </ol>
                    <p className="ml-5 mt-2 font-semibold text-gray-500 text-[13px]">
                        NOTE: When you provide the patient&apos;s name, if the
                        patients details are in the database, the fields will
                        automatically be filled.
                    </p>
                </div>
            </details>

            <div>
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                    id="patientName"
                    className="bg-[#EFEFEF]"
                    {...register("patientName", {
                        required: true,
                        onBlur: (e) => setPatientName(e.target.value),
                    })}
                />
                {isLoading &&
                    <p className=" mt-2 p-2 rounded-[5px] text-sm bg-bluelight">
                        Loading Patient Details...
                    </p>}

                {isError &&
                    <p className="text-red-500 mt-2 p-2 rounded-[5px] bg-slate-400">
                        Patient not found
                    </p>}
            </div>
            <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                    id="gender"
                    {...register("gender", { required: true })}
                    className="flex bg-[#EFEFEF] h-10 w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="" className="bg-[#EFEFEF] text-gray-500">
                        Select Gender
                    </option>
                    <option value="Male" className="bg-white">
                        Male
                    </option>
                    <option value="Female" className="bg-white">
                        Female
                    </option>
                    <option value="Other" className="bg-white">
                        Other
                    </option>
                </select>
            </div>
            <div className="flex justify-between items-center my-2">
                <Label htmlFor="dateOfBirth" className="text-nowrap">
                    Date of Birth
                </Label>
                <Input
                    id="dateOfBirth"
                    type="date"
                    className="flex w-[220px] justify-end bg-[#EFEFEF]"
                    {...register("dateOfBirth", { required: true })}
                />
            </div>
            <div>
                <Label htmlFor="phoneNo">Phone Number</Label>
                <Input
                    id="phoneNo"
                    type="tel"
                    className="bg-[#EFEFEF]"
                    {...register("phoneNo", { required: true })}
                />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    className="bg-[#EFEFEF]"
                    {...register("email", { required: true })}
                />
            </div>
            <div>
                <Label htmlFor="status">Status</Label>
                <select
                    id="status"
                    {...register("status", { required: true })}
                    className="flex h-10 w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="" className="bg-[#EFEFEF] text-gray-500">
                        Select Status
                    </option>
                    <option value="Inpatient" className="bg-white">
                        Inpatient
                    </option>
                    <option value="Outpatient" className="bg-white">
                        Outpatient
                    </option>
                </select>
            </div>
            <div>
                <Label htmlFor="homeAddress">Home Address</Label>
                <Input
                    id="homeAddress"
                    className="bg-[#EFEFEF]"
                    {...register("homeAddress", { required: true })}
                />
            </div>
            <div>
                <Label htmlFor="state">State</Label>
                <select
                    id="state"
                    {...register("state", { required: true })}
                    className="flex h-10  w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="" className="bg-[#EFEFEF] text-gray-500">
                        Select State
                    </option>
                    <option value="State 1" className="bg-white">
                        State 1
                    </option>
                    <option value="State 2" className="bg-white">
                        State 2
                    </option>
                    <option value="State 3" className="bg-white">
                        State 3
                    </option>
                </select>
            </div>
            <div className="mt-4 flex justify-between">
                <Button type="button" onClick={handleClose} className="">
                    Cancel
                </Button>
                <Button type="button" onClick={() => setCurrentSection(2)}>
                    Next
                </Button>
            </div>
        </div>
    );

    const renderSection2 = () => {
        return (
            <div className="relative h-auto grid gap-3">
                {/* Help Section */}
                <details
                    className="text-primary cursor-pointer pl-1 text-sm bg-primary/10 py-1 rounded-[5px]"
                    title="Click to expand and read instructions."
                >
                    <summary className="font-semibold items-center">
                        Help - Referring Physician.
                    </summary>
                    <div className="absolute bg-[#E5F0FB] outline outline-1 outline-secondary/50 z-10 rounded-[10px] mt-3 mr-2 pt-4 pb-4 pr-2">
                        <p className="ml-5 text-gray-500">
                            You are required to provide the following:
                        </p>
                        <ol className="list-disc ml-10 text-gray-500 text-[13px]">
                            <li>
                                Full name of the referring physician (Doctor or
                                Nurse).
                            </li>
                            <li>Department of the referring physician.</li>
                            <li>Specialization of the referring physician.</li>
                            <li>Email of the referring physician.</li>
                            <li>Phone number of the referring physician.</li>
                        </ol>
                    </div>
                </details>

                {/* Physician Name Field */}
                <div>
                    <Label htmlFor="physicianName">Physician Name</Label>
                    <Input
                        id="physicianName"
                        className="bg-[#EFEFEF]"
                        {...register("physicianName", { required: true })}
                        value={`${
                            user?.role === "DOCTOR"
                                ? "Dr."
                                : user?.role === "NURSE"
                                ? "Nurse"
                                : ""
                        } ${user?.profile?.firstName} ${
                            user?.profile?.lastName
                        }`}
                        readOnly
                    />
                </div>

                {/* Hospital Name Field */}
                <div>
                    <Label htmlFor="hospitalName">Hospital Name</Label>
                    <Input
                        id="hospitalName"
                        className="bg-[#EFEFEF]"
                        {...register("hospitalName", { required: true })}
                        value={(user?.hospital as Hospital | null)?.name || ""} 
                        readOnly
                    />
                </div>

                {/* Department Field */}
                <div>
                    <Label htmlFor="department">Department</Label>
                    <select
                        id="department"
                        {...register("physicianDepartment", { required: true })}
                        className="flex h-10 w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={
                            user?.role === "DOCTOR"
                                ? user?.doctor?.department?.name
                                : user?.role === "NURSE"
                                ? user?.nurse?.department?.name
                                : ""
                        }
                    >
                        <option
                            value={
                                user?.role === "DOCTOR"
                                    ? user?.doctor?.department?.name
                                    : user?.role === "NURSE"
                                    ? user?.nurse?.department?.name
                                    : ""
                            }
                        >
                            {user?.role === "DOCTOR"
                                ? user?.doctor?.department?.name
                                : user?.role === "NURSE"
                                ? user?.nurse?.department?.name
                                : "Select Department"}
                        </option>
                        {/* Other options can be added here if needed */}
                    </select>
                </div>

                {/* Specialty Field */}
                <div>
                    <Label htmlFor="specialty">Specialty</Label>
                    <select
                        id="specialty"
                        {...register("physicianSpecialty", { required: true })}
                        className="flex h-10 w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={
                            user?.role === "DOCTOR"
                                ? user?.doctor?.specialization?.name // Use specialization name as string
                                : user?.role === "NURSE"
                                ? user?.nurse?.specialization?.name // Use specialization name as string
                                : ""
                        }
                    >
                        <option
                            value={
                                user?.role === "DOCTOR"
                                    ? user?.doctor?.specialization?.name
                                    : user?.role === "NURSE"
                                    ? user?.nurse?.specialization?.name
                                    : ""
                            }
                        >
                            {user?.role === "DOCTOR"
                                ? user?.doctor?.specialization?.name
                                : user?.role === "NURSE"
                                ? user?.nurse?.specialization?.name
                                : "Select Specialty"}
                        </option>
                    </select>
                </div>

                {/* Email Field */}
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        className="bg-[#EFEFEF]"
                        {...register("physicianEmail", { required: true })}
                        value={user?.email || ""}
                        readOnly
                    />
                </div>

                {/* Phone Number Field */}
                <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                        id="phoneNumber"
                        type="tel"
                        className="bg-[#EFEFEF]"
                        {...register("physicianPhoneNumber", {
                            required: true,
                        })}
                        value={user?.profile?.phoneNo || ""}
                        readOnly
                    />
                </div>

                {/* Navigation Buttons */}
                <div className="mt-4 flex justify-between">
                    <Button type="button" onClick={() => setCurrentSection(1)}>
                        Back
                    </Button>
                    <Button
                        type="button"
                        onClick={() => setCurrentSection(3)}
                        className="ml-2"
                    >
                        Next
                    </Button>
                </div>
            </div>
        );
    };

    const renderSection3 = () => (
        <div className="relative h-auto grid gap-3">
            <details
                className="text-primary cursor-pointer pl-1 text-sm bg-primary/10 py-1 rounded-[5px]"
                title="Click to expand and read instructions."
            >
                <summary className="font-semibold items-center">
                    Help - Referring Indication.
                </summary>
                <div className="absolute bg-[#E5F0FB] outline outline-1 outline-secondary/50 z-10 rounded-[10px] mt-3 mr-2 pt-4 pb-4 pr-2">
                    <p className="ml-5 text-gray-500">
                        You are required to provide the following:
                    </p>
                    <ol className="list-disc ml-10 text-gray-500 text-[13px]">
                        <li>type of referral (Internal or External).</li>
                        <li>
                            primary care provider for the patient - can be a
                            private/public hospital, doctor, nurse or relative.
                        </li>
                        <li>
                            address of the patient or that of the primary care
                            provider.
                        </li>
                        <li>
                            phone number of the patient or that of the primary
                            care provider.
                        </li>
                        <li>reason why patient needs consultation.</li>
                        <li>diagnosis of the patient.</li>
                    </ol>
                </div>
            </details>

            <div>
                <Label htmlFor="type">Type of Referral</Label>
                <select
                    id="type"
                    {...register("type", { required: true })}
                    className="flex h-10 w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="" className="bg-[#EFEFEF] text-gray-500">
                        Select Type
                    </option>
                    <option value="Internal" className="bg-white">
                        Internal
                    </option>
                    <option value="External" className="bg-white">
                        External
                    </option>
                </select>
            </div>
            <div>
                <Label htmlFor="primaryCareProvider">
                    Primary Care Provider
                </Label>
                <Input
                    id="primaryCareProvider"
                    className="bg-[#EFEFEF]"
                    {...register("primaryCareProvider", { required: true })}
                />
            </div>
            <div>
                <Label htmlFor="referralAddress">Referral Address</Label>
                <Input
                    id="referralAddress"
                    className="bg-[#EFEFEF]"
                    {...register("referralAddress", { required: true })}
                />
            </div>
            <div>
                <Label htmlFor="referralPhone">Referral Phone</Label>
                <Input
                    id="referralPhone"
                    className="bg-[#EFEFEF]"
                    {...register("referralPhone", { required: true })}
                />
            </div>
            <div>
                <Label htmlFor="reasonForConsultation">
                    Reason for Consultation
                </Label>
                <textarea
                    id="reasonForConsultation"
                    placeholder="Type here..."
                    className="w-full p-2 text-sm bg-[#EFEFEF] rounded-[5px] border h-auto ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("reasonForConsultation", { required: true })}
                />
            </div>
            <div>
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <textarea
                    id="diagnosis"
                    placeholder="Type here..."
                    className="w-full p-2 text-sm bg-[#EFEFEF] rounded-[5px] border h-auto ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("diagnosis", { required: true })}
                />
            </div>
            <div className="mt-4 flex justify-between">
                <Button type="button" onClick={() => setCurrentSection(2)}>
                    Back
                </Button>
                <Button
                    type="submit"
                    disabled={saved || isCreatingReferral}
                    className="ml-2"
                >
                    {isCreatingReferral ? "Submitting..." : "Refer Patient"}
                </Button>
            </div>
        </div>
    );

    return (
        <Dialog open={true} onOpenChange={handleClose}>
            <DialogTrigger asChild>
                <button className="hidden"></button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Patient Referral Form</DialogTitle>
                <DialogDescription className="bg-[#EFEFEF] p-2">
                    Fill out the form below to refer a patient.
                </DialogDescription>
                <form className="p-1" onSubmit={handleSubmit(onSubmit)}>
                    {currentSection === 1 && renderSection1()}
                    {currentSection === 2 && renderSection2()}
                    {currentSection === 3 && renderSection3()}
                </form>
                {saved && (
                    <div className="absolute bottom-11 bg-bluelight left-20 ml-12 p-2 rounded-[10px]">
                        <p className=" text-black">Referred Successfully!</p>
                    </div>
                )}
                <DialogClose onClick={handleClose} />
            </DialogContent>
        </Dialog>
    );
};

export default ReferPatientDialog;