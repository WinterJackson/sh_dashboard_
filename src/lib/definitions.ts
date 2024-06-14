// src/lib/definitions.ts file

// Types for each data model

export interface User {
    userId: string;
    username?: string;
    email: string;
    password: string;
    roleId: number;
    hospitalId: number;
    isActive?: boolean;
    lastLogin?: Date;
    profile?: Profile;
    doctor?: Doctor;
}

export interface Role {
    roleId: number;
    roleName: string;
    description: string;
}

export interface Profile {
    profileId: string;
    userId: string;
    firstName: string;
    lastName: string;
    gender?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: Date;
    imageUrl?: string;
    nextOfKin?: string;
    nextOfKinPhoneNo?: string;
    emergencyContact?: string;
    user: User;
}

export interface Doctor {
    doctorId: number;
    userId: string;
    email: string;
    hospitalId: number;
    departmentId: number;
    serviceId?: number | null;
    name: string;
    specialization: string;
    status: string;
    contactInformation: string;
    workingHours: string;
    averageRating: number;
    appointments: Appointment[];
    referrals: DoctorReferral[];
    docEarnings: DoctorEarning[];
    department: Department;
    user: User;
    hospital: Hospital;
    service?: Service;
}

export interface Patient {
    patientId: number;
    hospitalId: number;
    name: string;
    phoneNo: string;
    email: string;
    age: number;
    gender: string;
    appointmentReason: string;
    admissionDate?: Date;
    dischargeDate?: Date;
    status: string;
    appointments: Appointment[];
    serviceUsages: ServiceUsage[];
    payments: Payment[];
    referrals: Referral[];
    appointmentServices: AppointmentService[];
    hospital: Hospital;
    currentBed?: Bed;
}

export interface Appointment {
    appointmentId: string;
    doctorId: number;
    patientId: number;
    hospitalId: number;
    availabilitySlotId?: string;
    appointmentDate: Date;
    status?: string;
    consultationFee?: number;
    isPaid: boolean;
    paymentId?: string;
    completed: boolean;
    isVideoStarted: boolean;
    commissionPercentage?: number;
    appointmentEndedAt?: Date;
    appointmentReminderSent?: number;
    appointmentReminderSentLTF?: Date;
    doctorAppointmentNotes?: string;
    patientAppointmentNotes?: string;
    reasonForVisit?: string;
    createdAt: Date;
    updatedAt: Date;
    services: AppointmentService[];
    payments: Payment[];
    patient: Patient;
    doctor: Doctor;
    hospital: Hospital;
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
    hospitalId: number;
    serviceName: string;
    doctors: Doctor[];
    appointments: AppointmentService[];
    serviceUsages: ServiceUsage[];
    payments: Payment[];
    departments: DepartmentService[];
    hospital: Hospital;
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
    logoUrl?: string;
    users: User[];
    doctors: Doctor[];
    patients: Patient[];
    appointments: Appointment[];
    beds: Bed[];
    services: Service[];
    payments: Payment[];
    departments: HospitalDepartment[];
    referrals: Referral[];
}

export interface Department {
    departmentId: number;
    name: string;
    description: string;
    services: DepartmentService[];
    hospitals: HospitalDepartment[];
    doctors: Doctor[];
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
    date: Date;
    type: string; // e.g., Internal, External
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
    hospital: Hospital;
    service: Service;
    patient: Patient;
    appointment: Appointment;
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
    sessionId: string;
    sessionToken: string;
    userId: string;
    expires: Date;
    user: User;
}

export interface VerificationToken {
    tokenId: number;
    identifier: string;
    token: string;
    expires: Date;
}
