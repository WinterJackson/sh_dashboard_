import { sql } from "@vercel/postgres";
// import { formatCurrency } from "./utils";
import {
    Doctor,
    Bed,
    Appointment,
    Patient,
    Referral,
    Service,
    Hospital,
} from "./definitions";

// Fetch available doctors
export async function fetchAvailableDoctors() {
    try {
        const data =
            await sql<Doctor>`SELECT * FROM doctors WHERE status = 'Online'`;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch available doctors.");
    }
}

// Fetch available beds
export async function fetchAvailableBeds() {
    try {
        const data =
            await sql<Bed>`SELECT * FROM beds WHERE availability = 'Available'`;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch available beds.");
    }
}

// Fetch appointments today
export async function fetchAppointmentsToday() {
    try {
        const today = new Date().toISOString().split("T")[0];
        const data = await sql<Appointment>`
        SELECT * FROM appointments WHERE DATE(created_at) = ${today} OR DATE(updated_at) = ${today}
      `;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch appointments today.");
    }
}

// Fetch patients today
export async function fetchPatientsToday() {
    try {
        const today = new Date().toISOString().split("T")[0];
        const data = await sql<Patient>`
        SELECT * FROM patients WHERE DATE(created_at) = ${today} OR DATE(updated_at) = ${today}
      `;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch patients today.");
    }
}

// Fetch outward referrals
export async function fetchOutwardReferrals() {
    try {
        const data =
            await sql<Referral>`SELECT * FROM referrals WHERE type = 'External'`;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch outward referrals.");
    }
}

// Fetch inward referrals
export async function fetchInwardReferrals() {
    try {
        const data =
            await sql<Referral>`SELECT * FROM referrals WHERE type = 'Internal'`;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch inward referrals.");
    }
}

// Fetch total number of patients (monthly data)
export async function fetchTotalNumberOfPatients(month: string) {
    try {
        const data = await sql`
        SELECT COUNT(*) AS count FROM patients 
        WHERE DATE_TRUNC('month', created_at) = ${month}
      `;
        return Number(data.rows[0].count ?? "0");
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch total number of patients.");
    }
}

// Fetch hospital services distribution
export async function fetchHospitalServices() {
    try {
        const data = await sql<Service & Hospital>`
        SELECT services.*, hospitals.name AS hospital_name 
        FROM services
        JOIN hospitals ON services.hospital_id = hospitals.hospital_id
      `;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch hospital services.");
    }
}

// Fetch appointments details
export async function fetchAppointmentsDetails() {
    try {
        const data = await sql<Appointment>`
        SELECT appointments.*, patients.name AS patient_name, doctors.name AS doctor_name 
        FROM appointments 
        JOIN patients ON appointments.patient_id = patients.patient_id 
        JOIN doctors ON appointments.doctor_id = doctors.doctor_id
      `;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch appointments details.");
    }
}

// Fetch top doctors
export async function fetchTopDoctors() {
    try {
        const data = await sql<Doctor>`
        SELECT * FROM doctors ORDER BY average_rating DESC LIMIT 5
      `;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch top doctors.");
    }
}

// Fetch approved appointments
export async function fetchApprovedAppointments() {
    try {
        const data = await sql<Appointment>`
        SELECT * FROM appointments WHERE status IN ('Confirmed', 'Completed')
      `;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch approved appointments.");
    }
}

// Fetch other appointments
export async function fetchOtherAppointments() {
    try {
        const data = await sql<Appointment>`
        SELECT * FROM appointments WHERE status NOT IN ('Confirmed', 'Completed')
      `;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch other appointments.");
    }
}

// Fetch list of doctors
export async function fetchDoctorsList() {
    try {
        const data = await sql<Doctor>`SELECT * FROM doctors ORDER BY name ASC`;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch doctors list.");
    }
}
