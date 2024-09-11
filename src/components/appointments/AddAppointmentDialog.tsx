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
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import { IconButton } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
    fetchOnlineDoctorsByHospital,
    fetchPatientDetails,
    fetchDoctorIdByUserId,
    fetchAllHospitals,
} from "@/lib/data";
import { useSessionData } from "@/hooks/useSessionData";
import { differenceInYears } from "date-fns";

interface AddAppointmentDialogProps {
    onClose: () => void;
}

const AddAppointmentDialog: React.FC<AddAppointmentDialogProps> = ({
    onClose,
}) => {
    const { register, handleSubmit, control, setValue } = useForm();
    const [saved, setSaved] = useState<boolean>(false);
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

    useEffect(() => {
        const fetchData = async () => {

        try {

            if (role === "SUPER_ADMIN" && patientDetails) {
                const fetchedDoctors = await fetchOnlineDoctorsByHospital(
                    patientDetails.hospitalId
                );
                setDoctors(fetchedDoctors);

                const fetchHospitals = await fetchAllHospitals();

                // Filter the data for online doctors only
                const fetchedHospitals = fetchHospitals.filter(
                    (hospital: { hospitalId: number }) => hospital.hospitalId === patientDetails.hospitalId
                );

                console.log(fetchedHospitals)

                setHospitals(fetchedHospitals);

            } else if ((role === "ADMIN" || role === "NURSE") && hospitalId) {
                const fetchedDoctors = await fetchOnlineDoctorsByHospital(
                    hospitalId
                );
                setDoctors(fetchedDoctors);
            } else if (role === "DOCTOR") {
                setDoctors([]); // Doctor schedules for themselves
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    }
        fetchData();
    }, [role, hospitalId, patientDetails]);

    const fetchAndSetPatientDetails = async (name: string) => {
        const details = await fetchPatientDetails(name);
        if (details) {
            const age = differenceInYears(new Date(), new Date(details.dateOfBirth));
            setValue("age", age);
            setValue("patientId", details.patientId);
            setPatientDetails(details);
    
            if (role === "SUPER_ADMIN") {
                setValue("hospitalName", details.hospital.name);
                setValue("hospitalId", details.hospitalId);
            } else if ((role === "ADMIN" || role === "DOCTOR" || role === "NURSE") && sessionData?.user) {
                setValue("hospitalName", sessionData.user.hospital);
                setValue("hospitalId", sessionData.user.hospitalId);
            }
        } else {
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

            // SUPER_ADMIN should use the patient's hospitalId
            if (role === "SUPER_ADMIN" && patientDetails) {
                selectedHospitalId = patientDetails.hospitalId;
            }

            // Ensure hospitalId is not undefined or null
            if (!selectedHospitalId) {
                throw new Error("Hospital ID is missing");
            }

            const response = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    date: selectedDate?.toISOString(),
                    role,
                    hospitalId: selectedHospitalId,
                    doctorId: role === "DOCTOR" && userId ? await fetchDoctorIdByUserId(userId) : data.doctorId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add appointment");
            }

            const result = await response.json();

            console.log(result);
            setSaved(true);

            router.replace("/dashboard/appointments");
        } catch (error) {
            console.error(error);
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
                <details
                    className="text-primary cursor-pointer pl-1 text-sm bg-primary/10 py-1 rounded-[5px]"
                    title="Click to expand and read instructions."
                >
                    <summary className="font-semibold ">
                        Help - Appointment Form
                    </summary>
                    <div className="absolute bg-[#E5F0FB] outline outline-1 outline-secondary/50 z-10 rounded-[10px] mt-3 mr-7 pt-4 pb-4 pr-2">
                        <p className="ml-5 text-gray-500">
                            You are required to provide the following:
                        </p>
                        <ol className="list-disc ml-10 text-gray-500 text-[13px]">
                            <li>the patient&apos;s full name.</li>
                            <li>
                                the age will be <strong>automatically</strong>{" "}
                                provided if the patient&apos;s information is in
                                the database.
                            </li>
                            <li>
                                the patient&apos;s ID will also be{" "}
                                <strong>automatically</strong> provided if the
                                patient&apos;s information is in the database.
                            </li>
                            <li>
                                the time when the appointment should begin -
                                <strong>from</strong>.
                            </li>
                            <li>
                                the time when the appointment should end -{" "}
                                <strong>to</strong>.
                            </li>
                            <li>
                                the date when the appointment is expected to
                                happen.
                            </li>
                            <li>
                                the doctor who will be associated with the
                                appointment.
                            </li>
                            <li>
                                the hospital associated with the appointment.
                            </li>
                            <li>
                                the type of appointment weather{" "}
                                <strong>Virtual</strong> or{" "}
                                <strong>Walk In</strong>.
                            </li>
                        </ol>
                    </div>
                </details>
                <form className="p-1" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <div>
                            <Label htmlFor="patientName">Patient Name</Label>
                            <Input
                                id="patientName"
                                className="bg-[#EFEFEF]"
                                {...register("patientName", {
                                    required: true,
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
                                            className="flex bg-[#EFEFEF] h-10  w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                                            className="flex bg-[#EFEFEF] h-10  w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

                        {(role === "SUPER_ADMIN" || role === "ADMIN" || role === "NURSE") && (
                            <div>
                                <Label htmlFor="doctorId">Doctor</Label>
                                <select
                                    id="doctorId"
                                    {...register("doctorId", {
                                        required: true,
                                    })}
                                    className="flex h-10  w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option
                                        value=""
                                        className="bg-[#EFEFEF] text-gray-500"
                                    >
                                        Select a doctor
                                    </option>
                                    {doctors.map((doctor: any) => (
                                        <option
                                            key={doctor.doctorId}
                                            value={doctor.doctorId}
                                            className="bg-white"
                                        >
                                            Dr. {doctor.username} -{" "}
                                            {doctor.specialization}
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
                                    className="flex h-10  w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option
                                        value=""
                                        className="bg-[#EFEFEF] text-gray-500"
                                    >
                                        Select a hospital
                                    </option>
                                    {hospitals.map((hospital: any) => (
                                        <option
                                            key={hospital.hospitalId}
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
                                className="flex h-10  w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option
                                    value=""
                                    className="bg-[#EFEFEF] text-gray-500"
                                >
                                    Select type
                                </option>
                                <option value="Virtual" className="bg-white">
                                    Virtual
                                </option>
                                <option value="Walk In" className="bg-white">
                                    Walk In
                                </option>
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
                        <p className=" text-black">Saved Successfully!</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AddAppointmentDialog;
