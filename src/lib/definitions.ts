// src/lib/definitions.ts

export interface User {
    userId: string;
    username: string;
    email: string;
    password: string;
    role: Role;
    hospitalId?: number | null;
    isActive?: boolean;
    lastLogin?: Date | null;
    mustResetPassword?: boolean;
    resetToken?: string | null;
    resetTokenExpiry?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    doctor?: Doctor;
    profile?: Profile;
    sessions?: Session[];
    hospital?: Hospital | null;
    superAdmin?: SuperAdmin;
    admin?: Admin;
    nurse?: Nurse;
    staff?: Staff;
}

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    DOCTOR = "DOCTOR",
    NURSE = "NURSE",
    STAFF = "STAFF",
}

export interface Profile {
    profileId: string;
    userId: string;
    firstName: string;
    lastName: string;
    gender?: string;
    phoneNo?: string;
    address?: string;
    dateOfBirth?: Date | null;
    city?: string;
    state?: string;
    imageUrl?: string;
    nextOfKin?: string;
    nextOfKinPhoneNo?: string;
    emergencyContact?: string;
    user: User;
}

export interface SuperAdmin {
    superAdminId: number;
    userId: string;
    user: User;
}

export interface Admin {
    adminId: number;
    userId: string;
    hospitalId: number;
    user: User;
    hospital: Hospital;
}

export interface Specialization {
    specializationId: number;
    name: string;
    doctors: Doctor[];
    nurses: Nurse[];
    staff: Staff[];
}

export interface Doctor {
    doctorId: number;
    userId: string;
    hospitalId: number;
    departmentId: number;
    serviceId?: number | null;
    specializationId: number;
    qualifications?: string;
    about?: string;
    status: string;
    phoneNo: string;
    workingHours: string;
    averageRating: number;
    createdAt: Date;
    updatedAt: Date;
    skills: string[];
    bio?: string;
    yearsOfExperience?: number;
    appointments: Appointment[];
    specialization: Specialization;
    department: Department;
    hospital: Hospital;
    service?: Service | null;
    user: User;
    docEarnings?: DoctorEarning[];
    referrals?: DoctorReferral[];
    docLicenses: DoctorLicense[];
    docReviews: DoctorReview[];
}

export interface DoctorLicense {
    licenseId: string;
    name: string;
    licenseNumber: string;
    issueDate: Date;
    expiryDate: Date;
    issuingAuthority: string;
}

export interface DoctorReview {
    reviewId: string;
    doctorId: number;
    patientId: number;
    rating: number;
    comment?: string;
    createdAt: Date;
}

export interface Nurse {
    nurseId: number;
    userId: string;
    hospitalId: number;
    departmentId: number;
    specializationId: number;
    specialization: Specialization;
    status: string; // "Online" or "Offline"
    phoneNo: string;
    workingHours: string;
    averageRating: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    hospital: Hospital;
    department: Department;
}

export interface Staff {
    staffId: number;
    userId: string;
    hospitalId: number;
    departmentId: number;
    specializationId: number;
    specialization: Specialization;
    status: string; // "Online" or "Offline"
    phoneNo: string;
    workingHours: string;
    averageRating: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    hospital: Hospital;
    department: Department;
}

export interface Patient {
    patientId: number;
    hospitalId: number;
    name: string;
    phoneNo: string;
    email: string;
    dateOfBirth: Date;
    gender: string;
    homeAddress?: string;
    state?: string;
    reasonForConsultation: string;
    admissionDate?: Date;
    dischargeDate?: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    appointments: Appointment[];
    appointmentServices: AppointmentService[];
    currentBed?: Bed[];
    hospital: Hospital;
    payments?: Payment[];
    referrals: Referral[];
    serviceUsages?: ServiceUsage;
    docReviews: DoctorReview[];
}

export interface Appointment {
    appointmentId: string;
    doctorId: number;
    patientId: number;
    hospitalId: number;
    appointmentDate: Date;
    type: string;
    action?: string;
    status?: string;
    consultationFee?: number;
    isPaid: boolean;
    paymentId?: string;
    completed: boolean;
    isVideoStarted: boolean;
    commissionPercentage?: number;
    appointmentEndAt?: Date;
    rescheduledDate?: Date;
    cancellationReason?: string;
    pendingReason?: string;
    appointmentReminderSent?: number;
    appointmentReminderSentLTF?: Date;
    doctorAppointmentNotes?: string;
    patientAppointmentNotes?: string;
    reasonForVisit?: string;
    createdAt: Date;
    updatedAt: Date;
    doctor: Doctor;
    hospital: Hospital;
    patient: Patient;
    services: AppointmentService[];
    payments?: Payment[];
}

export interface DoctorEarning {
    earningsId: string;
    doctorId: number;
    date: Date;
    amount: number;
    description: string;
    doctor: Doctor;
}

export interface Bed {
    bedId: number;
    hospitalId: number;
    patientId?: number;
    type: string;
    ward: string;
    availability: string;
    hospital: Hospital;
    patient?: Patient;
}

export interface Service {
    serviceId: number;
    serviceName: string;
    appointments: AppointmentService[];
    departments: DepartmentService[];
    doctors: Doctor[];
    payments?: Payment[];
    serviceUsages?: ServiceUsage;
}

export interface Hospital {
    hospitalId: number;
    name: string;
    phone: string;
    email: string;
    country: string;
    city: string;
    referralCode?: string;
    website?: string;
    logoUrl: string;
    appointments: Appointment[];
    beds?: Bed[];
    doctors: Doctor[];
    nurses: Nurse[];
    departments: HospitalDepartment[];
    patients: Patient[];
    payments?: Payment[];
    referrals: Referral[];
    users: User[];
    admins: Admin[];
    staffs: Staff[];
}

export interface Department {
    hospitalDepartments: any;
    departmentId: number;
    name: string;
    description: string;
    services: DepartmentService[];
    doctors: Doctor[];
    nurses: Nurse[];
    staff: Staff[];
    hospitals: HospitalDepartment[];
}

export interface DepartmentService {
    departmentId: number;
    serviceId: number;
    price: number;
    department: Department;
    service: Service;
}

export interface HospitalDepartment {
    hospitalId: number;
    departmentId: number;
    hospital: Hospital;
    department: Department;
}

export interface ServiceUsage {
    usageId: string;
    serviceId: number;
    patientId: number;
    date: Date;
    service: Service;
    patient: Patient;
}

export interface Referral {
    referralId: number;
    patientId: number;
    hospitalId: number;
    effectiveDate: Date;
    type: string;
    primaryCareProvider: string;
    referralAddress: string;
    referralPhone: string;
    reasonForConsultation: string;
    diagnosis: string;
    physicianName: string;
    physicianDepartment: string;
    physicianSpecialty: string;
    physicianEmail: string;
    physicianPhoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
    doctors?: DoctorReferral[];
    hospital?: Hospital;
    patient: Patient;
}

export interface DoctorReferral {
    doctorId: number;
    referralId: number;
    patientId: number;
    doctor: Doctor;
    referral: Referral;
}

export interface Payment {
    paymentId: string;
    patientId: number;
    serviceId: number;
    hospitalId: number;
    appointmentId: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    appointment: Appointment;
    hospital: Hospital;
    patient: Patient;
    service: Service;
}

export interface AppointmentService {
    appointmentId: string;
    serviceId: number;
    patientId: number;
    appointment: Appointment;
    service: Service;
    patient: Patient;
}

export interface Session {
    sessionId?: string;
    sessionToken?: string;
    userId: string;
    expires: Date;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        username: string;
        role: Role;
        hospitalId: number | null;
        hospital: string | null;
    };
}

export interface VerificationToken {
    tokenId: number;
    identifier: string;
    token: string;
    expires: Date;
}

export interface RoleConstraints {
    constraintId: number;
    role: Role;
    count: number;
}
