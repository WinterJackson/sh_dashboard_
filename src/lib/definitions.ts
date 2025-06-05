// src/lib/definitions.ts

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    DOCTOR = "DOCTOR",
    NURSE = "NURSE",
    STAFF = "STAFF",
    PATIENT = "PATIENT",
}

export enum ServiceType {
    MEDICAL = "MEDICAL",
    NON_MEDICAL = "NON_MEDICAL",
}

export enum NotificationType {
    APPOINTMENT = "APPOINTMENT",
    SECURITY = "SECURITY",
    SYSTEM = "SYSTEM",
    GENERAL = "GENERAL",
}

export enum MessageType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    FILE = "FILE",
}

export enum ConversationStatus {
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED",
    DELETED = "DELETED",
}

export enum HospitalOwnershipType {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    MISSION = "MISSION",
    NGO = "NGO",
    MILITARY = "MILITARY",
}

export enum KEPHLevel {
    LEVEL_1 = "LEVEL_1",
    LEVEL_2 = "LEVEL_2",
    LEVEL_3 = "LEVEL_3",
    LEVEL_4 = "LEVEL_4",
    LEVEL_5 = "LEVEL_5",
}

export enum DepartmentType {
    CLINICAL = "CLINICAL",
    SUPPORT = "SUPPORT",
    ADMINISTRATIVE = "ADMINISTRATIVE",
}

export enum ReferralType {
    UPWARD = "UPWARD",
    DOWNWARD = "DOWNWARD",
    LATERAL = "LATERAL",
    EMERGENCY = "EMERGENCY",
}

export enum ReferralStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
}

export enum ReferralPriority {
    IMMEDIATE = "IMMEDIATE",
    URGENT = "URGENT",
    ROUTINE = "ROUTINE",
    SCHEDULED = "SCHEDULED",
}

export enum ReferralDoctorRole {
    SENDER = "SENDER",
    RECEIVER = "RECEIVER",
}

export enum BedType {
    ICU = "ICU",
    GENERAL = "GENERAL",
    MATERNITY = "MATERNITY",
    ISOLATION = "ISOLATION",
    HDU = "HDU",
}

export enum AppointmentStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    RESCHEDULED = "RESCHEDULED"
}

export enum BedAvailability {
    OCCUPIED = "OCCUPIED",
    AVAILABLE = "AVAILABLE",
}

export enum AuditAction {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    ACCESS = "ACCESS",
    MFA_ENABLED = "MFA_ENABLED",
    MFA_VERIFIED = "MFA_VERIFIED",
    RESET_PASSWORD = "RESET_PASSWORD",
    ONBOARDED = "ONBOARDED",
}

export interface User {
    userId: string;
    username: string;
    email: string;
    password: string;
    role: Role;
    hospitalId?: number | null;
    isActive?: boolean;
    lastLogin?: Date | null;
    resetToken?: string | null;
    mustResetPassword?: boolean;
    resetTokenExpiry?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    twoFactorEnabled?: boolean;
    autoLogoutTimeout?: number;
    hasCompletedOnboarding: boolean;
    doctor?: Doctor;
    profile?: Profile;
    sessions?: Session[];
    hospital?: Hospital | null;
    superAdmin?: SuperAdmin;
    admin?: Admin;
    nurse?: Nurse;
    staff?: Staff;
    patient?: Patient;
    notifications?: Notification[];
    notificationSettings?: NotificationSettings;
    conversationParticipant?: ConversationParticipant[];
    messages?: Message[];
    notes?: AppointmentNote[];
    uploadedDocuments?: ReferralDocument[];
    auditLog?: AuditLog[];
}

export interface Notification {
    notificationId: string;
    userId: string;
    type: NotificationType;
    message: string;
    isRead: boolean;
    metadata?: Record<string, any>; // Optional additional data
    actionUrl?: string | null;

    createdAt: Date;
    updatedAt: Date;
    user: User;
}

export interface NotificationSettings {
    notificationSettingsId: string;
    userId: string;
    appointmentAlerts: boolean;
    emailAlerts: boolean;
    securityAlerts: boolean;
    systemUpdates: boolean;
    newDeviceLogin: boolean;
    user: User;
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
    cityOrTown?: string;
    county?: string;
    imageUrl?: string;
    nextOfKin?: string;
    nextOfKinPhoneNo?: string;
    emergencyContact?: string;
    user: User;
}

export interface SuperAdmin {
    superAdminId: number;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}

export interface Admin {
    adminId: number;
    userId: string;
    hospitalId: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    hospital: Hospital;
}

export interface Doctor {
    doctorId: number;
    userId: string;
    hospitalId: number;
    departmentId: number;
    specializationId: number;
    qualifications?: string | null;
    status: string;
    phoneNo: string;
    workingHours: string;
    averageRating: number;
    createdAt: Date;
    updatedAt: Date;
    skills?: string | null;
    bio?: string | null;
    yearsOfExperience?: number | null;
    appointments: Appointment[];
    specialization: Specialization;
    department: Department;
    hospital: Hospital;
    user: User;
    docEarnings: DoctorEarning[];
    referralsMade: Referral[];
    doctorReferrals: ReferralDoctor[];
    docReviews: DoctorReview[];
    docLicenses: DoctorLicense[];
}

export interface DoctorLicense {
    licenseId: string;
    doctorId: number;
    name: string;
    licenseNumber: string;
    issueDate: Date;
    expiryDate: Date;
    issuingAuthority: string;
    doctor: Doctor;
}

export interface DoctorReview {
    reviewId: string;
    doctorId: number;
    patientId: number;
    rating: number;
    comment?: string | null;
    createdAt: Date;
    doctor: Doctor;
    patient: Patient;
}

export interface Nurse {
    nurseId: number;
    userId: string;
    hospitalId: number;
    departmentId: number;
    specializationId: number;
    status: string;
    phoneNo: string;
    workingHours: string;
    averageRating: number;
    skills?: string | null;
    bio?: string | null;
    yearsOfExperience?: number | null;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    hospital: Hospital;
    department: Department;
    specialization: Specialization;
}

export interface Staff {
    staffId: number;
    userId: string;
    hospitalId: number;
    departmentId: number;
    specializationId: number;
    status: string;
    phoneNo: string;
    workingHours: string;
    averageRating: number;
    skills?: string | null;
    bio?: string | null;
    yearsOfExperience?: number | null;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    hospital: Hospital;
    department: Department;
    specialization: Specialization;
}

export interface Patient {
    patientId: number;
    userId: string;
    hospitalId: number;
    maritalStatus?: string | null;
    occupation?: string | null;
    nextOfKinName?: string | null;
    nextOfKinRelationship?: string | null;
    nextOfKinHomeAddress?: string | null;
    nextOfKinPhoneNo?: string | null;
    nextOfKinEmail?: string | null;
    reasonForConsultation: string;
    admissionDate?: Date | null;
    dischargeDate?: Date | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    medicalInformation: MedicalInformation[];
    appointments: Appointment[];
    appointmentServices: AppointmentService[];
    currentBed: Bed[];
    hospital: Hospital;
    payments: Payment[];
    referrals: Referral[];
    serviceUsages: ServiceUsage[];
    docReviews: DoctorReview[];
    referralDoctors: ReferralDoctor[];
    user: User;
}

export interface Conversation {
    conversationId: string;
    appointmentId: string;
    hospitalId: number;
    subject?: string | null;
    status: ConversationStatus;
    lastMessageAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    participants: ConversationParticipant[];
    messages: Message[];
    appointment?: Appointment | null;
    hospital?: Hospital | null;
}

export interface ConversationParticipant {
    conversationId: string;
    hospitalId: number;
    appointmentId: string;
    userId: string;
    joinedAt: Date;
    participantRole?: Role | null;
    conversation: Conversation;
    user: User;
}

export interface Message {
    messageId: string;
    conversationId: string;
    hospitalId: number;
    appointmentId: string;
    senderId: string;
    content: string;
    messageType: MessageType;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
    conversation: Conversation;
    sender: User;
}

export interface MedicalInformation {
    infoId: string;
    patientId: number;
    height?: number;
    weight?: number;
    bloodGroup?: string;
    allergies?: string;
    bmi?: number;
    bodyType?: string;
    alcohol?: boolean;
    drugs?: boolean;
    createdAt: Date;
    updatedAt: Date;
    patient: Patient;
}

export interface Appointment {
    appointmentId: string;
    doctorId: number;
    patientId: number;
    hospitalId: number;
    appointmentDate: Date;
    type: string;
    action?: string | null;
    status?: AppointmentStatus | null;
    consultationFee?: number | null;
    treatment?: string | null;
    isPaid: boolean;
    paymentId?: string | null;
    completed: boolean;
    isVideoStarted: boolean;
    commissionPercentage?: number | null;
    appointmentEndAt?: Date | null;
    rescheduledDate?: Date | null;
    cancellationReason?: string | null;
    pendingReason?: string | null;
    diagnosis?: string | null;
    prescription?: string | null;
    appointmentReminderSent?: number | null;
    appointmentReminderSentLTF?: Date | null;
    reasonForVisit?: string | null;
    createdAt: Date;
    updatedAt: Date;
    conversation?: Conversation | null;
    doctor: Doctor;
    hospital: Hospital;
    patient: Patient;
    services: AppointmentService[];
    payments: Payment[];
    notes: AppointmentNote[];
}

export interface AppointmentNote {
    appointmentNoteId: string;
    appointmentId: string;
    authorId: string;
    authorRole: Role;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    appointment: Appointment;
    author: User;
}

export interface DoctorEarning {
    earningsId: string;
    doctorId: number;
    date: Date;
    amount: number;
    description: string;
    doctor: Doctor;
}

export interface BedCapacity {
    bedCapacityId: string;
    hospitalId: number;
    totalInpatientBeds: number;
    generalInpatientBeds: number;
    cots: number;
    maternityBeds: number;
    emergencyCasualtyBeds: number;
    intensiveCareUnitBeds: number;
    highDependencyUnitBeds: number;
    isolationBeds: number;
    generalSurgicalTheatres?: number | null;
    maternitySurgicalTheatres?: number | null;
    createdAt: Date;
    updatedAt: Date;
    hospital: Hospital;
}

export interface Bed {
    bedId: number;
    hospitalId: number;
    patientId?: number;
    type: string;
    ward: string;
    availability: BedAvailability;
    createdAt: Date;
    updatedAt: Date;
    hospital: Hospital;
    patient?: Patient;
}

export interface Hospital {
    hospitalId: number;
    hospitalName: string;
    hospitalLink?: string | null;
    phone?: string | null;
    email?: string | null;
    kephLevel?: KEPHLevel | null;
    regulatoryBody?: string | null;
    ownershipType?: HospitalOwnershipType | null;
    facilityType?: string | null;
    nhifAccreditation?: string | null;
    open24Hours?: string | null;
    openWeekends?: string | null;
    regulated?: string | null;
    regulationStatus?: string | null;
    regulatingBody?: string | null;
    registrationNumber?: string | null;
    licenseNumber?: string | null;
    category?: string | null;
    owner?: string | null;
    county: string;
    subCounty?: string | null;
    ward?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    town?: string | null;
    streetAddress?: string | null;
    referralCode?: string | null;
    description?: string | null;
    emergencyPhone?: string | null;
    emergencyEmail?: string | null;
    website?: string | null;
    logoUrl?: string | null;
    operatingHours?: string | null;
    nearestLandmark?: string | null;
    plotNumber?: string | null;
    createdAt: Date;
    updatedAt: Date;
    appointments: Appointment[];
    beds: Bed[];
    doctors: Doctor[];
    nurses: Nurse[];
    departments: HospitalDepartment[];
    patients: Patient[];
    payments: Payment[];
    users: User[];
    admins: Admin[];
    staffs: Staff[];
    conversations: Conversation[];
    bedCapacity: BedCapacity[];
    hospitalServices: HospitalService[];
    appointmentServices: AppointmentService[];
    receivedReferrals: Referral[];
    sentReferrals: Referral[];
}

export interface Specialization {
    specializationId: number;
    name: string;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
    doctors: Doctor[];
    nurses: Nurse[];
    staff: Staff[];
    departmentLinks: DepartmentSpecialization[];
}

export interface Department {
    departmentId: number;
    name: string;
    description?: string | null;
    type: DepartmentType;
    createdAt: Date;
    updatedAt: Date;
    hospitalServices: HospitalService[];
    doctors: Doctor[];
    nurses: Nurse[];
    staff: Staff[];
    hospitals: HospitalDepartment[];
    appointmentServices: AppointmentService[];
    specializationLinks: DepartmentSpecialization[];
    services: DepartmentService [];
}

export interface DepartmentSpecialization {
    departmentId: number;
    specializationId: number;
    createdAt: Date;
    updatedAt: Date;
    department: Department;
    specialization: Specialization;
}

export interface HospitalDepartment {
    hospitalId: number;
    departmentId: number;
    headOfDepartment?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    location?: string | null;
    establishedYear?: number | null;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
    hospital: Hospital;
    department: Department;
}

export interface Service {
    serviceId: number;
    serviceName: string;
    type: ServiceType;
    createdAt: Date;
    updatedAt: Date;
    appointments: AppointmentService[];
    payments: Payment[];
    serviceUsages: ServiceUsage[];
    hospitals: HospitalService[];
    departments: DepartmentService[];
}

export interface DepartmentService {
    departmentId: number;
    serviceId: number;
    createdAt: Date;
    updatedAt: Date;
    department: Department;
    service: Service;
}

export interface HospitalService {
    hospitalId: number;
    departmentId: number;
    serviceId: number;
    maxAppointmentsPerDay?: number | null;
    requiresReferral: boolean;
    isWalkInAllowed: boolean;
    basePrice?: number | null;
    discount?: number | null;
    equipmentRequired?: string | null;
    minStaffRequired?: number | null;
    duration?: number | null;
    createdAt: Date;
    updatedAt: Date;
    hospital: Hospital;
    service: Service;
    department: Department;
}

export interface AppointmentService {
    appointmentId: string;
    hospitalId: number;
    patientId: number;
    departmentId?: number | null;
    serviceId: number;
    createdAt: Date;
    updatedAt: Date;
    appointment: Appointment;
    patient: Patient;
    service?: Service | null;
    department?: Department | null;
    hospital: Hospital;
}
export interface ServiceUsage {
    usageId: string;
    hospitalId: number;
    departmentId?: number | null;
    appointmentId: string;
    serviceId: number;
    patientId: number;
    createdAt: Date;
    updatedAt: Date;
    patient: Patient;
    service: Service;
}

export interface Payment {
    paymentId: string;
    hospitalId: number;
    appointmentId: string;
    patientId: number;
    serviceId: number;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    appointment: Appointment;
    hospital: Hospital;
    patient: Patient;
    service: Service;
}

export interface Referral {
    referralId: number;
    patientId: number;
    originHospitalId: number;
    destinationHospitalId: number;
    referringDoctorId: number;
    previousReferralId?: number | null;
    type: ReferralType;
    status: ReferralStatus;
    priority: ReferralPriority;
    effectiveDate: Date;
    urgency?: string | null;
    isTransportRequired: boolean;
    diagnosis?: string | null;
    outcomeStatus?: string | null;
    outcomeNotes?: string | null;
    closedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    patient: Patient;
    originHospital: Hospital;
    destinationHospital: Hospital;
    referringDoctor: Doctor;
    previousReferral?: Referral | null;
    nextReferrals: Referral[];
    documents: ReferralDocument[];
    doctors: ReferralDoctor[];
    transportation: Transportation[];
}

export interface ReferralDocument {
    referralDocId: string;
    referralId: number;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileData: Buffer;
    uploadedAt: Date;
    uploadedBy: string;
    isEncrypted: boolean;
    initializationVector?: string | null;
    accessLog?: Record<string, any> | null;
    referral: Referral;
    uploader: User;
}

export interface ReferralDoctor {
    doctorId: number;
    referralId: number;
    patientId: number;
    previousReferralId?: number | null;
    referralRole: ReferralDoctorRole;
    doctor: Doctor;
    referral: Referral;
    patient: Patient;
}

export interface Transportation {
    transportationId: string;
    referralId?: number | null;
    patientId?: number | null;
    ambulanceRegNo?: string | null;
    driverName?: string | null;
    driverContact?: string | null;
    emergencyCallerPhoneNo?: string | null;
    pickupLocation: string;
    dropoffLocation?: string | null;
    pickupTime?: Date | null;
    dropoffTime?: Date | null;
    cost?: number | null;
    status: string;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
    referral?: Referral | null;
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

export interface PasswordHistory {
    id: string;
    userId: string;
    password: string;
    createdAt: Date;
}

export interface VerificationToken {
    tokenId: number;
    identifier: string;
    token: string;
    expires: Date;
}

export interface AuditLog {
    id: string;
    action: AuditAction;
    userId?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    resourceType?: string | null;
    resourceId?: string | null;
    meta?: Record<string, any> | null;
    status?: string | null;
    createdAt: Date;
    updatedAt: Date;
    user?: User | null;
}

export interface RoleConstraints {
    constraintId: number;
    role: Role;
    count: number;
}

export interface UserSettingsData {
    profile: Partial<Profile> & {
        username?: string;
        email?: string;
    };
    roleSpecific: {
        doctor: Partial<Doctor>;
        nurse: Partial<Nurse>;
        staff: Partial<Staff>;
    };
    role: User["role"];
    notificationSettings: NotificationSettings;
    securitySettings: Pick<User, "twoFactorEnabled" | "autoLogoutTimeout">;
    username: User["username"];
    email: User["email"];
}