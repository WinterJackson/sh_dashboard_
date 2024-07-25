// src/lib/admin-data.ts

// Fetch available doctors
export async function fetchOnlineDoctors(hospitalId: number) {
    try {
        const response = await fetch(`/api/doctors?status=Online&hospitalId=${hospitalId}`);
        const data = await response.json();

        return data;

    } catch (error) {
        console.error("Failed to fetch doctors:", error);
        return [];
    }
}

// Fetch all doctors
export async function fetchAllDoctors(hospitalId: number) {
    try {
        const response = await fetch(`/api/doctors?hospitalId=${hospitalId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch doctors:", error);
        return [];
    }
}

// Fetch available beds
export async function fetchAvailableBeds(hospitalId: number) {
    try {
        const response = await fetch(`/api/beds?hospitalId=${hospitalId}`);
        const data = await response.json();
        const availableBeds = data.filter((bed: any) => bed.availability === "Available");
        return availableBeds;
    } catch (error) {
        console.error("Failed to fetch beds:", error);
        return [];
    }
}

// Fetch today's appointments count
export async function fetchTodayAppointments(hospitalId: number) {
    try {
        const response = await fetch(`/api/appointments/today?hospitalId=${hospitalId}`);
        const data = await response.json();
        return data.count;
    } catch (error) {
        console.error("Failed to fetch today's appointments:", error);
        return 0;
    }
}

// Fetch appointments for the last 14 days
export async function fetchAppointmentsForLast14Days(hospitalId: number) {
    try {
        const response = await fetch(`/api/appointments/lastfortnight?hospitalId=${hospitalId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch appointments for the last 14 days:", error);
        return [];
    }
}

// Fetch today's patients count
export async function fetchPatientsToday(hospitalId: number) {
    try {
        const response = await fetch(`/api/patients/today?hospitalId=${hospitalId}`);
        const data = await response.json();
        return data.count;
    } catch (error) {
        console.error("Failed to fetch today's patients:", error);
        return 0;
    }
}

// Fetch patients for the last 14 days
export async function fetchPatientsForLast14Days(hospitalId: number) {
    try {
        const response = await fetch(`/api/patients/lastfortnight?hospitalId=${hospitalId}`);
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