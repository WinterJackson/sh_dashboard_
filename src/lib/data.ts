// src/lib/data.ts

// Fetch available doctors
export async function fetchOnlineDoctors() {
    try {
        const response = await fetch("/api/doctors?status=Online");
        const data = await response.json();

        return data;

    } catch (error) {
        console.error("Failed to fetch doctors:", error);
        return [];
    }
}

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
        const response = await fetch(`/api/patients/${name}`);
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
        const availableBeds = data.filter((bed: any) => bed.availability === "Available");
        return availableBeds;
    } catch (error) {
        console.error("Failed to fetch beds:", error);
        return [];
    }
}


// Fetch today's appointments count
export async function fetchTodayAppointments() {
    try {
        const response = await fetch("/api/appointments/today");
        const data = await response.json();
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