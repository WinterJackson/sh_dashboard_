// src/lib/data.ts

import * as Sentry from "@sentry/nextjs";
import { Appointment, Role, Doctor, Patient } from "./definitions";

// Fetch available doctors
export async function fetchOnlineDoctors(): Promise<Doctor[]> {
    try {
        const response = await fetch(`${process.env.API_URL}/doctors`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch doctors: ${response.status} ${response.statusText}`);
        }

        const data: Doctor[] = await response.json();

        // Filter the data for online doctors only
        const onlineDoctors = data.filter((doctor) => doctor.status === "Online");

        return onlineDoctors;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to fetch doctors:", error);
        return [];
    }
}

// Fetch doctor details
export async function fetchDoctorDetails(doctorId: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/doctors/${doctorId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch doctor details: ${response.status} ${response.statusText}`);
        }

        const doctor = await response.json();

        return doctor;
    } catch (error) {
        Sentry.captureException(error);
        console.error(`Error fetching details for doctor ID ${doctorId}:`, error);
        return null;
    }
}

// Fetch doctor by userId
export const fetchDoctorIdByUserId = async (
    userId: string
): Promise<{ doctorId: number } | null> => {
    if (!userId) {
        console.error("No userId provided to fetchDoctorIdByUserId");
        return null;
    }

    try {
        const response = await fetch(`${process.env.API_URL}/doctors/byUserId/${userId}`, {
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch doctor data: ${response.statusText}`);
        }

        const doctor = await response.json();

        if (!doctor || typeof doctor.doctorId !== "number") {
            console.warn("Doctor data is incomplete or doctorId is missing.");
            return null;
        }

        return doctor; // Ensure the full doctor object is returned
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching doctor data:", error);
        return null;
    }
};

// Fetch all doctors
export async function fetchAllDoctors(): Promise<Doctor[]> {
    try {
        const response = await fetch(`${process.env.API_URL}/doctors`, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch doctors: ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new TypeError("Expected an array of doctors");
        }

        return data;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to fetch all doctors:", error);
        return [];
    }
}

// Fetch all hospitals
export async function fetchAllHospitals() {
    try {
        const response = await fetch(`${process.env.API_URL}/hospitals`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        return data;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to fetch hospitals:", error);
        return [];
    }
}

// Fetch patient details by name
export async function fetchPatientDetails(name: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/patients/byName/${name}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`Patient '${name}' not found.`);
                return null;
            }
            throw new Error(`Failed to fetch patient details: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to fetch patient details:", error);
        return null;
    }
}

// Fetch available beds
export async function fetchAvailableBeds() {
    try {
        const response = await fetch(`${process.env.API_URL}/beds`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch beds: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        const availableBeds = data.filter(
            (bed: any) => bed.availability === "Occupied"
        );

        return availableBeds;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to fetch beds:", error);
        return [];
    }
}

// Fetch appointments
export async function fetchAppointments(
    role: string | null = null,
    hospitalId: number | null = null,
    page: number = 1,
    pageSize: number = 15
): Promise<{ appointments: Appointment[]; totalAppointments: number; page: number; pageSize: number }> {
    try {
        const queryParams = new URLSearchParams({
            ...(role && { role }),
            ...(hospitalId && { hospitalId: hospitalId.toString() }),
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        const response = await fetch(`${process.env.API_URL}/appointments?${queryParams}`, {
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching appointments:", error);
        return {
            appointments: [],
            totalAppointments: 0,
            page,
            pageSize,
        };
    }
}

// Function to fetch appointments by hospitalId
export const fetchAppointmentsByHospital = async (hospitalId: number) => {
    try {
        const response = await fetch(`${process.env.API_URL}/appointments/byHospital/${hospitalId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to fetch appointments by hospital:", error);
        return [];
    }
}

// Update appointment status
export async function updateAppointmentStatus(
    appointmentId: string,
    updateData: { status: string; reason: string }
) {
    if (!appointmentId || !updateData) {
        throw new Error("Appointment ID and update data are required.");
    }

    try {
        const response = await fetch(`${process.env.API_URL}/appointments/${appointmentId}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            throw new Error(`Failed to update appointment: ${response.statusText}`);
        }

        const updatedAppointment = await response.json();
        return updatedAppointment;
    } catch (error) {
        Sentry.captureException(error);
        console.error(`Error updating appointment ID ${appointmentId}:`, error);
        return null;
    }
}

// Update appointment type
export async function updateAppointmentType(
    appointmentId: string,
    newType: string
): Promise<{ success: boolean; updatedType?: string }> {
    try {
        const response = await fetch(`${process.env.API_URL}/appointments/${appointmentId}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: newType }),
        });

        if (!response.ok) {
            throw new Error(`Error updating appointment type: ${response.statusText}`);
        }

        const updatedAppointment = await response.json();
        return { success: true, updatedType: updatedAppointment.type };
    } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to update appointment type:", error);
        return { success: false };
    }
}


// Fetch today's appointments count
export async function fetchTodayAppointments() {
    try {
        const response = await fetch(`${process.env.API_URL}/appointments/today`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to fetch today's appointments:", error);
        return 0;
    }
}

// Fetch appointments for the last 14 days
export async function fetchAppointmentsForLast14Days() {
    try {
        const response = await fetch(`${process.env.API_URL}/appointments/lastfortnight`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to fetch appointments for the last 14 days:", error);
        return [];
    }
}

// Fetch today's patients count
export async function fetchPatientsToday() {
    try {
        const response = await fetch(`${process.env.API_URL}/patients/today`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to fetch today's patients:", error);
        return 0;
    }
}

// Fetch all patients
export async function fetchAllPatients(): Promise<Patient[]> {
    try {
        const response = await fetch(`${process.env.API_URL}/patients`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        return data.map((patient: any) => ({
            ...patient,
            appointments: patient.appointments || [],
        }));
    } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to fetch patients:", error);
        return [];
    }
}

// Fetch patients by hospitalId
export async function fetchPatientsByHospital(hospitalId: number): Promise<Patient[]> {
    try {
        const response = await fetch(`${process.env.API_URL}/patients/byHospital/${hospitalId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.AUTH_TOKEN}`
            },
        });

        // Check if response is successful
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Ensure the data is an array before mapping
        if (!Array.isArray(data)) {
            throw new TypeError("Expected data to be an array of patients");
        }

        return data.map((patient: any) => ({
            ...patient,
            appointments: patient.appointments || [],
        }));
    } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to fetch patients by hospital:", error);
        return [];
    }
}

// Fetch patients based on user role
export async function fetchPatientsByRole(user: any): Promise<Patient[]> {
    try {
        if (!user || !user.role) {
            throw new Error("User object with a valid role is required.");
        }

        if (user.role === Role.SUPER_ADMIN) {
            return await fetchAllPatients();
        }

        if (['ADMIN', 'DOCTOR', 'NURSE', 'STAFF'].includes(user.role) && user.hospitalId) {
            return await fetchPatientsByHospital(user.hospitalId);
        }

        console.warn("User role lacks access to hospital data:", user.role);
        return [];
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching patients by role:", error);
        return [];
    }
}

// Fetch patients for the last 14 days
export async function fetchPatientsForLast14Days() {
    try {
        const response = await fetch(`${process.env.API_URL}/appointments/lastfortnight`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch patients for the last 14 days");
        }

        const appointments: Appointment[] = await response.json();

        const patientsMap: { [key: number]: boolean } = {};
        const uniquePatients = appointments
            .map((appointment) => appointment.patient)
            .filter((patient) => {
                if (!patientsMap[patient.patientId]) {
                    patientsMap[patient.patientId] = true;
                    return true;
                }
                return false;
            });

        return uniquePatients;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching patients for the last 14 days:", error);
        return [];
    }
}

// Fetch doctors by hospital
export async function fetchDoctorsByHospital(hospitalId: number) {
    try {
        const response = await fetch(`${process.env.API_URL}/doctors/byHospital/${hospitalId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to fetch doctors:", error);
        return [];
    }
}

// Fetch inward referrals
export async function fetchAllReferrals() {
    try {
        const response = await fetch(`${process.env.API_URL}/referrals`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to fetch referrals:", error);
        return [];
    }
}

// Fetch departments
export async function fetchDepartments(hospitalId?: number): Promise<any[]> {
    try {
        const endpoint = hospitalId
            ? `${process.env.API_URL}/departments/byHospital/${hospitalId}`
            : `${process.env.API_URL}/departments`;

        const response = await fetch(endpoint, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch departments: ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new TypeError("Expected an array of departments");
        }

        return data;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching departments:", error);
        return [];
    }
}
