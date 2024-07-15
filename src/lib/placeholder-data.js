// src/lib/placeholder-data.js file

const roles = [
    {
        roleId: 1,
        roleName: "Admin",
        description: "Manages hospital operations",
    },
    {
        roleId: 2,
        roleName: "Doctor",
        description: "Provides medical care to patients",
    },
    {
        roleId: 3,
        roleName: "Staff",
        description: "Addresses patients",
    },
];

const hospitals = [
    {
        hospitalId: 1,
        name: "Nairobi City Hospital",
        phone: "+123456789",
        email: "info@nairobicityhospital.com",
        country: "Kenya",
        city: "Nairobi",
        referralCode: "NC123",
        website: "https://www.nairobicityhospital.com",
        logoUrl: "https://example.com/nairobi-city-hospital.png",
    },
    {
        hospitalId: 2,
        name: "Mombasa General Hospital",
        phone: "+987654321",
        email: "info@mombasageneralhospital.com",
        country: "Kenya",
        city: "Mombasa",
        referralCode: "MG456",
        website: "https://www.mombasageneralhospital.com",
        logoUrl: "https://example.com/mombasa-general-hospital.png",
    },
    {
        hospitalId: 3,
        name: "Abuja General Hospital",
        phone: "+763254321",
        email: "info@abujageneralhospital.com",
        country: "Nigeria",
        city: "Abuja",
        referralCode: "AG873",
        website: "https://www.abujageneralhospital.com",
        logoUrl: "https://example.com/abuja-general-hospital.png",
    },
];

const users = [
    {
        userId: "410544b2-4001-4271-9855-fec4b6a6442a",
        username: "Edwin",
        email: "edwin@snarkhealth.com",
        password: "adminpassword",
        roleId: 1, // Admin role
        hospitalId: 1, // Hospital 1
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-1234-5678-90ab-fec4b6a6442b",
        username: "John Smith",
        email: "js@snarkhealth.com",
        password: "docpassword",
        roleId: 2, // Doctor role
        hospitalId: 1, // Hospital 1
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-9856-5678-90ab-fec4b6a6442b",
        username: "staff1",
        email: "s1@snarkhealth.com",
        password: "staffpassword",
        roleId: 3, // Staff role
        hospitalId: 1, // Hospital 1
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "410544b2-8263-4271-9855-fec4b6a6442a",
        username: "Jack",
        email: "jack@snarkhealth.com",
        password: "adminpassword",
        roleId: 1, // Admin role
        hospitalId: 2, // Hospital 2
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-0921-5678-90ab-fec4b6a6442b",
        username: "Phil Foden",
        email: "foden@snarkhealth.com",
        password: "docpassword",
        roleId: 2, // Doctor role
        hospitalId: 2, // Hospital 2
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-0097-5678-90ab-fec4b6a6442b",
        username: "staff2",
        email: "s2@snarkhealth.com",
        password: "staffpassword",
        roleId: 3, // Staff role
        hospitalId: 2, // Hospital 2
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-8332-5678-90ab-fec4b6a6442b",
        username: "Mikel Arteta",
        email: "arteta@snarkhealth.com",
        password: "docpassword",
        roleId: 2, // Doctor role
        hospitalId: 1, // Hospital 2
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-7625-5678-90ab-fec4b6a6442b",
        username: "Xabi Alonso",
        email: "xabi@snarkhealth.com",
        password: "docpassword",
        roleId: 2, // Doctor role
        hospitalId: 2, // Hospital 2
        isActive: true,
        lastLogin: null,
    },
];

const departments = [
    {
        departmentId: 1,
        name: "Cardiology",
        description:
            "Department dealing with disorders of the heart and blood vessels.",
    },
    {
        departmentId: 2,
        name: "Neurology",
        description:
            "Department dealing with surgical treatment of disorders affecting any portion of the nervous system.",
    },
    {
        departmentId: 3,
        name: "Urology",
        description:
            "Focuses on surgical and medical diseases of the urinary system and the reproductive organs.",
    },
    {
        departmentId: 4,
        name: "Orthopedics",
        description:
            "Branch of surgery concerned with conditions involving the musculoskeletal system.",
    },
    {
        departmentId: 5,
        name: "General Services",
        description:
            "Holding the uncategorized services eg. blood and stool tests, consultations etc.",
    },
];

const services = [
    {
        serviceId: 1,
        hospitalId: 1, // Hospital 1
        serviceName: "X-ray",
    },
    {
        serviceId: 2,
        hospitalId: 1, // Hospital 1
        serviceName: "Blood Test",
    },
    {
        serviceId: 3,
        hospitalId: 2, // Hospital 2
        serviceName: "X-ray",
    },
    {
        serviceId: 4,
        hospitalId: 2, // Hospital 2
        serviceName: "Blood Test",
    },
    {
        serviceId: 5,
        hospitalId: 3, // Hospital 3
        serviceName: "X-ray",
    },
    {
        serviceId: 6,
        hospitalId: 3, // Hospital 3
        serviceName: "Blood Test",
    },
    {
        serviceId: 7,
        hospitalId: 1, // Hospital 1
        serviceName: "Urinalysis",
    },
    {
        serviceId: 8,
        hospitalId: 2, // Hospital 2
        serviceName: "Arthroscopy",
    },
    {
        serviceId: 9,
        hospitalId: 2, // Hospital 2
        serviceName: "Epilepsy treatment",
    },
    {
        serviceId: 10,
        hospitalId: 1, // Hospital 1
        serviceName: "Cardiac MRI",
    },
    {
        serviceId: 11,
        hospitalId: 1, // Hospital 1
        serviceName: "Consultation",
    },
    {
        serviceId: 12,
        hospitalId: 2, // Hospital 2
        serviceName: "Consultation",
    },
    {
        serviceId: 13,
        hospitalId: 3, // Hospital 3
        serviceName: "Consultation",
    },
];

const doctors = [
    {
        doctorId: 1,
        userId: "b78d23c4-1234-5678-90ab-fec4b6a6442b", // Reference user for login
        email: "jsmith@snarkhealth.com",
        hospitalId: 1, // Hospital 1
        departmentId: 1, // Cardiology
        serviceId: 10, // Cardiac MRI
        name: "Dr. John Smith",
        specialization: "Cardiologist",
        status: "Online",
        phoneNumber: "+1234566372",
        workingHours: "Mon-Fri: 9AM-5PM",
        averageRating: 4.6,
    },
    {
        doctorId: 2,
        userId: "b78d23c4-0921-5678-90ab-fec4b6a6442b", // Reference user for login
        email: "pfoden@snarkhealth.com",
        hospitalId: 2, // Hospital 2
        departmentId: 2, // Neurology
        serviceId: 9, // Epilepsy treatment
        name: "Dr. Phil Foden",
        specialization: "Neurosurgeon",
        status: "Online",
        phoneNumber: "+1244567890",
        workingHours: "Mon-Fri: 8AM-5PM",
        averageRating: 4.8,
    },
    {
        doctorId: 3,
        userId: "b78d23c4-8332-5678-90ab-fec4b6a6442b", // Reference user for login
        email: "arteta@snarkhealth.com",
        hospitalId: 1, // Hospital 1
        departmentId: 3, // Urology
        serviceId: 7, // Urinalysis
        name: "Dr. Mikel Arteta",
        specialization: "Urologist",
        status: "Online",
        phoneNumber: "+1244635424",
        workingHours: "Mon-Fri: 8AM-4PM",
        averageRating: 4.5,
    },
    {
        doctorId: 4,
        userId: "b78d23c4-7625-5678-90ab-fec4b6a6442b", // Reference user for login
        email: "xabi@snarkhealth.com",
        hospitalId: 2, // Hospital 2
        departmentId: 4, // Orthopedics
        serviceId: 8, // Arthroscopy
        name: "Dr. Xabi Alonso",
        specialization: "Orthopedist",
        status: "Online",
        phoneNumber: "+1244487632",
        workingHours: "Mon-Fri: 8AM-2PM",
        averageRating: 4.1,
    },
];

const patients = [
    {
        patientId: 12875,
        hospitalId: 1, // Hospital 1
        name: "Thomas Patey",
        phoneNo: "+9876233210",
        email: "thomas.patey@example.com",
        dateOfBirth: new Date("1988-01-22T00:00:00"),
        gender: "Male",
        reasonForConsultation: "Head injury",
        admissionDate: null,
        dischargeDate: null,
        status: "Inpatient",
    },
    {
        patientId: 12982,
        hospitalId: 1, // Hospital 1
        name: "Alice Johnson",
        phoneNo: "+9876547610",
        email: "alice.johnson@example.com",
        dateOfBirth: new Date("1994-05-14T00:00:00"),
        gender: "Female",
        reasonForConsultation: "Migraine",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 12332,
        hospitalId: 2, // Hospital 2
        name: "Kyle Walker",
        phoneNo: "+9876549210",
        email: "kyle.walker@example.com",
        dateOfBirth: new Date("1991-10-06T00:00:00"),
        gender: "Male",
        reasonForConsultation: "Chest pain",
        admissionDate: null,
        dischargeDate: null,
        status: "Inpatient",
    },
    {
        patientId: 12329,
        hospitalId: 2, // Hospital 2
        name: "Alicia Keys",
        phoneNo: "+9876592210",
        email: "alicia.keys@example.com",
        dateOfBirth: new Date("1993-07-23T00:00:00"),
        gender: "Female",
        reasonForConsultation: "Chest pain",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
];

const appointments = [
    {
        appointmentId: "f432a1c7-2345-6789-0abc-defgjdhdlmnop",
        doctorId: 1, // Dr. John Smith
        patientId: 12875, // Thomas Patey
        hospitalId: 1, // Hospital 1
        appointmentDate: new Date("2024-05-22T10:00:00"), // Replace with desired date
        type: "Virtual",
        status: "Completed", // (Pending, Confirmed, Completed, Cancelled)
        consultationFee: 100.00,
        isPaid: true,
        paymentId: "123e4567-e89b-12d3-a456-426614174021", //Reference to payment record
        completed: true,
        isVideoStarted: true,
        commissionPercentage: 5, // Optional: Commission for doctor (percentage)
        appointmentEndAt: new Date("2024-05-22T10:30:00"), // Optional: Appointment end time
        appointmentReminderSent: 0, // Number of reminders sent
        appointmentReminderSentLTF: null, // Optional: Last time reminder was sent
        doctorAppointmentNotes: "Referred to Dr. Phil Foden", // Doctor's notes for the appointment
        patientAppointmentNotes: "", // Patient's notes for the appointment
        reasonForVisit: "Follow-up for previous surgery",
    },
    {
        appointmentId: "f432a1c7-2345-6789-0abc-defghijklkngs",
        doctorId: 2, // Dr. Phil Foden
        patientId: 12875, // Thomas Patey
        hospitalId: 2, // Hospital 2
        appointmentDate: new Date("2024-05-23T10:00:00"), // Replace with desired date
        type: "Walk In",
        status: "Completed", // (Pending, Confirmed, Completed, Cancelled)
        consultationFee: 100.00,
        isPaid: true,
        paymentId: "123e4567-e89b-12d3-a456-426614174313", //Reference to payment record
        completed: true,
        isVideoStarted: true,
        commissionPercentage: 40, // Optional: Commission for doctor (percentage)
        appointmentEndAt: new Date("2024-05-23T10:30:00"), // Optional: Appointment end time
        appointmentReminderSent: 0, // Number of reminders sent
        appointmentReminderSentLTF: null, // Optional: Last time reminder was sent
        doctorAppointmentNotes: "Blood test", // Doctor's notes for the appointment
        patientAppointmentNotes: "Much appreciation", // Patient's notes for the appointment
        reasonForVisit:
            "Blood test follow-up (as recommended by Dr. John Smith)",
    },
    {
        appointmentId: "f432a1c7-2345-6789-0abc-dihjffijklmnop",
        doctorId: 2, // Dr. Phil Foden
        patientId: 12329, // Alicia Keys
        hospitalId: 2, // Hospital 2
        appointmentDate: new Date("2024-05-24T10:30:00"), // Replace with desired date
        type: "Walk In",
        status: "Cancelled", // (Pending, Confirmed, Completed, Cancelled)
        consultationFee: 100.00,
        isPaid: false,
        paymentId: null, //Reference to payment record
        completed: false,
        isVideoStarted: false,
        commissionPercentage: 40, // Optional: Commission for doctor (percentage)
        appointmentEndAt: null, // Optional: Appointment end time
        appointmentReminderSent: 0, // Number of reminders sent
        appointmentReminderSentLTF: null, // Optional: Last time reminder was sent
        doctorAppointmentNotes: "", // Doctor's notes for the appointment
        patientAppointmentNotes: "", // Patient's notes for the appointment
        reasonForVisit: "Check-up",
    },
    {
        appointmentId: "f432a1c7-2345-6789-0abc-defghijknbcvp",
        doctorId: 1, // Dr. John Smith
        patientId: 12982, // Alice Johnson
        hospitalId: 1, // Hospital 1
        appointmentDate: new Date("2024-05-24T12:30:00"), // Replace with desired date
        type: "Virtual",
        status: "Cancelled", // (Pending, Confirmed, Completed, Cancelled)
        consultationFee: 100.00,
        isPaid: false,
        paymentId: null, //Reference to payment record
        completed: false,
        isVideoStarted: false,
        commissionPercentage: 40, // Optional: Commission for doctor (percentage)
        appointmentEndAt: null, // Optional: Appointment end time
        appointmentReminderSent: 0, // Number of reminders sent
        appointmentReminderSentLTF: null, // Optional: Last time reminder was sent
        doctorAppointmentNotes: "", // Doctor's notes for the appointment
        patientAppointmentNotes: "", // Patient's notes for the appointment
        reasonForVisit: "Check-up",
    },
    {
        appointmentId: "f432a1c7-2345-6789-0abc-defghiksjnop",
        doctorId: 1, // Dr. John Smith
        patientId: 12982, // Alice Johnson
        hospitalId: 1, // Hospital 1
        appointmentDate: new Date("2024-05-25T10:00:00"), // Replace with desired date
        type: "Walk In",
        status: "Completed", // (Pending, Confirmed, Completed, Cancelled)
        consultationFee: 100.00,
        isPaid: true,
        paymentId: "123e4567-e89b-12d3-a456-426614174293", //Reference to payment record
        completed: true,
        isVideoStarted: true,
        commissionPercentage: 40, // Optional: Commission for doctor (percentage)
        appointmentEndAt: new Date("2024-05-25T10:25:00"), // Optional: Appointment end time
        appointmentReminderSent: 0, // Number of reminders sent
        appointmentReminderSentLTF: null, // Optional: Last time reminder was sent
        doctorAppointmentNotes: "Referred to Dr. Mikel Arteta", // Doctor's notes for the appointment
        patientAppointmentNotes: "", // Patient's notes for the appointment
        reasonForVisit: "Check-up as referred by Dr. John Smith",
    },
    {
        appointmentId: "f432a1c7-2345-6789-0abc-oeujhijklmnop",
        doctorId: 2, // Dr. Phil Foden
        patientId: 12332, // Kyle Walker
        hospitalId: 2, // Hospital 2
        appointmentDate: new Date("2024-05-27T10:00:00"), // Replace with desired date
        type: "Walk In",
        status: "Pending", // (Pending, Confirmed, Completed, Cancelled)
        consultationFee: 100.00,
        isPaid: true,
        paymentId: "123e4567-e89b-12d3-a456-426614174342", //Reference to payment record
        completed: false,
        isVideoStarted: false,
        commissionPercentage: 40, // Optional: Commission for doctor (percentage)
        appointmentEndAt: null, // Optional: Appointment end time
        appointmentReminderSent: 0, // Number of reminders sent
        appointmentReminderSentLTF: null, // Optional: Last time reminder was sent
        doctorAppointmentNotes: "", // Doctor's notes for the appointment
        patientAppointmentNotes: "", // Patient's notes for the appointment
        reasonForVisit: "Blood Test",
    },
];

const doctorEarnings = [
    {
        earningsId: "123e4567-89ab-cdef-0123-456789abcdef",
        doctorId: 1, // Dr. John Smith
        date: new Date("2024-05-22"), // Replace with desired date
        amount: 40.0,
        description: "Consultation fee for Thomas Patey",
    },
    {
        earningsId: "123e4567-06fh-cdef-0123-456789abcdef",
        doctorId: 1, // Dr. Phil Foden
        date: new Date("2024-05-23"), // Replace with desired date
        amount: 40.0,
        description: "Consultation fee for Thomas Patey",
    },
    {
        earningsId: "123e4567-763h-cdef-0123-456789abcdef",
        doctorId: 1, // Dr. John Smith
        date: new Date("2024-05-25"), // Replace with desired date
        amount: 40.0,
        description: "Consultation fee for Alice Johnson",
    },
    {
        earningsId: "123e4567-8uyd-cdef-0123-456789abcdef",
        doctorId: 2, // Dr. Phil Foden
        date: new Date("2024-05-27"), // Replace with desired date
        amount: 40.0,
        description: "Consultation fee for Kyle Walker",
    },
];

const beds = [
    {
        bedId: 1,
        hospitalId: 1, // Hospital 1
        patientId: 12875,
        type: "ICU",
        ward: "Ward A",
        availability: "Occupied",
    },
    {
        bedId: 2,
        hospitalId: 2, // Hospital 2
        patientId: 12332,
        type: "General",
        ward: "Ward B",
        availability: "Occupied",
    },
    {
        bedId: 3,
        hospitalId: 2, // Hospital 2
        patientId: null,
        type: "General",
        ward: "Ward B",
        availability: "Available",
    },
    {
        bedId: 4,
        hospitalId: 2, // Hospital 2
        patientId: null,
        type: "ICU",
        ward: "Ward C",
        availability: "Available",
    },
    {
        bedId: 5,
        hospitalId: 2, // Hospital 2
        patientId: null,
        type: "General",
        ward: "Ward D",
        availability: "Available",
    },
    {
        bedId: 6,
        hospitalId: 2, // Hospital 2
        patientId: null,
        type: "General",
        ward: "Ward A",
        availability: "Available",
    },
    {
        bedId: 7,
        hospitalId: 1, // Hospital 1
        patientId: null,
        type: "ICU",
        ward: "Ward D",
        availability: "Available",
    },
    {
        bedId: 8,
        hospitalId: 1, // Hospital 1
        patientId: null,
        type: "General",
        ward: "Ward C",
        availability: "Available",
    },
    {
        bedId: 9,
        hospitalId: 1, // Hospital 1
        patientId: null,
        type: "General",
        ward: "Ward C",
        availability: "Available",
    },
    {
        bedId: 10,
        hospitalId: 1, // Hospital 1
        patientId: null,
        type: "ICU",
        ward: "Ward D",
        availability: "Available",
    },
];

const departmentServices = [
    {
        departmentId: 1, // Cardiology
        serviceId: 10, // Cardiac MRI
        price: 1500.0,
    },
    {
        departmentId: 2, // Neurology
        serviceId: 9, // Epilepsy treatment
        price: 13000.0,
    },
    {
        departmentId: 3, // Urology
        serviceId: 7, // Urinalysis
        price: 500.0,
    },
    {
        departmentId: 4, // Orthopedics
        serviceId: 8, // Arthroscopy
        price: 550000.0,
    },
    {
        departmentId: 5, // General Services
        serviceId: 11, // Consultation
        price: 100.0,
    },
    {
        departmentId: 5, // General Services
        serviceId: 12, // Consultation
        price: 100.0,
    },
    {
        departmentId: 5, // General Services
        serviceId: 13, // Consultation
        price: 200.0,
    },
];

const hospitalDepartments = [
    {
        hospitalId: 1, // Hospital 1
        departmentId: 1, // Cardiology
    },
    {
        hospitalId: 1, // Hospital 1
        departmentId: 2, // Neurology
    },
    {
        hospitalId: 1, // Hospital 1
        departmentId: 3, // Urology
    },
    {
        hospitalId: 1, // Hospital 1
        departmentId: 5, // General Services
    },
    {
        hospitalId: 2, // Hospital 2
        departmentId: 1, // Cardiology
    },
    {
        hospitalId: 2, // Hospital 2
        departmentId: 2, // Neurology
    },
    {
        hospitalId: 2, // Hospital 2
        departmentId: 4, // Orthopedics
    },
    {
        hospitalId: 2, // Hospital 2
        departmentId: 5, // General Services
    },
    {
        hospitalId: 3, // Hospital 3
        departmentId: 1, // Cardiology
    },
    {
        hospitalId: 3, // Hospital 3
        departmentId: 2, // Neurology
    },
    {
        hospitalId: 3, // Hospital 3
        departmentId: 3, // Urology
    },
    {
        hospitalId: 3, // Hospital 3
        departmentId: 5, // General Services
    },
];

const serviceUsages = [
    {
        usageId: "123e4567-e89b-12d3-a456-426736574096",
        serviceId: 11, // Consultation
        patientId: 12875, // Thomas Patey
        date: new Date("2024-05-22"),
    },
    {
        usageId: "123e4567-e89b-12d3-a456-426736574187",
        serviceId: 10, // Cardiac MRI
        patientId: 12875, // Thomas Patey
        date: new Date("2024-05-22"),
    },
    {
        usageId: "123e4567-e89b-12d3-a456-426614174001",
        serviceId: 12, // Consultation
        patientId: 12875, // Thomas Patey
        date: new Date("2024-05-23"),
    },
    {
        usageId: "123e4567-e89b-12d3-a456-426736574187",
        serviceId: 11, // Consultation
        patientId: 12982, // Alice Johnson
        date: new Date("2024-05-25"),
    },
    {
        usageId: "123e4567-e89b-12d3-a456-426736574187",
        serviceId: 12, // Consultation
        patientId: 12332, // Kyle Walker
        date: new Date("2024-05-27"),
    },
];

const referrals = [
    {
        referralId: 1,
        patientId: 12875, // Thomas Patey
        hospitalId: 2,
        date: new Date("2024-05-22"),
        type: "External",
        primaryCareProvider: "Nikolas Patey",
        referralAddress: "123 Main St, Anytown, CA 12345",
        referralPhone: "+2544566372",
        reasonForConsultation: "Evaluation and management of suspected heart murmur",
        diagnosis: "N/A (to be determined)",
        physicianName: "Dr. John Smith",
        physicianDepartment: "Cardiology",
        physicianSpecialty: "Cardiologist",
        physicianEmail: "jsmith@snarkhealth.com",
        physicianPhoneNumber: "+1234566372",
    },
    {
        referralId: 2,
        patientId: 12982, // Alice Johnson
        hospitalId: 1,
        date: new Date("2024-05-25"),
        type: "Internal",
        primaryCareProvider: "Michael Lee",
        referralAddress: "456 Elm St, Anytown, CA 98765",
        referralPhone: "(555) 555-9876",
        reasonForConsultation: "Continuous migraine",
        diagnosis: "Head injury",
        physicianName: "Dr. Phil Foden",
        physicianDepartment: "Neurology",
        physicianSpecialty: "Neurosurgeon",
        physicianEmail: "pfoden@snarkhealth.com",
        physicianPhoneNumber: "+1244567890",
    },
];

const doctorReferrals = [
    {
        doctorId: 1, // Dr. John Smith
        referralId: 1, // Referral 1
        patientId: 12875, // Thomas Patey
    },
    {
        doctorId: 1, // Dr. John Smith
        referralId: 2, // Referral 2
        patientId: 12982, // Alice Johnson
    },
];

const payments = [
    {
        paymentId: "123e4567-e89b-12d3-a456-426614174021",
        patientId: 12875, // Thomas Patey
        serviceId: 11, // Consultation
        hospitalId: 1, // Nairobi City Hospital
        appointmentId: "f432a1c7-2345-6789-0abc-defgjdhdlmnop",
        amount: 100.0,
        createdAt: new Date("2024-05-22"),
        updatedAt: new Date("2024-05-22"),
    },
    {
        paymentId: "123e4567-e89b-12d3-a456-426614174283",
        patientId: 12875, // Thomas Patey
        serviceId: 10, // Cardiac MRI
        hospitalId: 1, // Nairobi City Hospital
        appointmentId: "f432a1c7-2345-6789-0abc-defgjdhdlmnop",
        amount: 1500.0,
        createdAt: new Date("2024-05-22"),
        updatedAt: new Date("2024-05-22"),
    },
    {
        paymentId: "123e4567-e89b-12d3-a456-426614174313",
        patientId: 12875, // Thomas Patey
        serviceId: 12, // Consultation
        hospitalId: 2, // Mombasa General Hospital
        appointmentId: "f432a1c7-2345-6789-0abc-defghijklkngs",
        amount: 100.0,
        createdAt: new Date("2024-05-23"),
        updatedAt: new Date("2024-05-23"),
    },
    {
        paymentId: "123e4567-e89b-12d3-a456-426614174293",
        patientId: 12982, // Alice Johnson
        serviceId: 11, // Consultation
        hospitalId: 1, // Nairobi City Hospital
        appointmentId: "f432a1c7-2345-6789-0abc-defghiksjnop",
        amount: 100.0,
        createdAt: new Date("2024-05-25"),
        updatedAt: new Date("2024-05-25"),
    },
    {
        paymentId: "123e4567-e89b-12d3-a456-426614174342",
        patientId: 12332, // Kyle Walker
        serviceId: 12, // Consultation
        hospitalId: 2, // Mombasa General Hospital
        appointmentId: "f432a1c7-2345-6789-0abc-oeujhijklmnop",
        amount: 100.0,
        createdAt: new Date("2024-05-27"),
        updatedAt: new Date("2024-05-27"),
    },
];

const appointmentServices = [
    {
        appointmentId: "f432a1c7-2345-6789-0abc-defgjdhdlmnop", // Appointment for Thomas Patey
        serviceId: 11, // Consultation
        patientId: 12875, // Thomas Patey
    },
    {
        appointmentId: "f432a1c7-2345-6789-0abc-defgjdhdlmnop", // Appointment for Thomas Patey
        serviceId: 10, // Cardiac MRI
        patientId: 12875, // Thomas Patey
    },
    {
        appointmentId: "f432a1c7-2345-6789-0abc-defghijklkngs", // Appointment for Thomas Patey
        serviceId: 12, // Consultation
        patientId: 12875, // Thomas Patey
    },
    {
        appointmentId: "f432a1c7-2345-6789-0abc-defghiksjnop", // Appointment for Alice Johnson
        serviceId: 11, // Consultation
        patientId: 12982, // Alice Johnson
    },
    {
        appointmentId: "f432a1c7-2345-6789-0abc-oeujhijklmnop", // Appointment for Kyle Walker
        serviceId: 12, // Consultation
        patientId: 12332, // Kyle Walker
    },
];

const sessions = [
    {
        sessionId: "b78d23c4-1234-5678-90ab-fec4b6a6442b",
        sessionToken: "5g6t-87rh-5423-6754-75c4", // Unique identifier for the session
        userId: "410544b2-4001-4271-9855-fec4b6a6442a",
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // Expires in 2 hours (active session)
    },
    {
        sessionId: "hr65847t-1234-5678-90ab-fec4b6a6442b",
        sessionToken: "7645-gt54-g65t-8865-6543",
        userId: "410544b2-8263-4271-9855-fec4b6a6442a",
        expires: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
        sessionId: "t6e5r3g7-1234-5678-90ab-fec4b6a6442b",
        sessionToken: "6754-7y64-8uy6-6tr3-7654",
        userId: "b78d23c4-0921-5678-90ab-fec4b6a6442b",
        expires: new Date(Date.now() + 1 * 60 * 1000),
    },
    {
        sessionId: "6trg8746-1234-5678-90ab-fec4b6a6442b",
        sessionToken: "kry6-76yr-6745-6476-ff56",
        userId: "b78d23c4-0097-5678-90ab-fec4b6a6442b",
        expires: new Date(Date.now() + 1 * 60 * 1000),
    },
    {
        sessionId: "yter5763-1234-5678-90ab-fec4b6a6442b",
        sessionToken: "6545-yt65-5635-tre4-65t3",
        userId: "b78d23c4-7625-5678-90ab-fec4b6a6442b",
        expires: new Date(Date.now() + 60 * 60 * 1000),
    },
];

const verificationTokens = [
    {
        tokenId: 1,
        identifier: "user-email-verification", // Identifier for email verification
        token: "8477-t654-8746-862g-7644",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours (valid)
    },
    {
        tokenId: 2,
        identifier: "user-password-reset", // Identifier for password reset
        token: "7433-jd67-814e-8o84-8774",
        expires: new Date(Date.now() - 1 * 60 * 60 * 1000), // Expired token (1 hour ago)
    },
    {
        tokenId: 3,
        identifier: "account-deletion", // Identifier for account deletion
        token: "7893-9875-6424-094o-te56",
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000), // Expires in 12 hours
    },
    {
        tokenId: 4,
        identifier: "user-mfa", // Identifier for multi-factor authentication
        token: "9883-t563-631n-7332-7533",
        expires: new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 minutes
    },
    {
        tokenId: 5,
        identifier: "invalid-identifier", // Invalid identifier (error scenario)
        token: "tr54-7654-2364-9756-6453",
        expires: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
    },
    {
        tokenId: 6,
        identifier: "user-phone-verification", // Invalid identifier (error scenario)
        token: "6354-0987-te64-763r-te53",
        expires: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
    },
];

const profiles = [
    {
        profileId: "1a2b3c4d-5678-90ab-cdef-1234567890ab",
        userId: "410544b2-4001-4271-9855-fec4b6a6442a", // Edwin
        firstName: "Edwin",
        lastName: "Johnson",
        gender: "Male",
        phone: "+254711223344",
        address: "123 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1980-05-15"),
        imageUrl: "/images/img-p1.png",
        nextOfKin: "Jane Doe",
        nextOfKinPhoneNo: "+254712345678",
        emergencyContact: "+254711223344",
    },
    {
        profileId: "2a3b4c5d-6789-01ab-cdef-2345678901bc",
        userId: "b78d23c4-1234-5678-90ab-fec4b6a6442b", // John Smith
        firstName: "John",
        lastName: "Smith",
        gender: "Male",
        phone: "+254733445566",
        address: "456 Nairobi Avenue, Nairobi, Kenya",
        dateOfBirth: new Date("1975-08-22"),
        imageUrl: "/images/img-p2.png",
        nextOfKin: "Mary Smith",
        nextOfKinPhoneNo: "+254734567890",
        emergencyContact: "+254733445566",
    },
    {
        profileId: "3a4b5c6d-7890-12ab-cdef-3456789012cd",
        userId: "b78d23c4-9856-5678-90ab-fec4b6a6442b", // staff1
        firstName: "Alice",
        lastName: "Williams",
        gender: "Female",
        phone: "+254744556677",
        address: "789 Nairobi Blvd, Nairobi, Kenya",
        dateOfBirth: new Date("1985-03-10"),
        imageUrl: "/images/img-p3.png",
        nextOfKin: "Bob Williams",
        nextOfKinPhoneNo: "+254745678901",
        emergencyContact: "+254744556677",
    },
    {
        profileId: "4a5b6c7d-8901-23ab-cdef-4567890123de",
        userId: "410544b2-8263-4271-9855-fec4b6a6442a", // Jack
        firstName: "Jack",
        lastName: "Brown",
        gender: "Male",
        phone: "+254755667788",
        address: "123 Mombasa Road, Mombasa, Kenya",
        dateOfBirth: new Date("1982-09-25"),
        imageUrl: "/images/img-p4.png",
        nextOfKin: "Lucy Brown",
        nextOfKinPhoneNo: "+254756789012",
        emergencyContact: "+254755667788",
    },
    {
        profileId: "5a6b7c8d-9012-34ab-cdef-5678901234ef",
        userId: "b78d23c4-0921-5678-90ab-fec4b6a6442b", // Phil Foden
        firstName: "Phil",
        lastName: "Foden",
        gender: "Male",
        phone: "+254766778899",
        address: "456 Mombasa Avenue, Mombasa, Kenya",
        dateOfBirth: new Date("1990-07-19"),
        imageUrl: "/images/img-p5.png",
        nextOfKin: "Sarah Foden",
        nextOfKinPhoneNo: "+254767890123",
        emergencyContact: "+254766778899",
    },
    {
        profileId: "6a7b8c9d-0123-45ab-cdef-6789012345fg",
        userId: "b78d23c4-0097-5678-90ab-fec4b6a6442b", // staff2
        firstName: "Emma",
        lastName: "Jones",
        gender: "Female",
        phone: "+254777889900",
        address: "789 Mombasa Blvd, Mombasa, Kenya",
        dateOfBirth: new Date("1987-01-30"),
        imageUrl: "/images/img-p6.png",
        nextOfKin: "Michael Jones",
        nextOfKinPhoneNo: "+254778901234",
        emergencyContact: "+254777889900",
    },
    {
        profileId: "7a8b9c0d-1234-56ab-cdef-7890123456gh",
        userId: "b78d23c4-8332-5678-90ab-fec4b6a6442b", // Mikel Arteta
        firstName: "Mikel",
        lastName: "Arteta",
        gender: "Male",
        phone: "+254788990011",
        address: "123 Mombasa Street, Mombasa, Kenya",
        dateOfBirth: new Date("1984-06-26"),
        imageUrl: "/images/img-p7.png",
        nextOfKin: "Laura Arteta",
        nextOfKinPhoneNo: "+254789012345",
        emergencyContact: "+254788990011",
    },
    {
        profileId: "8a9b0c1d-2345-67ab-cdef-8901234567ij",
        userId: "b78d23c4-7625-5678-90ab-fec4b6a6442b", // Xabi Alonso
        firstName: "Xabi",
        lastName: "Alonso",
        gender: "Male",
        phone: "+254799001122",
        address: "456 Abuja Road, Abuja, Nigeria",
        dateOfBirth: new Date("1981-11-25"),
        imageUrl: "/images/img-p8.png",
        nextOfKin: "Nagore Alonso",
        nextOfKinPhoneNo: "+254790123456",
        emergencyContact: "+254799001122",
    },
];

module.exports = {
    roles,
    hospitals,
    users,
    departments,
    services,
    doctors,
    patients,
    appointments,
    doctorEarnings,
    beds,
    departmentServices,
    hospitalDepartments,
    serviceUsages,
    referrals,
    doctorReferrals,
    payments,
    appointmentServices,
    sessions,
    verificationTokens,
    profiles
};
