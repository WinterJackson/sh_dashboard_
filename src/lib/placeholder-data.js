// src/lib/placeholder-data.js file

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
    {
        hospitalId: 4,
        name: "Saint Bridget Hospital",
        phone: "+254 700200098",
        email: "info@stbridgethospital.com",
        country: "Kenya",
        city: "Kiambu",
        referralCode: "SB487",
        website: "https://www.stbridgethospital.com",
        logoUrl: "https://example.com/stb-hospital.png",
    }
];

const users = [
    {
        userId: "410544b2-4001-4271-9855-fec4b6a6442a",
        username: "Edwin",
        email: "edwin@snarkhealth.com",
        password: "adminpassword",
        role: "SUPER_ADMIN", // Super Admin role
        hospitalId: null,
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "410544b2-0001-0000-000a-fec4b6a6442a",
        username: "Kuzzi",
        email: "kuzzi@snarkhealth.com",
        password: "adminpassword",
        role: "SUPER_ADMIN", // Super Admin role
        hospitalId: null,
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "410544b2-8594-1125-5468-fec4b6a6442a",
        username: "Ken",
        email: "ken@snarkhealth.com",
        password: "adminpassword",
        role: "ADMIN", // Admin role
        hospitalId: 1, // Hospital 1
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "410544b2-8263-4271-9855-fec4b6a6442a",
        username: "Jack",
        email: "jack@snarkhealth.com",
        password: "adminpassword",
        role: "ADMIN", // Admin role
        hospitalId: 2, // Hospital 2
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "810544b2-5697-7789-2154-fec4b6a8442a",
        username: "Vivian",
        email: "viv@snarkhealth.com",
        password: "adminpassword",
        role: "ADMIN", // Admin role
        hospitalId: 3, // Hospital 3
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "410544b2-9685-2222-h458-fec4b6h5442a",
        username: "Martin",
        email: "martin@snarkhealth.com",
        password: "adminpassword",
        role: "ADMIN", // Admin role
        hospitalId: 4, // Hospital 4
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "880544b2-4565-9875-458u-fec4b6h5442a",
        username: "Test",
        email: "test@snarkhealth.com",
        password: "adminpassword",
        role: "ADMIN", // Admin role
        hospitalId: 4, // Hospital 4
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-1234-5678-90ab-fec4b6a6442b",
        username: "John Smith",
        email: "js@snarkhealth.com",
        password: "docpassword",
        role: "DOCTOR", // Doctor role
        hospitalId: 1, // Hospital 1
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-0921-5678-90ab-fec4b6a6442b",
        username: "Phil Foden",
        email: "foden@snarkhealth.com",
        password: "docpassword",
        role: "DOCTOR", // Doctor role
        hospitalId: 2, // Hospital 2
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-7625-5678-90ab-fec4b6a6442b",
        username: "Xabi Alonso",
        email: "xabi@snarkhealth.com",
        password: "docpassword",
        role: "DOCTOR", // Doctor role
        hospitalId: 3, // Hospital 3
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-4698-2147-45kg-fec4b6a6442b",
        username: "Silva",
        email: "silva@snarkhealth.com",
        password: "docpassword",
        role: "DOCTOR", // Doctor role
        hospitalId: 3, // Hospital 3
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-f478-9426-lo48-fec4b6a6442b",
        username: "Stanley",
        email: "stan@snarkhealth.com",
        password: "docpassword",
        role: "DOCTOR", // Doctor role
        hospitalId: 3, // Hospital 3
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-8332-5678-90ab-fec4b6a6442b",
        username: "Mikel Arteta",
        email: "arteta@snarkhealth.com",
        password: "docpassword",
        role: "DOCTOR", // Doctor role
        hospitalId: 4, // Hospital 4
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-g458-3654-4598-fec4b6a6442b",
        username: "Kante",
        email: "kante@snarkhealth.com",
        password: "docpassword",
        role: "DOCTOR", // Doctor role
        hospitalId: 4, // Hospital 4
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-79p6-5698-4469-fec4b6a6442b",
        username: "Linda",
        email: "linda@snarkhealth.com",
        password: "docpassword",
        role: "DOCTOR", // Doctor role
        hospitalId: 4, // Hospital 4
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-5896-7789-hg88-fec4b6a6442b",
        username: "Riley",
        email: "riley@snarkhealth.com",
        password: "nursepassword",
        role: "NURSE", // Nurse role
        hospitalId: 1, // Hospital 1
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-0097-5678-90ab-fec4b6a6442b",
        username: "Kimberly",
        email: "kim@snarkhealth.com",
        password: "nursepassword",
        role: "NURSE", // Nurse role
        hospitalId: 2, // Hospital 2
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-4565-7845-80ab-fec4b6a6442b",
        username: "Lilian",
        email: "lil@snarkhealth.com",
        password: "nursepassword",
        role: "NURSE", // Nurse role
        hospitalId: 3, // Hospital 3
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-jh85-4589-2569-fec4b6a6442b",
        username: "Wendy",
        email: "wendy@snarkhealth.com",
        password: "nursepassword",
        role: "NURSE", // Nurse role
        hospitalId: 4, // Hospital 4
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-4569-k475-5216-fec4b6a6442b",
        username: "staff1",
        email: "s1@snarkhealth.com",
        password: "staffpassword",
        role: "STAFF", // Staff role
        hospitalId: 1, // Hospital 1
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-3158-2987-d485-fec4b6a6442b",
        username: "staff2",
        email: "s2@snarkhealth.com",
        password: "staffpassword",
        role: "STAFF", // Staff role
        hospitalId: 2, // Hospital 2
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-6789-4369-7269-fec4b6a6442b",
        username: "staff3",
        email: "s3@snarkhealth.com",
        password: "staffpassword",
        role: "STAFF", // Staff role
        hospitalId: 3, // Hospital 3
        isActive: true,
        lastLogin: null,
    },
    {
        userId: "b78d23c4-h469-9726-v236-fec4b6a6442b",
        username: "staff4",
        email: "s4@snarkhealth.com",
        password: "staffpassword",
        role: "STAFF", // Staff role
        hospitalId: 4, // Hospital 4
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
    {
        departmentId: 6,
        name: "Cleaning Services",
        description:
            "Focuses on cleanliness in the hospital.",
    },
    {
        departmentId: 7,
        name: "Office Services",
        description:
            "Focuses on office services in the hospital such as secretaries and personal assistants.",
    },
    {
        departmentId: 8,
        name: "Kitchen Services",
        description:
            "Focuses on food and all the kitchen activities in the hospital.",
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
    {
        serviceId: 14,
        hospitalId: 3, // Hospital 3
        serviceName: "Epilepsy treatment",
    },
    {
        serviceId: 15,
        hospitalId: 4, // Hospital 4
        serviceName: "Cardiac MRI",
    },
    {
        serviceId: 16,
        hospitalId: 3, // Hospital 3
        serviceName: "Urinalysis",
    },
];

const superAdmins = [
    {
        superAdminId: 1,
        userId: "410544b2-0001-0000-000a-fec4b6a6442a",
    },
    {
        superAdminId: 2,
        userId: "410544b2-4001-4271-9855-fec4b6a6442a",
    },
];

const admins = [
    {
        adminId: 1,
        userId: "410544b2-8594-1125-5468-fec4b6a6442a",
        hospitalId: 1, // Hospital 1
    },
    {
        adminId: 2,
        userId: "410544b2-8263-4271-9855-fec4b6a6442a",
        hospitalId: 2, // Hospital 2
    },
    {
        adminId: 3,
        userId: "810544b2-5697-7789-2154-fec4b6a8442a",
        hospitalId: 3, // Hospital 3
    },
    {
        adminId: 4,
        userId: "410544b2-9685-2222-h458-fec4b6h5442a",
        hospitalId: 4, // Hospital 4
    },
    {
        adminId: 5,
        userId: "880544b2-4565-9875-458u-fec4b6h5442a",
        hospitalId: 4, // Hospital 4
    }
];

const doctors = [
    {
        doctorId: 1,
        userId: "b78d23c4-1234-5678-90ab-fec4b6a6442b",
        hospitalId: 1, // Hospital 1
        departmentId: 1, // Cardiology
        serviceId: 10, // Cardiac MRI
        specialization: "Cardiologist",
        status: "Online",
        phoneNo: "+1234566372",
        workingHours: "Mon-Fri: 9AM-5PM",
        averageRating: 4.6,
    },
    {
        doctorId: 2,
        userId: "b78d23c4-0921-5678-90ab-fec4b6a6442b",
        hospitalId: 2, // Hospital 2
        departmentId: 2, // Neurology
        serviceId: 9, // Epilepsy treatment
        specialization: "Neurosurgeon",
        status: "Online",
        phoneNo: "+1244567890",
        workingHours: "Mon-Fri: 8AM-5PM",
        averageRating: 4.8,
    },
    {
        doctorId: 3,
        userId: "b78d23c4-4698-2147-45kg-fec4b6a6442b",
        hospitalId: 3, // Hospital 3
        departmentId: 2, // Neurology
        serviceId: 14, // Epilepsy treatment
        specialization: "Neurosurgeon",
        status: "Online",
        phoneNo: "+1269857890",
        workingHours: "Mon-Fri: 8AM-5PM",
        averageRating: 4.4,
    },
    {
        doctorId: 4,
        userId: "b78d23c4-g458-3654-4598-fec4b6a6442b",
        hospitalId: 4, // Hospital 4
        departmentId: 1, // Cardiology
        serviceId: 15, // Cardiac MRI
        specialization: "Cardiologist",
        status: "Online",
        phoneNo: "+1264893890",
        workingHours: "Mon-Fri: 8AM-5PM",
        averageRating: 4.2,
    },
    {
        doctorId: 5,
        userId: "b78d23c4-8332-5678-90ab-fec4b6a6442b",
        hospitalId: 1, // Hospital 1
        departmentId: 3, // Urology
        serviceId: 7, // Urinalysis
        specialization: "Urologist",
        status: "Online",
        phoneNo: "+1244635424",
        workingHours: "Mon-Fri: 8AM-4PM",
        averageRating: 4.5,
    },
    {
        doctorId: 6,
        userId: "b78d23c4-7625-5678-90ab-fec4b6a6442b",
        hospitalId: 2, // Hospital 2
        departmentId: 4, // Orthopedics
        serviceId: 8, // Arthroscopy
        specialization: "Orthopedist",
        status: "Online",
        phoneNo: "+1244487632",
        workingHours: "Mon-Fri: 8AM-2PM",
        averageRating: 4.1,
    },
    {
        doctorId: 7,
        userId: "b78d23c4-f478-9426-lo48-fec4b6a6442b",
        hospitalId: 3, // Hospital 3
        departmentId: 3, // Urology
        serviceId: 16, // Urinalysis
        specialization: "Urologist",
        status: "Online",
        phoneNo: "+1245426824",
        workingHours: "Mon-Fri: 8AM-4PM",
        averageRating: 4.5,
    },
    {
        doctorId: 8,
        userId: "b78d23c4-79p6-5698-4469-fec4b6a6442b",
        hospitalId: 4, // Hospital 4
        departmentId: 1, // Cardiology
        serviceId: 15, // Cardiac MRI
        specialization: "Cardiologist",
        status: "Online",
        phoneNo: "+1243674814",
        workingHours: "Mon-Fri: 8AM-4PM",
        averageRating: 4.7,
    },
];

const nurses = [
    {
        nurseId: 1,
        userId: "b78d23c4-5896-7789-hg88-fec4b6a6442b",
        hospitalId: 1, // Hospital 1
        departmentId: 1, // Cardiology
        specialization: "Cardiology",
        status: "Online",
        phoneNo: "+1234587322",
        workingHours: "Mon-Fri: 9AM-5PM",
        averageRating: 4.6,
    },
    {
        nurseId: 2,
        userId: "b78d23c4-0097-5678-90ab-fec4b6a6442b",
        hospitalId: 2, // Hospital 2
        departmentId: 3, // Urology
        specialization: "Urology",
        status: "Online",
        phoneNo: "+1234856532",
        workingHours: "Mon-Fri: 7AM-5PM",
        averageRating: 4.1,
    },
    {
        nurseId: 3,
        userId: "b78d23c4-4565-7845-80ab-fec4b6a6442b",
        hospitalId: 3, // Hospital 3
        departmentId: 5, // General Services
        specialization: "Cardiology",
        status: "Online",
        phoneNo: "+1234650932",
        workingHours: "Mon-Fri: 7AM-5PM",
        averageRating: 4.3,
    },
    {
        nurseId: 4,
        userId: "b78d23c4-jh85-4589-2569-fec4b6a6442b",
        hospitalId: 4, // Hospital 4
        departmentId: 5, // General Services
        specialization: "Cardiology",
        status: "Online",
        phoneNo: "+1234076232",
        workingHours: "Mon-Fri: 7AM-5PM",
        averageRating: 4.6,
    },
];

const staff = [
    {
        staffId: 1,
        userId: "b78d23c4-4569-k475-5216-fec4b6a6442b",
        hospitalId: 1, // Hospital 1
        departmentId: 7, // Office Services
        specialization: "Secretary",
        status: "Online",
        phoneNo: "+1235823322",
        workingHours: "Mon-Fri: 9AM-5PM",
        averageRating: 4.0,
    },
    {
        staffId: 2,
        userId: "b78d23c4-3158-2987-d485-fec4b6a6442b",
        hospitalId: 2, // Hospital 2
        departmentId: 7, // Office Services
        specialization: "Secretary",
        status: "Online",
        phoneNo: "+1235879682",
        workingHours: "Mon-Fri: 9AM-5PM",
        averageRating: 4.0,
    },
    {
        staffId: 3,
        userId: "b78d23c4-6789-4369-7269-fec4b6a6442b",
        hospitalId: 3, // Hospital 3
        departmentId: 7, // Cleaning Services
        specialization: "Cleaner",
        status: "Online",
        phoneNo: "+1234658722",
        workingHours: "Mon-Fri: 8AM-5PM",
        averageRating: 4.1,
    },
    {
        staffId: 4,
        userId: "b78d23c4-h469-9726-v236-fec4b6a6442b",
        hospitalId: 4, // Hospital 4
        departmentId: 8, // Kitchen Services
        specialization: "Cheff",
        status: "Online",
        phoneNo: "+1247693722",
        workingHours: "Mon-Fri: 8AM-5PM",
        averageRating: 4.5,
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
        patientId: 15001,
        hospitalId: 1, // Hospital 1
        name: "Kevin Oduor",
        phoneNo: "+254711223311",
        email: "kevin.oduor@example.com",
        dateOfBirth: new Date("1990-03-12T00:00:00"),
        gender: "Male",
        reasonForConsultation: "General check-up",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 15002,
        hospitalId: 1, // Hospital 1
        name: "Esther Wanjiku",
        phoneNo: "+254722334455",
        email: "esther.wanjiku@example.com",
        dateOfBirth: new Date("1982-07-24T00:00:00"),
        gender: "Female",
        reasonForConsultation: "Hypertension management",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 15003,
        hospitalId: 1, // Hospital 1
        name: "Mark Kariuki",
        phoneNo: "+254733556677",
        email: "mark.kariuki@example.com",
        dateOfBirth: new Date("1985-09-15T00:00:00"),
        gender: "Male",
        reasonForConsultation: "Routine blood tests",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 15004,
        hospitalId: 1, // Hospital 1
        name: "Grace Mwangi",
        phoneNo: "+254744667788",
        email: "grace.mwangi@example.com",
        dateOfBirth: new Date("1998-01-10T00:00:00"),
        gender: "Female",
        reasonForConsultation: "Flu symptoms",
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
    {
        patientId: 15985,
        hospitalId: 2, // Hospital 2
        name: "Ali Hassan",
        phoneNo: "+254712345678",
        email: "ali.hassan@example.com",
        dateOfBirth: new Date("1991-05-30T00:00:00"),
        gender: "Male",
        reasonForConsultation: "Diabetes check-up",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 15476,
        hospitalId: 2, // Hospital 2
        name: "Fatima Mwinyi",
        phoneNo: "+254722987654",
        email: "fatima.mwinyi@example.com",
        dateOfBirth: new Date("1983-08-22T00:00:00"),
        gender: "Female",
        reasonForConsultation: "Asthma management",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 15707,
        hospitalId: 2, // Hospital 2
        name: "Musa Juma",
        phoneNo: "+254732123456",
        email: "musa.juma@example.com",
        dateOfBirth: new Date("1987-12-02T00:00:00"),
        gender: "Male",
        reasonForConsultation: "Back pain",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 15458,
        hospitalId: 2, // Hospital 2
        name: "Zara Omar",
        phoneNo: "+254742567890",
        email: "zara.omar@example.com",
        dateOfBirth: new Date("1995-11-15T00:00:00"),
        gender: "Female",
        reasonForConsultation: "Eye irritation",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 13575,
        hospitalId: 3, // Hospital 3
        name: "David Adams",
        phoneNo: "+7676233210",
        email: "david.adams@example.com",
        dateOfBirth: new Date("1987-02-10T00:00:00"),
        gender: "Male",
        reasonForConsultation: "Fracture",
        admissionDate: null,
        dischargeDate: null,
        status: "Inpatient",
    },
    {
        patientId: 13682,
        hospitalId: 3, // Hospital 3
        name: "Linda Carter",
        phoneNo: "+7676547610",
        email: "linda.carter@example.com",
        dateOfBirth: new Date("1995-08-20T00:00:00"),
        gender: "Female",
        reasonForConsultation: "Diabetes",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 15009,
        hospitalId: 3, // Hospital 3
        name: "Chinedu Okeke",
        phoneNo: "+234701234567",
        email: "chinedu.okeke@example.com",
        dateOfBirth: new Date("1989-04-18T00:00:00"),
        gender: "Male",
        reasonForConsultation: "Allergy treatment",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 15010,
        hospitalId: 3, // Hospital 3
        name: "Ngozi Eze",
        phoneNo: "+234711223344",
        email: "ngozi.eze@example.com",
        dateOfBirth: new Date("1978-06-25T00:00:00"),
        gender: "Female",
        reasonForConsultation: "Blood pressure monitoring",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 15011,
        hospitalId: 3, // Hospital 3
        name: "Emeka Uche",
        phoneNo: "+234722334455",
        email: "emeka.uche@example.com",
        dateOfBirth: new Date("1993-07-19T00:00:00"),
        gender: "Male",
        reasonForConsultation: "General check-up",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 15812,
        hospitalId: 3, // Hospital 3
        name: "Amaka Obi",
        phoneNo: "+234733556677",
        email: "amaka.obi@example.com",
        dateOfBirth: new Date("1990-02-14T00:00:00"),
        gender: "Female",
        reasonForConsultation: "Headache",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 14732,
        hospitalId: 4, // Hospital 4
        name: "Michael Thompson",
        phoneNo: "+254700000001",
        email: "michael.thompson@example.com",
        dateOfBirth: new Date("1989-11-18T00:00:00"),
        gender: "Male",
        reasonForConsultation: "Hypertension",
        admissionDate: null,
        dischargeDate: null,
        status: "Inpatient",
    },
    {
        patientId: 14829,
        hospitalId: 4, // Hospital 4
        name: "Sophia Roberts",
        phoneNo: "+254700000002",
        email: "sophia.roberts@example.com",
        dateOfBirth: new Date("1993-06-14T00:00:00"),
        gender: "Female",
        reasonForConsultation: "Asthma",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 15013,
        hospitalId: 4,
        name: "Felix Njoroge",
        phoneNo: "+254711224455",
        email: "felix.njoroge@example.com",
        dateOfBirth: new Date("1992-11-03T00:00:00"),
        gender: "Male",
        reasonForConsultation: "Flu symptoms",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 15014,
        hospitalId: 4,
        name: "Miriam Mwangi",
        phoneNo: "+254722334566",
        email: "miriam.mwangi@example.com",
        dateOfBirth: new Date("1986-09-09T00:00:00"),
        gender: "Female",
        reasonForConsultation: "Cough",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 15015,
        hospitalId: 4,
        name: "Grace Kimani",
        phoneNo: "+254733446677",
        email: "grace.kimani@example.com",
        dateOfBirth: new Date("1990-12-25T00:00:00"),
        gender: "Female",
        reasonForConsultation: "Joint pain",
        admissionDate: null,
        dischargeDate: null,
        status: "Outpatient",
    },
    {
        patientId: 15016,
        hospitalId: 4,
        name: "Alex Mwangi",
        phoneNo: "+254744667788",
        email: "alex.mwangi@example.com",
        dateOfBirth: new Date("1988-03-05T00:00:00"),
        gender: "Male",
        reasonForConsultation: "Routine check-up",
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
        type: "ICU",
        ward: "Ward C",
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
    {
        bedId: 11,
        hospitalId: 3, // Hospital 3
        patientId: 13575,
        type: "ICU",
        ward: "Ward A",
        availability: "Occupied",
    },
    {
        bedId: 12,
        hospitalId: 3, // Hospital 3
        patientId: null,
        type: "General",
        ward: "Ward B",
        availability: "Available",
    },
    {
        bedId: 13,
        hospitalId: 3, // Hospital 3
        patientId: null,
        type: "General",
        ward: "Ward C",
        availability: "Available",
    },
    {
        bedId: 14,
        hospitalId: 4, // Hospital 4
        patientId: 14732,
        type: "General",
        ward: "Ward A",
        availability: "Occupied",
    },
    {
        bedId: 15,
        hospitalId: 4, // Hospital 4
        patientId: null,
        type: "General",
        ward: "Ward B",
        availability: "Available",
    },
    {
        bedId: 16,
        hospitalId: 4, // Hospital 4
        patientId: null,
        type: "ICU",
        ward: "Ward C",
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
        departmentId: 1, // Cardiology
        serviceId: 15, // Cardiac MRI
        price: 2500.0,
    },
    {
        departmentId: 2, // Neurology
        serviceId: 9, // Epilepsy treatment
        price: 13000.0,
    },
    {
        departmentId: 2, // Neurology
        serviceId: 14, // Epilepsy treatment
        price: 15000.0,
    },
    {
        departmentId: 3, // Urology
        serviceId: 7, // Urinalysis
        price: 500.0,
    },
    {
        departmentId: 3, // Urology
        serviceId: 16, // Urinalysis
        price: 800.0,
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
    {
        departmentId: 5, // General Services
        serviceId: 1, // X-ray
        price: 5000.0,
    },
    {
        departmentId: 5, // General Services
        serviceId: 2, // Blood Test
        price: 500.0,
    },
    {
        departmentId: 5, // General Services
        serviceId: 3, // X-ray
        price: 5500.0,
    },
    {
        departmentId: 5, // General Services
        serviceId: 4, // Blood Test
        price: 550.0,
    },
    {
        departmentId: 5, // General Services
        serviceId: 5, // X-ray
        price: 6000.0,
    },
    {
        departmentId: 5, // General Services
        serviceId: 6, // Blood Test
        price: 650.0,
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
    {
        hospitalId: 4, // Hospital 4
        departmentId: 1, // Cardiology
    },
    {
        hospitalId: 4, // Hospital 4
        departmentId: 2, // Neurology
    },
    {
        hospitalId: 4, // Hospital 4
        departmentId: 3, // Urology
    },
    {
        hospitalId: 4, // Hospital 4
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
        effectiveDate: new Date("2024-05-22"),
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
        patientId: 12332, // Kyle Walker
        hospitalId: 2,
        effectiveDate: new Date("2024-05-29"),
        type: "External",
        primaryCareProvider: "Emma Stone",
        referralAddress: "456 Pine St, Anytown, CA 98765",
        referralPhone: "(555) 555-3456",
        reasonForConsultation: "Orthopedic evaluation",
        diagnosis: "Suspected ACL tear",
        physicianName: "Dr. Phil Foden",
        physicianDepartment: "Neurology",
        physicianSpecialty: "Neurosurgeon",
        physicianEmail: "pfoden@snarkhealth.com",
        physicianPhoneNumber: "+1244567890",
    },
    {
        referralId: 3,
        patientId: 12329, // Alicia Keys
        hospitalId: 2,
        effectiveDate: new Date("2024-05-30"),
        type: "Internal",
        primaryCareProvider: "John Black",
        referralAddress: "654 Cedar St, Anytown, CA 12345",
        referralPhone: "(555) 555-9876",
        reasonForConsultation: "Chest pain evaluation",
        diagnosis: "Angina",
        physicianName: "Dr. Phil Foden",
        physicianDepartment: "Neurology",
        physicianSpecialty: "Neurosurgeon",
        physicianEmail: "pfoden@snarkhealth.com",
        physicianPhoneNumber: "+1244567890",
    },
    {
        referralId: 4,
        patientId: 12332, // Kyle Walker
        hospitalId: 2,
        effectiveDate: new Date("2024-05-31"),
        type: "External",
        primaryCareProvider: "Susan White",
        referralAddress: "789 Birch St, Anytown, CA 98765",
        referralPhone: "(555) 555-7890",
        reasonForConsultation: "Neurosurgical evaluation",
        diagnosis: "Herniated disc",
        physicianName: "Dr. Phil Foden",
        physicianDepartment: "Neurology",
        physicianSpecialty: "Neurosurgeon",
        physicianEmail: "pfoden@snarkhealth.com",
        physicianPhoneNumber: "+1244567890",
    },
    {
        referralId: 5,
        patientId: 12982, // Alice Johnson
        hospitalId: 1,
        effectiveDate: new Date("2024-05-26"),
        type: "Internal",
        primaryCareProvider: "Sarah Lee",
        referralAddress: "123 Park St, Anytown, CA 98765",
        referralPhone: "(555) 555-2345",
        reasonForConsultation: "Severe migraines",
        diagnosis: "Chronic migraine",
        physicianName: "Dr. John Smith",
        physicianDepartment: "Cardiology",
        physicianSpecialty: "Cardiologist",
        physicianEmail: "jsmith@snarkhealth.com",
        physicianPhoneNumber: "+1234566372",
    },
    {
        referralId: 6,
        patientId: 12875, // Thomas Patey
        hospitalId: 1,
        effectiveDate: new Date("2024-05-27"),
        type: "External",
        primaryCareProvider: "Nancy Green",
        referralAddress: "789 Maple St, Anytown, CA 12345",
        referralPhone: "(555) 555-5678",
        reasonForConsultation: "Cardiac evaluation",
        diagnosis: "Suspected arrhythmia",
        physicianName: "Dr. John Smith",
        physicianDepartment: "Cardiology",
        physicianSpecialty: "Cardiologist",
        physicianEmail: "jsmith@snarkhealth.com",
        physicianPhoneNumber: "+1234566372",
    },
    {
        referralId: 7,
        patientId: 12982, // Alice Johnson
        hospitalId: 1,
        effectiveDate: new Date("2024-05-28"),
        type: "Internal",
        primaryCareProvider: "David Blue",
        referralAddress: "321 Oak St, Anytown, CA 98765",
        referralPhone: "(555) 555-6789",
        reasonForConsultation: "Neurological evaluation",
        diagnosis: "N/A (to be determined)",
        physicianName: "Dr. John Smith",
        physicianDepartment: "Cardiology",
        physicianSpecialty: "Cardiologist",
        physicianEmail: "jsmith@snarkhealth.com",
        physicianPhoneNumber: "+1234566372",
    },
    {
        referralId: 8,
        patientId: 12982, // Alice Johnson
        hospitalId: 1,
        effectiveDate: new Date("2024-05-25"),
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
    {
        referralId: 9,
        patientId: 13575, // David Adams
        hospitalId: 3,
        effectiveDate: new Date("2024-06-01"),
        type: "Internal",
        primaryCareProvider: "Michael White",
        referralAddress: "123 Cherry St, Anytown, CA 12345",
        referralPhone: "(555) 555-4321",
        reasonForConsultation: "Fracture management",
        diagnosis: "Broken leg",
        physicianName: "Dr. Silva",
        physicianDepartment: "Neurology",
        physicianSpecialty: "Neurosurgeon",
        physicianEmail: "silva@snarkhealth.com",
        physicianPhoneNumber: "+1269857890",
    },
    {
        referralId: 10,
        patientId: 13682, // Linda Carter
        hospitalId: 3,
        effectiveDate: new Date("2024-06-02"),
        type: "External",
        primaryCareProvider: "Emily Red",
        referralAddress: "456 Oak St, Anytown, CA 98765",
        referralPhone: "(555) 555-2345",
        reasonForConsultation: "Diabetes management",
        diagnosis: "Type 2 Diabetes",
        physicianName: "Dr. Silva",
        physicianDepartment: "Neurology",
        physicianSpecialty: "Neurosurgeon",
        physicianEmail: "silva@snarkhealth.com",
        physicianPhoneNumber: "+1269857890",
    },
    {
        referralId: 11,
        patientId: 13682, // Linda Carter
        hospitalId: 3,
        effectiveDate: new Date("2024-06-03"),
        type: "Internal",
        primaryCareProvider: "Mark Yellow",
        referralAddress: "789 Spruce St, Anytown, CA 98765",
        referralPhone: "(555) 555-5678",
        reasonForConsultation: "Chronic pain management",
        diagnosis: "N/A (to be determined)",
        physicianName: "Dr. Silva",
        physicianDepartment: "Neurology",
        physicianSpecialty: "Neurosurgeon",
        physicianEmail: "silva@snarkhealth.com",
        physicianPhoneNumber: "+1269857890",
    },
    {
        referralId: 12,
        patientId: 14732, // Michael Thompson
        hospitalId: 4,
        effectiveDate: new Date("2024-06-04"),
        type: "External",
        primaryCareProvider: "Linda Green",
        referralAddress: "123 Aspen St, Anytown, CA 12345",
        referralPhone: "(555) 555-8765",
        reasonForConsultation: "Hypertension management",
        diagnosis: "Hypertension",
        physicianName: "Dr. Kante",
        physicianDepartment: "Cardiology",
        physicianSpecialty: "Cardiologist",
        physicianEmail: "kante@snarkhealth.com",
        physicianPhoneNumber: "+1264893890",
    },
    {
        referralId: 13,
        patientId: 14829, // Sophia Roberts
        hospitalId: 4,
        effectiveDate: new Date("2024-06-05"),
        type: "Internal",
        primaryCareProvider: "George Blue",
        referralAddress: "456 Pine St, Anytown, CA 98765",
        referralPhone: "(555) 555-5432",
        reasonForConsultation: "Asthma management",
        diagnosis: "Chronic Asthma",
        physicianName: "Dr. Mikel Arteta",
        physicianDepartment: "Cardiology",
        physicianSpecialty: "Cardiologist",
        physicianEmail: "arteta@snarkhealth.com",
        physicianPhoneNumber: "+1243674814",
    },
    {
        referralId: 14,
        patientId: 14829, // Sophia Roberts
        hospitalId: 4,
        effectiveDate: new Date("2024-06-06"),
        type: "External",
        primaryCareProvider: "Henry Black",
        referralAddress: "789 Willow St, Anytown, CA 12345",
        referralPhone: "(555) 555-6789",
        reasonForConsultation: "Cardiac evaluation",
        diagnosis: "Suspected arrhythmia",
        physicianName: "Dr. Mikel Arteta",
        physicianDepartment: "Cardiology",
        physicianSpecialty: "Cardiologist",
        physicianEmail: "arteta@snarkhealth.com",
        physicianPhoneNumber: "+1243674814",
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
        profileId: "1a2b3c4d-0001-0000-000a-1234567890ab",
        userId: "410544b2-0001-0000-000a-fec4b6a6442a", // Kuzzi
        firstName: "Kuzzi",
        lastName: "Smith",
        gender: "Male",
        phone: "+254711223345",
        address: "124 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1985-04-20"),
        imageUrl: "/images/img-p2.png",
        nextOfKin: "John Doe",
        nextOfKinPhoneNo: "+254712345679",
        emergencyContact: "+254711223345",
    },
    {
        profileId: "1a2b3c4d-8594-1125-5468-1234567890ab",
        userId: "410544b2-8594-1125-5468-fec4b6a6442a", // Ken
        firstName: "Ken",
        lastName: "Adams",
        gender: "Male",
        phone: "+254711223346",
        address: "125 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1975-07-10"),
        imageUrl: "/images/img-p3.png",
        nextOfKin: "Mary Doe",
        nextOfKinPhoneNo: "+254712345680",
        emergencyContact: "+254711223346",
    },
    {
        profileId: "1a2b3c4d-8263-4271-9855-1234567890ab",
        userId: "410544b2-8263-4271-9855-fec4b6a6442a", // Jack
        firstName: "Jack",
        lastName: "Brown",
        gender: "Male",
        phone: "+254711223347",
        address: "126 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1988-03-22"),
        imageUrl: "/images/img-p4.png",
        nextOfKin: "Anna Doe",
        nextOfKinPhoneNo: "+254712345681",
        emergencyContact: "+254711223347",
    },
    {
        profileId: "1a2b3c4d-5697-7789-2154-1234567890ab",
        userId: "810544b2-5697-7789-2154-fec4b6a8442a", // Vivian
        firstName: "Vivian",
        lastName: "Lee",
        gender: "Female",
        phone: "+254711223348",
        address: "127 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1992-06-12"),
        imageUrl: "/images/img-p5.png",
        nextOfKin: "Karen Doe",
        nextOfKinPhoneNo: "+254712345682",
        emergencyContact: "+254711223348",
    },
    {
        profileId: "1a2b3c4d-9685-2222-h458-1234567890ab",
        userId: "410544b2-9685-2222-h458-fec4b6h5442a", // Martin
        firstName: "Martin",
        lastName: "Garrix",
        gender: "Male",
        phone: "+254711223349",
        address: "128 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1990-09-17"),
        imageUrl: "/images/img-p6.png",
        nextOfKin: "Sarah Doe",
        nextOfKinPhoneNo: "+254712345683",
        emergencyContact: "+254711223349",
    },
    {
        profileId: "1a2b3c4d-4565-9875-458u-1234567890ab",
        userId: "880544b2-4565-9875-458u-fec4b6h5442a", // Test
        firstName: "Test",
        lastName: "User",
        gender: "Female",
        phone: "+254711223350",
        address: "129 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1985-11-25"),
        imageUrl: "/images/img-p7.png",
        nextOfKin: "Emily Doe",
        nextOfKinPhoneNo: "+254712345684",
        emergencyContact: "+254711223350",
    },
    {
        profileId: "1a2b3c4d-1234-5678-90ab-1234567890ab",
        userId: "b78d23c4-1234-5678-90ab-fec4b6a6442b", // John Smith
        firstName: "John",
        lastName: "Smith",
        gender: "Male",
        phone: "+254711223351",
        address: "130 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1982-02-14"),
        imageUrl: "/images/img-p8.png",
        nextOfKin: "Catherine Doe",
        nextOfKinPhoneNo: "+254712345685",
        emergencyContact: "+254711223351",
    },
    {
        profileId: "1a2b3c4d-0921-5678-90ab-1234567890ab",
        userId: "b78d23c4-0921-5678-90ab-fec4b6a6442b", // Phil Foden
        firstName: "Phil",
        lastName: "Foden",
        gender: "Male",
        phone: "+254711223352",
        address: "131 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1995-10-20"),
        imageUrl: "/images/img-p1.png",
        nextOfKin: "Sandra Doe",
        nextOfKinPhoneNo: "+254712345686",
        emergencyContact: "+254711223352",
    },
    {
        profileId: "1a2b3c4d-7625-5678-90ab-1234567890ab",
        userId: "b78d23c4-7625-5678-90ab-fec4b6a6442b", // Xabi Alonso
        firstName: "Xabi",
        lastName: "Alonso",
        gender: "Male",
        phone: "+254711223353",
        address: "132 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1990-12-01"),
        imageUrl: "/images/img-p2.png",
        nextOfKin: "Paul Doe",
        nextOfKinPhoneNo: "+254712345687",
        emergencyContact: "+254711223353",
    },
    {
        profileId: "1a2b3c4d-4698-2147-45kg-1234567890ab",
        userId: "b78d23c4-4698-2147-45kg-fec4b6a6442b", // Silva
        firstName: "Silva",
        lastName: "Santos",
        gender: "Male",
        phone: "+254711223354",
        address: "133 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1994-01-15"),
        imageUrl: "/images/img-p3.png",
        nextOfKin: "Marcus Doe",
        nextOfKinPhoneNo: "+254712345688",
        emergencyContact: "+254711223354",
    },
    {
        profileId: "1a2b3c4d-f478-9426-lo48-1234567890ab",
        userId: "b78d23c4-f478-9426-lo48-fec4b6a6442b", // Stanley
        firstName: "Stanley",
        lastName: "Kubrick",
        gender: "Male",
        phone: "+254711223355",
        address: "134 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1988-04-04"),
        imageUrl: "/images/img-p4.png",
        nextOfKin: "Alicia Doe",
        nextOfKinPhoneNo: "+254712345689",
        emergencyContact: "+254711223355",
    },
    {
        profileId: "1a2b3c4d-8332-5678-90ab-1234567890ab",
        userId: "b78d23c4-8332-5678-90ab-fec4b6a6442b", // Mikel Arteta
        firstName: "Mikel",
        lastName: "Arteta",
        gender: "Male",
        phone: "+254711223356",
        address: "135 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1986-05-30"),
        imageUrl: "/images/img-p5.png",
        nextOfKin: "Martin Doe",
        nextOfKinPhoneNo: "+254712345690",
        emergencyContact: "+254711223356",
    },
    {
        profileId: "1a2b3c4d-g458-3654-4598-1234567890ab",
        userId: "b78d23c4-g458-3654-4598-fec4b6a6442b", // Kante
        firstName: "N'Golo",
        lastName: "Kante",
        gender: "Male",
        phone: "+254711223357",
        address: "136 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1991-03-29"),
        imageUrl: "/images/img-p6.png",
        nextOfKin: "Simon Doe",
        nextOfKinPhoneNo: "+254712345691",
        emergencyContact: "+254711223357",
    },
    {
        profileId: "1a2b3c4d-79p6-5698-4469-1234567890ab",
        userId: "b78d23c4-79p6-5698-4469-fec4b6a6442b", // Linda
        firstName: "Linda",
        lastName: "Moore",
        gender: "Female",
        phone: "+254711223358",
        address: "137 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1993-08-14"),
        imageUrl: "/images/img-p7.png",
        nextOfKin: "Laura Doe",
        nextOfKinPhoneNo: "+254712345692",
        emergencyContact: "+254711223358",
    },
    {
        profileId: "1a2b3c4d-5896-7789-hg88-1234567890ab",
        userId: "b78d23c4-5896-7789-hg88-fec4b6a6442b", // Riley
        firstName: "Riley",
        lastName: "Brown",
        gender: "Female",
        phone: "+254711223359",
        address: "138 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1992-12-02"),
        imageUrl: "/images/img-p8.png",
        nextOfKin: "George Doe",
        nextOfKinPhoneNo: "+254712345693",
        emergencyContact: "+254711223359",
    },
    {
        profileId: "1a2b3c4d-0097-5678-90ab-1234567890ab",
        userId: "b78d23c4-0097-5678-90ab-fec4b6a6442b", // Kimberly
        firstName: "Kimberly",
        lastName: "Adams",
        gender: "Female",
        phone: "+254711223360",
        address: "139 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1987-07-07"),
        imageUrl: "/images/img-p1.png",
        nextOfKin: "Charles Doe",
        nextOfKinPhoneNo: "+254712345694",
        emergencyContact: "+254711223360",
    },
    {
        profileId: "1a2b3c4d-4565-7845-80ab-1234567890ab",
        userId: "b78d23c4-4565-7845-80ab-fec4b6a6442b", // Lilian
        firstName: "Lilian",
        lastName: "Clark",
        gender: "Female",
        phone: "+254711223361",
        address: "140 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1989-10-10"),
        imageUrl: "/images/img-p2.png",
        nextOfKin: "Rebecca Doe",
        nextOfKinPhoneNo: "+254712345695",
        emergencyContact: "+254711223361",
    },
    {
        profileId: "1a2b3c4d-jh85-4589-2569-1234567890ab",
        userId: "b78d23c4-jh85-4589-2569-fec4b6a6442b", // Wendy
        firstName: "Wendy",
        lastName: "Evans",
        gender: "Female",
        phone: "+254711223362",
        address: "141 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1994-11-19"),
        imageUrl: "/images/img-p3.png",
        nextOfKin: "Chris Doe",
        nextOfKinPhoneNo: "+254712345696",
        emergencyContact: "+254711223362",
    },
    {
        profileId: "1a2b3c4d-4569-k475-5216-1234567890ab",
        userId: "b78d23c4-4569-k475-5216-fec4b6a6442b", // Staff1
        firstName: "John",
        lastName: "Doe",
        gender: "Male",
        phone: "+254711223363",
        address: "142 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1978-06-30"),
        imageUrl: "/images/img-p4.png",
        nextOfKin: "Jane Doe",
        nextOfKinPhoneNo: "+254712345697",
        emergencyContact: "+254711223363",
    },
    {
        profileId: "1a2b3c4d-3158-2987-d485-1234567890ab",
        userId: "b78d23c4-3158-2987-d485-fec4b6a6442b", // Staff2
        firstName: "Paul",
        lastName: "Jones",
        gender: "Male",
        phone: "+254711223364",
        address: "143 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1985-02-15"),
        imageUrl: "/images/img-p5.png",
        nextOfKin: "Laura Doe",
        nextOfKinPhoneNo: "+254712345698",
        emergencyContact: "+254711223364",
    },
    {
        profileId: "1a2b3c4d-6789-4369-7269-1234567890ab",
        userId: "b78d23c4-6789-4369-7269-fec4b6a6442b", // Staff3
        firstName: "Mark",
        lastName: "Wilson",
        gender: "Male",
        phone: "+254711223365",
        address: "144 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1983-11-11"),
        imageUrl: "/images/img-p6.png",
        nextOfKin: "Sophia Doe",
        nextOfKinPhoneNo: "+254712345699",
        emergencyContact: "+254711223365",
    },
    {
        profileId: "1a2b3c4d-h469-9726-v236-1234567890ab",
        userId: "b78d23c4-h469-9726-v236-fec4b6a6442b", // Staff4
        firstName: "Lucy",
        lastName: "White",
        gender: "Female",
        phone: "+254711223366",
        address: "145 Nairobi Street, Nairobi, Kenya",
        dateOfBirth: new Date("1991-09-09"),
        imageUrl: "/images/img-p7.png",
        nextOfKin: "Megan Doe",
        nextOfKinPhoneNo: "+254712345700",
        emergencyContact: "+254711223366",
    },
];

module.exports = {
    hospitals,
    users,
    departments,
    services,
    superAdmins,
    admins,
    doctors,
    nurses,
    staff,
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
