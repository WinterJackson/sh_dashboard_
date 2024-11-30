// src/components/appointments/AddAppointmentDialog.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import { IconButton } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
    fetchDoctorsByHospital,
    fetchPatientDetails,
    fetchDoctorIdByUserId,
    fetchAllHospitals,
} from "@/lib/data";
import { useSessionData } from "@/hooks/useSessionData";
import { differenceInYears } from "date-fns";

interface AddAppointmentDialogProps {
    onClose: () => void;
    doctor?: any;
}

const AddAppointmentDialog: React.FC<AddAppointmentDialogProps> = ({
    onClose,
    doctor,
}) => {
    const { register, handleSubmit, control, setValue, setError } = useForm();
    const [saved, setSaved] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        undefined
    );
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [patientDetails, setPatientDetails] = useState<any | null>(null);
    const router = useRouter();
    const sessionData = useSessionData();
    const role = sessionData?.user?.role;
    const hospitalId = sessionData?.user?.hospitalId;
    const userId = sessionData?.user?.id;

    console.log(userId)

    useEffect(() => {
        if (doctor) {
            // Pre-fill doctor and hospital fields if doctor prop is passed
            setValue(
                "doctorName",
                `${doctor.user.profile.firstName} ${doctor.user.profile.lastName}`
            );
            setValue("hospitalName", doctor.hospital.name);
            setValue("doctorId", doctor.doctorId);
        }

        const fetchData = async () => {
            try {
                if (role === "SUPER_ADMIN" && patientDetails) {
                    const fetchedDoctors = await fetchDoctorsByHospital(patientDetails.hospitalId);
                    setDoctors(fetchedDoctors);
                    const fetchedHospitals = await fetchAllHospitals();
                    setHospitals(fetchedHospitals);
                } else if ((role === "ADMIN" || role === "NURSE") && hospitalId) {
                    const fetchedDoctors = await fetchDoctorsByHospital(hospitalId);
                    setDoctors(fetchedDoctors);
                } else if (role === "DOCTOR" && userId) {
                    const doctorData = await fetchDoctorIdByUserId(userId);
                    if (doctorData) {
                        setValue("doctorId", doctorData.doctorId.toString());
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, [role, hospitalId, patientDetails, doctor, setValue, userId]);

    const fetchAndSetPatientDetails = async (name: string) => {
        const details = await fetchPatientDetails(name);
        if (details) {
            const age = differenceInYears(
                new Date(),
                new Date(details.dateOfBirth)
            );
            setValue("age", age);
            setValue("patientId", details.patientId);
            setPatientDetails(details);

            if (role === "SUPER_ADMIN") {
                setValue("hospitalName", details.hospital.name);
                setValue("hospitalId", details.hospitalId);
            } else if (
                (role === "ADMIN" || role === "DOCTOR" || role === "NURSE") &&
                sessionData?.user
            ) {
                setValue("hospitalName", sessionData.user.hospital);
                setValue("hospitalId", sessionData.user.hospitalId);
            }
        } else {
            setError("patientName", { message: "Patient not found" });
            setValue("age", "");
            setValue("patientId", "");
            setValue("hospitalName", "");
            setValue("hospitalId", "");
            setPatientDetails(null);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            let selectedHospitalId = hospitalId;

            if (role === "SUPER_ADMIN" && patientDetails) {
                selectedHospitalId = patientDetails.hospitalId;
            }

            if (!selectedHospitalId) {
                setError("hospitalId", { message: "Hospital ID is missing" });
                throw new Error("Hospital ID is missing");
            }

            const doctorId =
                role === "DOCTOR" && userId
                    ? (await fetchDoctorIdByUserId(userId))?.doctorId
                    : data.doctorId;

            if (!doctorId) {
                setError("doctorId", { message: "Doctor ID is missing" });
                throw new Error("Doctor ID is missing");
            }

            const response = await fetch(`${process.env.API_URL}/appointments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    date: selectedDate?.toISOString(),
                    hospitalId: selectedHospitalId,
                    doctorId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add appointment");
            }

            setSaved(true);
            router.replace("/dashboard/appointments");
        } catch (error) {
            console.error("Failed to save appointment:", error);
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        setIsCalendarOpen(false);
    };

    return (
        <Dialog open={true} onOpenChange={handleClose}>
            <DialogTrigger asChild>
                <button className="hidden"></button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Schedule Appointment</DialogTitle>
                <DialogDescription className="bg-[#EFEFEF] p-2">
                    Fill out the form below to add a new appointment.
                </DialogDescription>
                <form className="p-1" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <div>
                            <Label htmlFor="patientName">Patient Name</Label>
                            <Input
                                id="patientName"
                                className="bg-[#EFEFEF]"
                                {...register("patientName", {
                                    required: "Patient name is required",
                                    onBlur: (e) =>
                                        fetchAndSetPatientDetails(
                                            e.target.value
                                        ),
                                })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                className="bg-[#EFEFEF]"
                                {...register("age", { required: true })}
                                readOnly={!!patientDetails}
                            />
                        </div>
                        <div>
                            <Label htmlFor="patientId">Patient ID</Label>
                            <Input
                                id="patientId"
                                className="bg-[#EFEFEF]"
                                {...register("patientId", { required: true })}
                                readOnly={!!patientDetails}
                            />
                        </div>
                        <div className="flex gap-2">
                            <div>
                                <Label htmlFor="timeFrom">From</Label>
                                <Controller
                                    control={control}
                                    name="timeFrom"
                                    render={({ field }) => (
                                        <input
                                            type="time"
                                            {...field}
                                            className="flex bg-[#EFEFEF] h-10 w-full border px-3 py-2 text-sm rounded-[5px]"
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Label htmlFor="timeTo">To</Label>
                                <Controller
                                    control={control}
                                    name="timeTo"
                                    render={({ field }) => (
                                        <input
                                            type="time"
                                            {...field}
                                            className="flex bg-[#EFEFEF] h-10 w-full border px-3 py-2 text-sm rounded-[5px]"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="date">Date</Label>
                            <div className="flex items-center rounded-[5px] bg-[#EFEFEF]">
                                <Input
                                    id="date"
                                    className="rounded-[5px] bg-white/90"
                                    value={
                                        selectedDate
                                            ? selectedDate.toLocaleDateString()
                                            : ""
                                    }
                                    readOnly
                                />
                                <IconButton
                                    onClick={() =>
                                        setIsCalendarOpen(!isCalendarOpen)
                                    }
                                >
                                    <CalendarTodayIcon />
                                </IconButton>
                            </div>
                            {isCalendarOpen && (
                                <div className="fixed z-50 bg-slate-200 mt-1">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={handleDateChange}
                                    />
                                </div>
                            )}
                        </div>

                        {(role === "SUPER_ADMIN" ||
                            role === "ADMIN" ||
                            role === "NURSE") && (
                            <div>
                                <Label htmlFor="doctorId">Doctor</Label>
                                <select
                                    id="doctorId"
                                    {...register("doctorId", {
                                        required: "Doctor is required",
                                    })}
                                    className="flex h-10 w-full border px-3 py-2 text-sm rounded-[5px]"
                                >
                                    <option
                                        value=""
                                        className="bg-[#EFEFEF] text-gray-500"
                                    >
                                        Select a doctor
                                    </option>
                                    {doctors.map((doc: any) => (
                                        <option
                                            key={doc.doctorId}
                                            value={doc.doctorId}
                                            className="bg-white"
                                        >
                                            Dr. {doc.user.profile.firstName}{" "}
                                            {doc.user.profile.lastName} -{" "}
                                            {doc.specialization.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {role === "SUPER_ADMIN" && (
                            <div>
                                <Label htmlFor="hospitalName">Hospital</Label>
                                <select
                                    id="hospitalName"
                                    {...register("hospitalName", {
                                        required: true,
                                    })}
                                    className="flex h-10 w-full border px-3 py-2 text-sm rounded-[5px]"
                                >
                                    <option
                                        value=""
                                        className="bg-[#EFEFEF] text-gray-500"
                                    >
                                        Select a hospital
                                    </option>
                                    {hospitals.map((hospital: any) => (
                                        <option
                                            key={hospital.name}
                                            value={hospital.name}
                                            className="bg-white"
                                        >
                                            {hospital.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <Label htmlFor="type">Appointment Type</Label>
                            <select
                                id="type"
                                {...register("type", { required: true })}
                                className="flex h-10 w-full border px-3 py-2 text-sm rounded-[5px]"
                            >
                                <option value="" disabled>
                                    Select type
                                </option>
                                <option value="Virtual">Virtual</option>
                                <option value="Walk In">Walk In</option>
                            </select>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button type="submit" disabled={saved}>
                                Save
                            </Button>
                        </div>
                    </div>
                </form>
                {saved && (
                    <div className="absolute bottom-7 bg-bluelight ml-7 p-2 rounded-[10px]">
                        <p className="text-black">Saved Successfully!</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AddAppointmentDialog;
