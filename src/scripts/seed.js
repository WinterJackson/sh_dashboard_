// app/scripts/seed.js file

const prisma = require("../lib/prisma");

const bcrypt = require("bcrypt");
const {
    hospitals,
    departments,
    hospitalDepartments,
    services,
    departmentServices,
    users,
    notifications,
    notificationSettings,
    profiles,
    superAdmins,
    admins,
    patients,
    medicalInformations,
    doctors,
    doctorLicenses,
    doctorReviews,
    nurses,
    staff,
    beds,
    appointments,
    payments,
    referrals,
    doctorReferrals,
    appointmentServices,
    serviceUsages,
    doctorEarnings,
    sessions,
    verificationTokens,
    roleConstraints,
    specializations,
} = require("../lib/placeholder-data");

// Helper function to generate random dates
function randomPastDate(daysBack = 365) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * daysBack));
    return pastDate;
}

async function seedSpecializations() {
    try {
        await prisma.specialization.createMany({
            data: specializations.map((spec) => ({
                specializationId: spec.specializationId,
                name: spec.name,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded specializations`);
    } catch (error) {
        console.error("Error seeding specializations:", error);
        throw error;
    }
}

async function seedHospitals() {
    try {
        await prisma.hospital.createMany({
            data: hospitals.map((hospital) => ({
                hospitalId: hospital.hospitalId,
                name: hospital.name,
                phone: hospital.phone,
                email: hospital.email,
                country: hospital.country,
                city: hospital.city,
                referralCode: hospital.referralCode,
                website: hospital.website,
                logoUrl: hospital.logoUrl,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded hospitals`);
    } catch (error) {
        console.error("Error seeding hospitals:", error);
        throw error;
    }
}

async function seedDepartments() {
    try {
        await prisma.department.createMany({
            data: departments.map((department) => ({
                departmentId: department.departmentId,
                name: department.name,
                description: department.description,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded departments`);
    } catch (error) {
        console.error("Error seeding departments:", error);
        throw error;
    }
}

async function seedHospitalDepartments() {
    try {
        await prisma.hospitalDepartment.createMany({
            data: hospitalDepartments.map((hospitalDepartment) => ({
                hospitalId: hospitalDepartment.hospitalId,
                departmentId: hospitalDepartment.departmentId,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded hospital departments`);
    } catch (error) {
        console.error("Error seeding hospital departments:", error);
        throw error;
    }
}

async function seedServices() {
    try {
        await prisma.service.createMany({
            data: services.map((service) => ({
                serviceId: service.serviceId,
                serviceName: service.serviceName,
                type: service.type,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded services`);
    } catch (error) {
        console.error("Error seeding services:", error);
        throw error;
    }
}

async function seedDepartmentServices() {
    try {
        await prisma.departmentService.createMany({
            data: departmentServices.map((departmentService) => ({
                departmentId: departmentService.departmentId,
                serviceId: departmentService.serviceId,
                price: departmentService.price,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded department services`);
    } catch (error) {
        const truncatedData =
            JSON.stringify(error, null, 2).slice(0, 1000) + "...";

        console.error("Error seeding department services:", truncatedData);
        throw truncatedData;
    }
}

async function seedUsers() {
    try {
        await prisma.user.createMany({
            data: await Promise.all(
                users.map(async (user) => ({
                    userId: user.userId,
                    username: user.username,
                    email: user.email,
                    password: await bcrypt.hash(user.password, 10),
                    role: user.role,
                    hospitalId: user.hospitalId,
                    isActive: user.isActive,
                    lastLogin: user.lastLogin,
                    mustResetPassword: false,
                    resetToken: null,
                    resetTokenExpiry: null,
                    createdAt: randomPastDate(730),
                    updatedAt: randomPastDate(365),
                }))
            ),
            skipDuplicates: true,
        });
        console.log(`Seeded users`);
    } catch (error) {
        console.error("Error seeding users:", error);
        throw error;
    }
}

async function seedNotifications() {
    try {
        await prisma.notification.createMany({
            data: notifications.map((notification) => ({
                notificationId: notification.notificationId,
                userId: notification.userId,
                type: notification.type,
                message: notification.message,
                isRead: notification.isRead,
                metadata: notification.metadata,
                createdAt: notification.createdAt,
                updatedAt: notification.updatedAt,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded notifications`);
    } catch (error) {
        console.error("Error seeding notifications:", error);
        throw error;
    }
}

async function seedNotificationSettings() {
    try {
        await prisma.notificationSettings.createMany({
            data: notificationSettings.map((settings) => ({
                notificationSettingsId: settings.notificationSettingsId,
                userId: settings.userId,
                appointmentAlerts: settings.appointmentAlerts,
                emailAlerts: settings.emailAlerts,
                securityAlerts: settings.securityAlerts,
                systemUpdates: settings.systemUpdates,
                newDeviceLogin: settings.newDeviceLogin,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded notification settings`);
    } catch (error) {
        console.error("Error seeding notification settings:", error);
        throw error;
    }
}

async function seedProfiles() {
    try {
        await prisma.profile.createMany({
            data: profiles.map((profile) => ({
                profileId: profile.profileId,
                userId: profile.userId,
                firstName: profile.firstName,
                lastName: profile.lastName,
                gender: profile.gender,
                phoneNo: profile.phoneNo,
                address: profile.address,
                dateOfBirth: profile.dateOfBirth,
                city: profile.city,
                state: profile.state,
                imageUrl: profile.imageUrl,
                nextOfKin: profile.nextOfKin,
                nextOfKinPhoneNo: profile.nextOfKinPhoneNo,
                emergencyContact: profile.emergencyContact,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded profiles`);
    } catch (error) {
        console.error("Error seeding profiles:", error);
        throw error;
    }
}

async function seedSuperAdmins() {
    try {
        await prisma.superAdmin.createMany({
            data: superAdmins.map((superAdmin) => ({
                superAdminId: superAdmin.superAdminId,
                userId: superAdmin.userId,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded super admins`);
    } catch (error) {
        console.error("Error seeding super admins:", error);
        throw error;
    }
}

async function seedAdmins() {
    try {
        await prisma.admin.createMany({
            data: admins.map((admin) => ({
                adminId: admin.adminId,
                userId: admin.userId,
                hospitalId: admin.hospitalId,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded admins`);
    } catch (error) {
        console.error("Error seeding admins:", error);
        throw error;
    }
}

async function seedPatients() {
    try {
        await prisma.patient.createMany({
            data: patients.map((patient) => ({
                patientId: patient.patientId,
                hospitalId: patient.hospitalId,
                name: patient.name,
                phoneNo: patient.phoneNo,
                email: patient.email,
                dateOfBirth: patient.dateOfBirth,
                gender: patient.gender,
                reasonForConsultation: patient.reasonForConsultation,
                admissionDate: patient.admissionDate,
                dischargeDate: patient.dischargeDate,
                status: patient.status,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded patients`);
    } catch (error) {
        console.error("Error seeding patients:", error);
        throw error;
    }
}

async function seedMedicalInformations() {
    try {
        await prisma.medicalInformation.createMany({
            data: medicalInformations.map((medicalInformation) => ({
                infoId: medicalInformation.infoId,
                patientId: medicalInformation.patientId,
                height: medicalInformation.height,
                weight: medicalInformation.weight,
                bloodGroup: medicalInformation.bloodGroup,
                allergies: medicalInformation.allergies,
                bmi: medicalInformation.bmi,
                bodyType: medicalInformation.bodyType,
                alcohol: medicalInformation.alcohol,
                drugs: medicalInformation.drugs,
                createdAt: medicalInformation.createdAt,
                updatedAt: medicalInformation.updatedAt,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded MedicalInformation`);
    } catch (error) {
        console.error("Error seeding MedicalInformation:", error);
        throw error;
    }
}

async function seedDoctors() {
    try {
        await prisma.doctor.createMany({
            data: doctors.map((doctor) => ({
                doctorId: doctor.doctorId,
                userId: doctor.userId,
                hospitalId: doctor.hospitalId,
                departmentId: doctor.departmentId,
                serviceId: doctor.serviceId,
                specializationId: doctor.specializationId,
                qualifications: doctor.qualifications,
                about: doctor.about,
                status: doctor.status,
                phoneNo: doctor.phoneNo,
                workingHours: doctor.workingHours,
                averageRating: doctor.averageRating,
                skills: doctor.skills || [],
                bio: doctor.bio,
                yearsOfExperience: doctor.yearsOfExperience,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded doctors`);
    } catch (error) {
        console.error("Error seeding doctors:", error);
        throw error;
    }
}

async function seedDoctorLicenses() {
    try {
        await prisma.doctorLicense.createMany({
            data: doctorLicenses.map((doctorLicense) => ({
                licenseId: doctorLicense.licenseId,
                doctorId: doctorLicense.doctorId,
                name: doctorLicense.name,
                licenseNumber: doctorLicense.licenseNumber,
                issueDate: doctorLicense.issueDate,
                expiryDate: doctorLicense.expiryDate,
                issuingAuthority: doctorLicense.issuingAuthority,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded licenses`);
    } catch (error) {
        console.error("Error seeding licenses:", error);
        throw error;
    }
}

async function seedDoctorReviews() {
    try {
        await prisma.doctorReview.createMany({
            data: doctorReviews.map((doctorReview) => ({
                reviewId: doctorReview.reviewId,
                doctorId: doctorReview.doctorId,
                patientId: doctorReview.patientId,
                rating: doctorReview.rating,
                comment: doctorReview.comment,
                createdAt: doctorReview.createdAt,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded reviews`);
    } catch (error) {
        console.error("Error seeding reviews:", error);
        throw error;
    }
}

async function seedNurses() {
    try {
        await prisma.nurse.createMany({
            data: nurses.map((nurse) => ({
                nurseId: nurse.nurseId,
                userId: nurse.userId,
                hospitalId: nurse.hospitalId,
                departmentId: nurse.departmentId,
                specializationId: nurse.specializationId,
                status: nurse.status,
                phoneNo: nurse.phoneNo,
                workingHours: nurse.workingHours,
                averageRating: nurse.averageRating,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded nurses`);
    } catch (error) {
        console.error("Error seeding nurses:", error);
        throw error;
    }
}

async function seedStaff() {
    try {
        await prisma.staff.createMany({
            data: staff.map((staff) => ({
                staffId: staff.staffId,
                userId: staff.userId,
                hospitalId: staff.hospitalId,
                departmentId: staff.departmentId,
                specializationId: staff.specializationId,
                status: staff.status,
                phoneNo: staff.phoneNo,
                workingHours: staff.workingHours,
                averageRating: staff.averageRating,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded staff`);
    } catch (error) {
        console.error("Error seeding staff:", error);
        throw error;
    }
}

async function seedBeds() {
    try {
        await prisma.bed.createMany({
            data: beds.map((bed) => ({
                bedId: bed.bedId,
                hospitalId: bed.hospitalId,
                patientId: bed.patientId,
                type: bed.type, // e.g., ICU, General
                ward: bed.ward,
                availability: bed.availability, // e.g., Occupied, Available
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded beds`);
    } catch (error) {
        console.error("Error seeding beds:", error);
        throw error;
    }
}

async function seedAppointments() {
    try {
        await prisma.appointment.createMany({
            data: appointments.map((appointment) => ({
                appointmentId: appointment.appointmentId,
                doctorId: appointment.doctorId,
                patientId: appointment.patientId,
                hospitalId: appointment.hospitalId,
                appointmentDate: appointment.appointmentDate,
                type: appointment.type,
                action: appointment.action,
                status: appointment.status, // (Pending, Confirmed, Completed, Cancelled)
                consultationFee: appointment.consultationFee,
                treatment: appointment.treatment,
                isPaid: appointment.isPaid,
                paymentId: appointment.paymentId,
                completed: appointment.completed,
                isVideoStarted: appointment.isVideoStarted,
                commissionPercentage: appointment.commissionPercentage,
                appointmentEndAt: appointment.appointmentEndAt,
                appointmentReminderSent: appointment.appointmentReminderSent,
                appointmentReminderSentLTF:
                    appointment.appointmentReminderSentLTF,
                doctorAppointmentNotes: appointment.doctorAppointmentNotes,
                patientAppointmentNotes: appointment.patientAppointmentNotes,
                reasonForVisit: appointment.reasonForVisit,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded appointments`);
    } catch (error) {
        console.error("Error seeding appointments:", error.message);
        throw error;
    }
}

async function seedPayments() {
    try {
        await prisma.payment.createMany({
            data: payments.map((payment) => ({
                paymentId: payment.paymentId,
                patientId: payment.patientId,
                serviceId: payment.serviceId,
                hospitalId: payment.hospitalId,
                appointmentId: payment.appointmentId,
                amount: payment.amount,
                createdAt: payment.createdAt,
                updatedAt: payment.updatedAt,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded payments`);
    } catch (error) {
        const truncatedData =
            JSON.stringify(error.message, null, 2).slice(0, 500) + "...";

        console.error("Error seeding payments:", truncatedData);
        throw truncatedData;
    }
}

async function seedReferrals() {
    try {
        await prisma.referral.createMany({
            data: referrals.map((referral) => ({
                referralId: referral.referralId,
                patientId: referral.patientId,
                hospitalId: referral.hospitalId,
                effectiveDate: referral.effectiveDate,
                type: referral.type,
                primaryCareProvider: referral.primaryCareProvider,
                referralAddress: referral.referralAddress,
                referralPhone: referral.referralPhone,
                reasonForConsultation: referral.reasonForConsultation,
                diagnosis: referral.diagnosis,
                physicianName: referral.physicianName,
                physicianDepartment: referral.physicianDepartment,
                physicianSpecialty: referral.physicianSpecialty,
                physicianEmail: referral.physicianEmail,
                physicianPhoneNumber: referral.physicianPhoneNumber,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded referrals`);
    } catch (error) {
        const truncatedData =
            JSON.stringify(error.message, null, 2).slice(0, 500) + "...";

        console.error("Error seeding payments:", truncatedData);
        throw truncatedData;
    }
}

async function seedDoctorReferrals() {
    try {
        await prisma.doctorReferral.createMany({
            data: doctorReferrals.map((doctorReferral) => ({
                doctorId: doctorReferral.doctorId,
                referralId: doctorReferral.referralId,
                patientId: doctorReferral.patientId,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded doctor referrals`);
    } catch (error) {
        console.error("Error seeding doctor referrals:", error);
        throw error;
    }
}

async function seedAppointmentServices() {
    try {
        await prisma.appointmentService.createMany({
            data: appointmentServices.map((appointmentService) => ({
                appointmentId: appointmentService.appointmentId,
                serviceId: appointmentService.serviceId,
                patientId: appointmentService.patientId,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded appointment services`);
    } catch (error) {
        console.error("Error seeding appointment services:", error);
        throw error;
    }
}

async function seedServiceUsages() {
    try {
        await prisma.serviceUsage.createMany({
            data: serviceUsages.map((serviceUsage) => ({
                usageId: serviceUsage.usageId,
                serviceId: serviceUsage.serviceId,
                patientId: serviceUsage.patientId,
                date: serviceUsage.date,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded service usages`);
    } catch (error) {
        console.error("Error seeding service usages:", error);
        throw error;
    }
}

async function seedDoctorEarnings() {
    try {
        await prisma.doctorEarning.createMany({
            data: doctorEarnings.map((doctorEarning) => ({
                earningsId: doctorEarning.earningsId,
                doctorId: doctorEarning.doctorId,
                date: doctorEarning.date,
                amount: doctorEarning.amount,
                description: doctorEarning.description,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded doctor earnings`);
    } catch (error) {
        console.error("Error seeding doctor earnings:", error);
        throw error;
    }
}

async function seedSessions() {
    try {
        await prisma.session.createMany({
            data: sessions.map((session) => ({
                sessionId: session.sessionId,
                sessionToken: session.sessionToken,
                userId: session.userId,
                expires: session.expires,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded sessions`);
    } catch (error) {
        console.error("Error seeding sessions:", error);
        throw error;
    }
}

async function seedVerificationTokens() {
    try {
        await prisma.verificationToken.createMany({
            data: verificationTokens.map((verificationToken) => ({
                tokenId: verificationToken.tokenId,
                identifier: verificationToken.identifier,
                token: verificationToken.token,
                expires: verificationToken.expires,
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded verification tokens`);
    } catch (error) {
        console.error("Error seeding verification tokens:", error);
        throw error;
    }
}

// async function seedRoleConstraints() {
//     try {
//         await prisma.roleConstraints.create({
//             data: {
//                 constraintId: roleConstraints[0].constraintId,
//                 role: roleConstraints[0].role,
//                 count: roleConstraints[0].count,
//             },
//         });
//         console.log(`Seeded role constraint`);
//     } catch (error) {
//         console.error("Error seeding role constraint:", error);
//         throw error;
//     }
// }

async function main() {
    // Seed database
    await seedSpecializations();
    await seedHospitals();
    await seedDepartments();
    await seedHospitalDepartments();
    await seedServices();
    await seedDepartmentServices();
    await seedUsers();
    await seedNotifications();
    await seedNotificationSettings();
    await seedProfiles();
    await seedSuperAdmins();
    await seedAdmins();
    await seedPatients();
    await seedMedicalInformations();
    await seedDoctors();
    await seedDoctorLicenses();
    await seedDoctorReviews();
    await seedNurses();
    await seedStaff();
    await seedBeds();
    await seedAppointments();
    await seedPayments();
    await seedReferrals();
    await seedDoctorReferrals();
    await seedAppointmentServices();
    await seedServiceUsages();
    await seedDoctorEarnings();
    await seedSessions();
    await seedVerificationTokens();
    // await seedRoleConstraints();
}

main()
    .catch((e) => {
        console.error(
            "An error occurred while attempting to seed the database:",
            e
        );
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
