// /**
//  * Centralized API utilities for managing doctors.
//  * Includes fetching data (specializations, departments, hospitals, services) and submitting doctor details.
//  */

// import { Role } from "@/lib/definitions";

// // Define the TypeScript interface for doctor data
// export interface DoctorData {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phoneNo: string;
//     dateOfBirth: string;
//     gender: "Male" | "Female" | "Other";
//     qualifications?: string;
//     about?: string;
//     specializationId: number;
//     departmentId: number;
//     hospitalId: number;
//     serviceId?: number; // Optional
//     status: "Online" | "Offline";
//     profileImageUrl?: string;
// }

// /**
//  * Fetches a list of specializations.
//  */
// export const fetchSpecializations = async (): Promise<any[]> => {
//     try {
//         const response = await fetch(`${process.env.API_URL}/specializations`);
//         if (!response.ok) {
//             throw new Error("Failed to fetch specializations");
//         }
//         return await response.json();
//     } catch (error) {
//         console.error("Error fetching specializations:", error);
//         return [];
//     }
// };

// /**
//  * Fetches a list of departments.
//  */
// export const fetchDepartments = async (): Promise<any[]> => {
//     try {
//         const response = await fetch(`${process.env.API_URL}/departments`);
//         if (!response.ok) {
//             throw new Error("Failed to fetch departments");
//         }
//         return await response.json();
//     } catch (error) {
//         console.error("Error fetching departments:", error);
//         return [];
//     }
// };

// /**
//  * Fetches a list of hospitals.
//  */
// export const fetchHospitals = async (): Promise<any[]> => {
//     try {
//         const response = await fetch(`${process.env.API_URL}/hospitals`);
//         if (!response.ok) {
//             throw new Error("Failed to fetch hospitals");
//         }
//         return await response.json();
//     } catch (error) {
//         console.error("Error fetching hospitals:", error);
//         return [];
//     }
// };

// /**
//  * Fetches a list of services.
//  */
// export const fetchServices = async (
//     userRole: Role,
//     userHospitalId: number | null,
//     selectedDepartmentId?: number
// ): Promise<any[]> => {
//     try {
//         const response = await fetch(`${process.env.API_URL}/services`);

//         if (!response.ok) {
//             throw new Error("Failed to fetch services");
//         }

//         const allServices = await response.json();

//         // Filter services based on user's role and hospital
//         const filteredServices = allServices.filter((service: any) => {
//             if (!service.departments) return false;

//             return service.departments.some((deptRel: any) => {
//                 const departmentMatches =
//                     selectedDepartmentId === undefined ||
//                     deptRel.departmentId === selectedDepartmentId;

//                 const hospitalMatches =
//                     userRole === Role.SUPER_ADMIN ||
//                     deptRel.department.hospitals.some(
//                         (hospitalRel: any) =>
//                             hospitalRel.hospitalId === userHospitalId
//                     );

//                 return departmentMatches && hospitalMatches;
//             });
//         });

//         return filteredServices;
//     } catch (error) {
//         console.error("Error fetching services:", error);
//         return [];
//     }
// };


// /**
//  * Adds a new doctor to the system.
//  */
// export const addDoctorAPI = async (doctorData: DoctorData): Promise<any> => {
//     try {
//         const response = await fetch(`${process.env.API_URL}/doctors`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(doctorData),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || "Failed to add doctor.");
//         }

//         return await response.json(); // Success response
//     } catch (error) {
//         console.error("Error adding doctor:", error);
//         throw error;
//     }
// };


