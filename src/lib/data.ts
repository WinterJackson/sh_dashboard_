// src/lib/data.ts

import { Appointment } from "./definitions";


// Fetch available doctors
export async function fetchOnlineDoctors() {
    try {
        const response = await fetch("/api/doctors");
        const data = await response.json();

        // Filter the data for online doctors only
        const onlineDoctors = data.filter(
            (doctor: { status: string }) => doctor.status === "Online"
        );

        return onlineDoctors;
    } catch (error) {
        console.error("Failed to fetch doctors:", error);
        return [];
    }
}

// Fetch doctor details
export async function fetchDoctorDetails(doctorId: string) {
    try {
        const response = await fetch(`/api/doctors/${doctorId}`);
        const doctor = await response.json();

        console.log(doctor);
        return doctor;
    } catch (error) {
        console.error("Failed to fetch doctors:", error);
        return [];
    }
}

export const fetchOnlineDoctorsByHospital = async (hospitalId: number) => {
    try {
        const response = await fetch(`/api/doctors/byHospital/${hospitalId}`);

        const data =  await response.json();

        if (!response.ok) {
            throw new Error(`Failed to fetch online doctors: ${response.statusText}`);
        }

        // Map the online doctors to only include username and specialization
        const doctorDetails = data.map((doctor: { doctorId: string, specialization: string; user: { username: string } }) => ({
            doctorId: doctor.doctorId,
            username: doctor.user.username,
            specialization: doctor.specialization
        }));

        return doctorDetails;

    } catch (error) {
        console.error("Error fetching online doctors:", error);
        throw error;
    }
};

// Fetch all doctors
export async function fetchAllDoctors() {
    try {
        const response = await fetch("/api/doctors");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch doctors:", error);
        return [];
    }
}

// Fetch all hospitals
export async function fetchAllHospitals() {
    try {
        const response = await fetch("/api/hospitals");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch hospitals:", error);
        return [];
    }
}

// Fetch patient details by name
export async function fetchPatientDetails(name: string) {
    try {
        const response = await fetch(`/api/patients/byName/${name}`);
        if (!response.ok) {
            throw new Error("Patient not found");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch patient details:", error);
        return null;
    }
}

// Fetch available beds
export async function fetchAvailableBeds() {
    try {
        const response = await fetch("/api/beds");
        const data = await response.json();

        console.log(data)

        const availableBeds = data.filter((bed: any) => bed.availability === "Available");

        console.log(availableBeds)
        return availableBeds;
    } catch (error) {
        console.error("Failed to fetch beds:", error);
        return [];
    }
}

// Fetch appointments
export async function fetchAppointments(): Promise<Appointment[]> {
    try {
        const response = await fetch("/api/appointments");
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw error;
    }
}

// Update appointment status
export async function updateAppointmentStatus(appointmentId: string, updateData: { status: string; reason: string }) {
    try {

        console.log("Sending PATCH request with the following data:", {
            appointmentId,
            updateData,
        });

        const response = await fetch(`/api/appointments/${appointmentId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            throw new Error(`Failed to update appointment: ${response.statusText}`);
        }

        const updatedAppointment = await response.json();
        console.log("Received response from server:", updatedAppointment);

        return updatedAppointment;
    } catch (error) {
        console.error("Error updating appointment:", error);
        throw error;
    }
}

// Fetch today's appointments count
export async function fetchTodayAppointments() {
    try {
        const response = await fetch("/api/appointments/today");
        const data = await response.json();

        console.log(data);

        return data.count;
    } catch (error) {
        console.error("Failed to fetch today's appointments:", error);
        return 0;
    }
}

// Fetch appointments for the last 14 days
export async function fetchAppointmentsForLast14Days() {
    try {
        const response = await fetch("/api/appointments/lastfortnight");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch appointments for the last 14 days:", error);
        return [];
    }
}

// Fetch today's patients count
export async function fetchPatientsToday() {
    try {
        const response = await fetch("/api/patients/today");
        const data = await response.json();
        return data.count;
    } catch (error) {
        console.error("Failed to fetch today's patients:", error);
        return 0;
    }
}

// Fetch patients for the last 14 days
export async function fetchPatientsForLast14Days() {
    try {
        const response = await fetch("/api/patients/lastfortnight");
        if (!response.ok) {
            throw new Error("Failed to fetch patients for the last 14 days");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching patients for the last 14 days:", error);
        return [];
    }
}

// Fetch doctors by hospital
export async function fetchDoctorsByHospital(hospitalId: number) {
    try {
        const response = await fetch(`/api/doctors/byHospital/${hospitalId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch doctors:", error);
        return [];
    }
}

