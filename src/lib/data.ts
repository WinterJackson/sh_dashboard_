// src/lib/data.ts

import { Appointment, Role, Doctor, Patient } from "./definitions";

// Fetch available doctors
export async function fetchOnlineDoctors() {
    try {
        const response = await fetch(`${process.env.API_URL}/doctors`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        // Filter the data for online doctors only
        const onlineDoctors = data.filter(
            (doctor: { status: string }) => doctor.status === "Online"
        );

        console.log(onlineDoctors);

        return onlineDoctors;
    } catch (error) {
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
        const doctor = await response.json();

        return doctor;
    } catch (error) {
        console.error("Failed to fetch doctor details:", error);
        return [];
    }
}

// Fetch doctor by userId
export const fetchDoctorIdByUserId = async (userId: string) => {
    if (!userId) {
        console.error("No userId provided to fetchDoctorIdByUserId");
        return null;
    }

    try {
        const response = await fetch(`${process.env.API_URL}/doctors/byUserId/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch doctor data");
        }

        const doctor = await response.json();
        console.log("Doctor data received:", doctor);

        return doctor.doctorId;
    } catch (error) {
        console.error("Error fetching doctor data:", error);
        return null;
    }
}

// Fetch all doctors
export async function fetchAllDoctors() {
    try {
        const response = await fetch(`${process.env.API_URL}/doctors`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
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
        const response = await fetch(`${process.env.API_URL}/hospitals`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
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
        const response = await fetch(`${process.env.API_URL}/patients/byName/${name}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Patient not found");
        }
        const data = await response.json();

        console.log(data);

        return data;
    } catch (error) {
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
        const data = await response.json();

        const availableBeds = data.filter(
            (bed: any) => bed.availability === "Occupied"
        );

        console.log(availableBeds);
        return availableBeds;
    } catch (error) {
        console.error("Failed to fetch beds:", error);
        return [];
    }
}

// Fetch appointments
export async function fetchAppointments(
    page: number = 1,
    limit: number = 15
): Promise<Appointment[]> {
    try {
        const response = await fetch(`${process.env.API_URL}/appointments?page=${page}&limit=${limit}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data.appointments;
    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw error;
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
        console.error("Failed to fetch appointments by hospital:", error);
        return [];
    }
}

// Update appointment status
export async function updateAppointmentStatus(
    appointmentId: string,
    updateData: { status: string; reason: string }
) {
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
        console.error("Error updating appointment:", error);
        throw error;
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
            },
        });

        const data = await response.json();

        return data.map((patient: any) => ({
            ...patient,
            appointments: patient.appointments || [],
        }));
    } catch (error) {
        console.error('Failed to fetch patients by hospital:', error);
        return [];
    }
}

// Fetch patients based on user role
export async function fetchPatientsByRole(user: any): Promise<Patient[]> {
    if (user.role === 'SUPER_ADMIN') {
        return await fetchAllPatients();
    } else if (['ADMIN', 'DOCTOR', 'NURSE', 'STAFF'].includes(user.role)) {
        if (user.hospitalId) {
            return await fetchPatientsByHospital(user.hospitalId);
        }
    }
    return [];
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
        console.error("Failed to fetch referrals:", error);
        return [];
    }
}

// Fetch departments
export async function fetchDepartments() {
    try {
        const response = await fetch(`${process.env.API_URL}/departments`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch departments");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
}
