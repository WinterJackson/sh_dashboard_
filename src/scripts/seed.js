// app/scripts/seed.js file

import prisma from "../lib/prisma.js";

import bcrypt from "bcrypt";
import {
    hospitals,
    bedCapacityRecords,
    beds,
    specializations,
    departments,
    departmentSpecializations,
    hospitalDepartments,
    services,
    departmentServices,
    hospitalServices,
    users,
    notifications,
    notificationSettings,
    profiles,
    superAdmins,
    admins,
    doctors,
    doctorLicenses,
    doctorReviews,
    nurses,
    staff,
    patients,
    conversations,
    conversationParticipants,
    messages,
    medicalInformations,
    appointments,
    appointmentNotes,
    payments,
    referrals,
    referralDocuments,
    referralDoctors,
    transportations,
    appointmentServices,
    serviceUsages,
    doctorEarnings,
    sessions,
    verificationTokens,
    roleConstraints,
} from "../lib/placeholder-data.js";

// Helper function to generate random dates
function randomPastDate(daysBack = 365) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * daysBack));
    return pastDate;
}

async function seedHospitals() {
    try {
        await prisma.hospital.createMany({
            data: hospitals.map((hospital) => ({
                hospitalId: hospital.hospitalId,
                hospitalName: hospital.hospitalName,
                hospitalLink: hospital.hospitalLink,
                phone: hospital.phone,
                email: hospital.email,
                kephLevel: hospital.kephLevel,
                regulatoryBody: hospital.regulatoryBody,
                ownershipType: hospital.ownershipType,
                facilityType: hospital.facilityType,
                nhifAccreditation: hospital.nhifAccreditation,
                open24Hours: hospital.open24Hours,
                openWeekends: hospital.openWeekends,
                regulated: hospital.regulated,
                regulationStatus: hospital.regulationStatus,
                regulatingBody: hospital.regulatingBody,
                registrationNumber: hospital.registrationNumber,
                licenseNumber: hospital.licenseNumber,
                category: hospital.category,
                owner: hospital.owner,
                county: hospital.county,
                subCounty: hospital.subCounty,
                ward: hospital.ward,
                latitude: hospital.latitude,
                longitude: hospital.longitude,
                town: hospital.town,
                streetAddress: hospital.streetAddress,
                referralCode: hospital.referralCode,
                description: hospital.description,
                emergencyPhone: hospital.emergencyPhone,
                emergencyEmail: hospital.emergencyEmail,
                website: hospital.website,
                logoUrl: hospital.logoUrl,
                operatingHours: hospital.operatingHours,
                nearestLandmark: hospital.nearestLandmark,
                plotNumber: hospital.plotNumber,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded hospitals`);
    } catch (error) {
        console.error("Error seeding hospitals:", error);
        throw error;
    }
}

async function seedSpecializations() {
    try {
        const result = await prisma.specialization.createMany({
            data: specializations.map((specialization) => ({
                specializationId: specialization.specializationId,
                name: specialization.name,
                description: specialization.description,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });
        const count = await prisma.specialization.count();
        console.log(`Seeded specializations. Total in DB: ${count}`);
    } catch (error) {
        console.error("Error seeding specializations:", error);
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
                type: department.type,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded departments`);
    } catch (error) {
        console.error("Error seeding departments:", error);
        throw error;
    }
}

async function seedDepartmentSpecializations() {
    try {
        const existingSpecializations = await prisma.specialization.findMany({
            select: { specializationId: true },
        });
        const validSpecIds = new Set(
            existingSpecializations.map((s) => s.specializationId)
        );

        const filtered = departmentSpecializations.filter((ds) =>
            validSpecIds.has(ds.specializationId)
        );

        await prisma.departmentSpecialization.createMany({
            data: filtered.map((ds) => ({
                departmentId: ds.departmentId,
                specializationId: ds.specializationId,
                createdAt: ds.createdAt || randomPastDate(),
                updatedAt: ds.updatedAt || randomPastDate(),
            })),
            skipDuplicates: true,
        });

        const count = await prisma.departmentSpecialization.count();
        console.log(`Seeded department specializations. Total in DB: ${count}`);
    } catch (error) {
        console.error("Error seeding department specializations:", error);
        throw error;
    }
}

async function seedHospitalDepartments() {
    try {
        await prisma.hospitalDepartment.createMany({
            data: hospitalDepartments.map((hospitalDepartment) => ({
                hospitalId: hospitalDepartment.hospitalId,
                departmentId: hospitalDepartment.departmentId,
                headOfDepartment: hospitalDepartment.headOfDepartment,
                contactEmail: hospitalDepartment.contactEmail,
                contactPhone: hospitalDepartment.contactPhone,
                location: hospitalDepartment.location,
                establishedYear: hospitalDepartment.establishedYear,
                description: hospitalDepartment.description,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });
        console.log("Seeded hospital departments");
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
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
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
        // Fetch existing departments and services for validation
        const existingDepartments = await prisma.department.findMany({
            select: { departmentId: true },
        });
        const existingServices = await prisma.service.findMany({
            select: { serviceId: true },
        });

        const validDeptIds = new Set(
            existingDepartments.map((d) => d.departmentId)
        );
        const validServiceIds = new Set(
            existingServices.map((s) => s.serviceId)
        );

        const filtered = departmentServices.filter(
            (ds) =>
                validDeptIds.has(ds.departmentId) &&
                validServiceIds.has(ds.serviceId)
        );

        await prisma.departmentService.createMany({
            data: filtered.map((ds) => ({
                departmentId: ds.departmentId,
                serviceId: ds.serviceId,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });

        const count = await prisma.departmentService.count();
        console.log(`Seeded department services. Total in DB: ${count}`);
    } catch (error) {
        console.error("Error seeding department services:", error);
        throw error;
    }
}

async function seedHospitalServices() {
    try {
        await prisma.hospitalService.createMany({
            data: hospitalServices.map((hospitalService) => ({
                hospitalId: hospitalService.hospitalId,
                departmentId: hospitalService.departmentId,
                serviceId: hospitalService.serviceId,
                maxAppointmentsPerDay:
                    hospitalService.maxAppointmentsPerDay || null,
                requiresReferral: hospitalService.requiresReferral || false,
                isWalkInAllowed: hospitalService.isWalkInAllowed || true,
                basePrice: hospitalService.basePrice || null,
                discount: hospitalService.discount || null,
                equipmentRequired: hospitalService.equipmentRequired || null,
                minStaffRequired: hospitalService.minStaffRequired || null,
                duration: hospitalService.duration || null,
                createdAt: hospitalService.createdAt || randomPastDate(),
                updatedAt: hospitalService.updatedAt || randomPastDate(),
            })),
            skipDuplicates: true,
        });
        console.log("Seeded hospital services");
    } catch (error) {
        console.error("Error seeding hospital services:", error);
        throw error;
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
                    hospitalId: user.hospitalId || null,
                    isActive: user.isActive,
                    lastLogin: user.lastLogin || null,
                    resetToken: user.resetToken || null,
                    mustResetPassword: user.mustResetPassword || false,
                    resetTokenExpiry: user.resetTokenExpiry || null,
                    twoFactorEnabled: user.twoFactorEnabled || false,
                    autoLogoutTimeout: user.autoLogoutTimeout || 30,
                    hasCompletedOnboarding: user.hasCompletedOnboarding,
                    createdAt: user.createdAt || randomPastDate(730),
                    updatedAt: user.updatedAt || randomPastDate(365),
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
        const existingUsers = await prisma.user.findMany({
            select: { userId: true },
        });
        const validUserIds = new Set(existingUsers.map((u) => u.userId));

        const filtered = notifications.filter((n) =>
            validUserIds.has(n.userId)
        );

        await prisma.notification.createMany({
            data: filtered.map((notification) => ({
                notificationId: notification.notificationId,
                userId: notification.userId,
                type: notification.type,
                message: notification.message,
                isRead: notification.isRead || false,
                metadata: notification.metadata || {},
                actionUrl: notification.actionUrl || null,
                createdAt: notification.createdAt || randomPastDate(365),
                updatedAt: notification.updatedAt || randomPastDate(180),
            })),
            skipDuplicates: true,
        });

        const count = await prisma.notification.count();
        console.log(`Seeded notifications. Total in DB: ${count}`);
    } catch (error) {
        console.error("Error seeding notifications:", error);
        throw error;
    }
}

async function seedNotificationSettings() {
    try {
        const existingUsers = await prisma.user.findMany({
            select: { userId: true },
        });
        const validUserIds = new Set(existingUsers.map((u) => u.userId));

        const filtered = notificationSettings.filter((n) =>
            validUserIds.has(n.userId)
        );

        await prisma.notificationSettings.createMany({
            data: filtered.map((settings) => ({
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

        const count = await prisma.notificationSettings.count();
        console.log(`Seeded notification settings. Total in DB: ${count}`);
    } catch (error) {
        console.error("Error seeding notification settings:", error);
        throw error;
    }
}

async function seedProfiles() {
    try {
        const existingUsers = await prisma.user.findMany({
            select: { userId: true },
        });
        const validUserIds = new Set(existingUsers.map((u) => u.userId));

        const filtered = profiles.filter((p) => validUserIds.has(p.userId));

        await prisma.profile.createMany({
            data: filtered.map((profile) => ({
                profileId: profile.profileId,
                userId: profile.userId,
                firstName: profile.firstName,
                lastName: profile.lastName,
                gender: profile.gender,
                phoneNo: profile.phoneNo,
                address: profile.address,
                dateOfBirth: profile.dateOfBirth,
                cityOrTown: profile.cityOrTown,
                county: profile.county,
                imageUrl: profile.imageUrl,
                nextOfKin: profile.nextOfKin,
                nextOfKinPhoneNo: profile.nextOfKinPhoneNo,
                emergencyContact: profile.emergencyContact,
            })),
            skipDuplicates: true,
        });

        const count = await prisma.profile.count();
        console.log(`Seeded profiles. Total in DB: ${count}`);
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
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
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
        const existingUsers = await prisma.user.findMany({
            select: { userId: true },
        });
        const validUserIds = new Set(existingUsers.map((u) => u.userId));

        const filtered = admins.filter((a) => validUserIds.has(a.userId));

        await prisma.admin.createMany({
            data: filtered.map((admin) => ({
                adminId: admin.adminId,
                userId: admin.userId,
                hospitalId: admin.hospitalId,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });

        const count = await prisma.admin.count();
        console.log(`Seeded admins. Total in DB: ${count}`);
    } catch (error) {
        console.error("Error seeding admins:", error);
        throw error;
    }
}

async function seedPatients() {
    try {
        const existingUsers = await prisma.user.findMany({
            select: { userId: true },
        });
        const validUserIds = new Set(existingUsers.map((u) => u.userId));

        const filtered = patients.filter((p) => validUserIds.has(p.userId));

        await prisma.patient.createMany({
            data: filtered.map((patient) => ({
                patientId: patient.patientId,
                userId: patient.userId,
                hospitalId: patient.hospitalId,
                maritalStatus: patient.maritalStatus || null,
                occupation: patient.occupation || null,
                nextOfKinName: patient.nextOfKinName || null,
                nextOfKinRelationship: patient.nextOfKinRelationship || null,
                nextOfKinHomeAddress: patient.nextOfKinHomeAddress || null,
                nextOfKinPhoneNo: patient.nextOfKinPhoneNo || null,
                nextOfKinEmail: patient.nextOfKinEmail || null,
                reasonForConsultation: patient.reasonForConsultation,
                admissionDate: patient.admissionDate || null,
                dischargeDate: patient.dischargeDate || null,
                status: patient.status,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });

        const count = await prisma.patient.count();
        console.log(`Seeded patients. Total in DB: ${count}`);
    } catch (error) {
        console.error("Error seeding patients:", error);
        throw error;
    }
}

async function seedConversations() {
    try {
        const validAppointmentIds = new Set(
            (
                await prisma.appointment.findMany({
                    select: { appointmentId: true },
                })
            ).map((a) => a.appointmentId)
        );

        const validHospitalIds = new Set(
            (
                await prisma.hospital.findMany({ select: { hospitalId: true } })
            ).map((h) => h.hospitalId)
        );

        const skipped = [];

        const filtered = conversations.filter((c) => {
            const isValid =
                validAppointmentIds.has(c.appointmentId) &&
                validHospitalIds.has(c.hospitalId);
            if (!isValid) skipped.push(c);
            return isValid;
        });

        await prisma.conversation.createMany({
            data: filtered.map((c) => ({
                conversationId: c.conversationId,
                appointmentId: c.appointmentId,
                hospitalId: c.hospitalId,
                subject: c.subject || null,
                status: c.status || "ACTIVE",
                lastMessageAt: c.lastMessageAt || null,
                createdAt: c.createdAt || randomPastDate(),
                updatedAt: c.updatedAt || randomPastDate(),
            })),
            skipDuplicates: true,
        });

        console.log(
            `Seeded conversations. Skipped ${skipped.length} invalid records.`
        );
        if (skipped.length > 0) {
            console.log("Skipped conversation records:", skipped);
        }
    } catch (error) {
        console.error("Error seeding conversations:", error);
        throw error;
    }
}

async function seedConversationParticipants() {
    try {
        const validUserIds = new Set(
            (await prisma.user.findMany({ select: { userId: true } })).map(
                (u) => u.userId
            )
        );

        const validConversationIds = new Set(
            (
                await prisma.conversation.findMany({
                    select: { conversationId: true },
                })
            ).map((c) => c.conversationId)
        );

        const skipped = [];

        const filtered = conversationParticipants.filter((cp) => {
            const isValid =
                validUserIds.has(cp.userId) &&
                validConversationIds.has(cp.conversationId);
            if (!isValid) skipped.push(cp);
            return isValid;
        });

        await prisma.conversationParticipant.createMany({
            data: filtered.map((cp) => ({
                conversationId: cp.conversationId,
                hospitalId: cp.hospitalId,
                appointmentId: cp.appointmentId,
                userId: cp.userId,
                joinedAt: cp.joinedAt || randomPastDate(),
                participantRole: cp.participantRole || null,
            })),
            skipDuplicates: true,
        });

        console.log(
            `Seeded conversation participants. Skipped ${skipped.length} invalid records.`
        );
        if (skipped.length > 0) {
            console.log("Skipped conversation participant records:", skipped);
        }
    } catch (error) {
        console.error("Error seeding conversation participants:", error);
        throw error;
    }
}

async function seedMessages() {
    try {
        const validConversationIds = new Set(
            (
                await prisma.conversation.findMany({
                    select: { conversationId: true },
                })
            ).map((c) => c.conversationId)
        );

        const validUserIds = new Set(
            (await prisma.user.findMany({ select: { userId: true } })).map(
                (u) => u.userId
            )
        );

        const validAppointmentIds = new Set(
            (
                await prisma.appointment.findMany({
                    select: { appointmentId: true },
                })
            ).map((a) => a.appointmentId)
        );

        const skipped = [];

        const filtered = messages.filter((m) => {
            const isValid =
                validConversationIds.has(m.conversationId) &&
                validUserIds.has(m.senderId) &&
                validAppointmentIds.has(m.appointmentId);

            if (!isValid) skipped.push(m);
            return isValid;
        });

        await prisma.message.createMany({
            data: filtered.map((message) => ({
                messageId: message.messageId,
                conversationId: message.conversationId,
                hospitalId: message.hospitalId,
                appointmentId: message.appointmentId,
                senderId: message.senderId,
                content: message.content,
                messageType: message.messageType || "TEXT",
                isRead: message.isRead || false,
                createdAt: message.createdAt || randomPastDate(),
                updatedAt: message.updatedAt || randomPastDate(),
            })),
            skipDuplicates: true,
        });

        console.log(
            `Seeded messages. Skipped ${skipped.length} invalid records.`
        );
        // if (skipped.length > 0) {
        //     console.log("Skipped message records:", skipped);
        // }
    } catch (error) {
        console.error("Error seeding messages:", error);
        throw error;
    }
}

async function seedMedicalInformations() {
    try {
        const existingPatients = await prisma.patient.findMany({
            select: { patientId: true },
        });
        const validPatientIds = new Set(
            existingPatients.map((p) => p.patientId)
        );

        const filtered = medicalInformations.filter((m) =>
            validPatientIds.has(m.patientId)
        );

        await prisma.medicalInformation.createMany({
            data: filtered.map((m) => ({
                infoId: m.infoId,
                patientId: m.patientId,
                height: m.height ?? null,
                weight: m.weight ?? null,
                bloodGroup: m.bloodGroup ?? null,
                allergies: m.allergies ?? null,
                bmi: m.bmi ?? null,
                bodyType: m.bodyType ?? null,
                alcohol: m.alcohol ?? null,
                drugs: m.drugs ?? null,
                createdAt: m.createdAt || randomPastDate(730),
                updatedAt: m.updatedAt || randomPastDate(365),
            })),
            skipDuplicates: true,
        });

        const count = await prisma.medicalInformation.count();
        console.log(`Seeded medical informations. Total in DB: ${count}`);
    } catch (error) {
        console.error("Error seeding medical informations:", error);
        throw error;
    }
}

async function seedDoctors() {
    try {
        // 1. Get valid user and specialization IDs
        const [users, specs] = await Promise.all([
            prisma.user.findMany({ select: { userId: true } }),
            prisma.specialization.findMany({
                select: { specializationId: true },
            }),
        ]);
        const validUserIds = new Set(users.map((u) => u.userId));
        const validSpecIds = new Set(specs.map((s) => s.specializationId));

        // 2. Separate valid and invalid doctors
        const invalidDoctors = doctors.filter(
            (d) =>
                !validUserIds.has(d.userId) ||
                !validSpecIds.has(d.specializationId)
        );
        const validDoctors = doctors.filter(
            (d) =>
                validUserIds.has(d.userId) &&
                validSpecIds.has(d.specializationId)
        );

        // 3. Insert only valid records
        const result = await prisma.doctor.createMany({
            data: validDoctors.map((doctor) => ({
                doctorId: doctor.doctorId,
                userId: doctor.userId,
                hospitalId: doctor.hospitalId,
                departmentId: doctor.departmentId,
                specializationId: doctor.specializationId,
                qualifications: doctor.qualifications ?? null,
                status: doctor.status ?? "Offline",
                phoneNo: doctor.phoneNo,
                workingHours: doctor.workingHours ?? "Not specified",
                averageRating: doctor.averageRating ?? 0.0,
                skills: doctor.skills ?? null,
                bio: doctor.bio ?? null,
                yearsOfExperience: doctor.yearsOfExperience ?? null,
                createdAt: doctor.createdAt ?? randomPastDate(730),
                updatedAt: doctor.updatedAt ?? randomPastDate(365),
            })),
            skipDuplicates: true,
        });

        // 4. Figure out which valid doctors were duplicates
        const duplicateDoctors = validDoctors.length - result.count;

        // 5. Logging
        console.log(`Seeded ${result.count} doctors`);
        console.log(`Skipped ${invalidDoctors.length} invalid doctors:`);

        console.log(`${duplicateDoctors} duplicates (already existed):`);
    } catch (error) {
        console.error("Error seeding doctors:", error);
        throw error;
    }
}

async function seedDoctorLicenses() {
    try {
        // 1. Load valid doctor IDs
        const doctors = await prisma.doctor.findMany({
            select: { doctorId: true },
        });
        const validDoctorIds = new Set(doctors.map((d) => d.doctorId));

        // 2. Filter out any licenses for non-existent doctors
        const filteredLicenses = doctorLicenses.filter((dl) =>
            validDoctorIds.has(dl.doctorId)
        );

        // 3. Bulk-insert only the valid records
        const result = await prisma.doctorLicense.createMany({
            data: filteredLicenses.map((license) => ({
                licenseId: license.licenseId,
                doctorId: license.doctorId,
                name: license.name,
                licenseNumber: license.licenseNumber,
                issueDate: license.issueDate,
                expiryDate: license.expiryDate,
                issuingAuthority: license.issuingAuthority,
            })),
            skipDuplicates: true,
        });

        console.log(
            `Seeded ${result.count} doctor licenses ` +
                `(from total ${doctorLicenses.length} entries: ` +
                `${doctorLicenses.length - filteredLicenses.length} invalid, ` +
                `${filteredLicenses.length - result.count} duplicates).`
        );
    } catch (error) {
        console.error("Error seeding doctor licenses:", error);
        throw error;
    }
}

async function seedDoctorReviews() {
    try {
        const existingDoctors = await prisma.doctor.findMany({
            select: { doctorId: true },
        });
        const existingPatients = await prisma.patient.findMany({
            select: { patientId: true },
        });

        const validDoctorIds = new Set(existingDoctors.map((d) => d.doctorId));
        const validPatientIds = new Set(
            existingPatients.map((p) => p.patientId)
        );

        const skipped = [];

        const filtered = doctorReviews.filter((r) => {
            const isValid =
                validDoctorIds.has(r.doctorId) &&
                validPatientIds.has(r.patientId);
            if (!isValid) skipped.push(r);
            return isValid;
        });

        await prisma.doctorReview.createMany({
            data: filtered.map((review) => ({
                reviewId: review.reviewId,
                doctorId: review.doctorId,
                patientId: review.patientId,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt ?? randomPastDate(180),
                updatedAt: review.updatedAt ?? randomPastDate(90),
            })),
            skipDuplicates: true,
        });

        const count = await prisma.doctorReview.count();
        console.log(`Seeded doctor reviews. Total in DB: ${count}`);
        // if (skipped.length > 0) {
        //     console.log(`Skipped ${skipped.length} invalid review(s).`, skipped);
        // }
    } catch (error) {
        console.error("Error seeding doctor reviews:", error);
        throw error;
    }
}

async function seedNurses() {
    try {
        // 1. Load all valid FK values
        const [users, hospitals, departments, specializations] =
            await Promise.all([
                prisma.user.findMany({ select: { userId: true } }),
                prisma.hospital.findMany({ select: { hospitalId: true } }),
                prisma.department.findMany({ select: { departmentId: true } }),
                prisma.specialization.findMany({
                    select: { specializationId: true },
                }),
            ]);

        const validUserIds = new Set(users.map((u) => u.userId));
        const validHospitalIds = new Set(hospitals.map((h) => h.hospitalId));
        const validDeptIds = new Set(departments.map((d) => d.departmentId));
        const validSpecIds = new Set(
            specializations.map((s) => s.specializationId)
        );

        // 2. Filter out any nurse entries whose FKs don’t exist
        const skipped = [];
        const filtered = nurses.filter((n) => {
            const isValid =
                validUserIds.has(n.userId) &&
                validHospitalIds.has(n.hospitalId) &&
                validDeptIds.has(n.departmentId) &&
                validSpecIds.has(n.specializationId);
            if (!isValid) skipped.push(n);
            return isValid;
        });

        // 3. Bulk insert only the valid ones
        await prisma.nurse.createMany({
            data: filtered.map((nurse) => ({
                nurseId: nurse.nurseId,
                userId: nurse.userId,
                hospitalId: nurse.hospitalId,
                departmentId: nurse.departmentId,
                specializationId: nurse.specializationId,
                qualifications: nurse.qualifications ?? null,
                status: nurse.status,
                phoneNo: nurse.phoneNo,
                workingHours: nurse.workingHours,
                averageRating: nurse.averageRating ?? null,
                skills: nurse.skills ?? null,
                bio: nurse.bio ?? null,
                yearsOfExperience: nurse.yearsOfExperience ?? null,
                createdAt: nurse.createdAt ?? randomPastDate(730),
                updatedAt: nurse.updatedAt ?? randomPastDate(365),
            })),
            skipDuplicates: true,
        });

        console.log(`Seeded nurses. Inserted: ${filtered.length}`);
        //   if (skipped.length > 0) {
        //     console.warn(`Skipped ${skipped.length} nurse record(s) due to missing FK:`, skipped);
        //   }
    } catch (error) {
        console.error("Error seeding nurses:", error);
        throw error;
    }
}

async function seedStaff() {
    try {
        // 1. Fetch all valid FK values
        const [users, hospitals, departments, specializations] =
            await Promise.all([
                prisma.user.findMany({ select: { userId: true } }),
                prisma.hospital.findMany({ select: { hospitalId: true } }),
                prisma.department.findMany({ select: { departmentId: true } }),
                prisma.specialization.findMany({
                    select: { specializationId: true },
                }),
            ]);

        const validUserIds = new Set(users.map((u) => u.userId));
        const validHospitalIds = new Set(hospitals.map((h) => h.hospitalId));
        const validDeptIds = new Set(departments.map((d) => d.departmentId));
        const validSpecIds = new Set(
            specializations.map((s) => s.specializationId)
        );

        // 2. Filter out any staff entries with invalid FK references
        const skipped = [];
        const filteredStaff = staff.filter((s) => {
            const isValid =
                validUserIds.has(s.userId) &&
                validHospitalIds.has(s.hospitalId) &&
                validDeptIds.has(s.departmentId) &&
                validSpecIds.has(s.specializationId);
            if (!isValid) skipped.push(s);
            return isValid;
        });

        // 3. Bulk insert only the valid ones
        await prisma.staff.createMany({
            data: filteredStaff.map((st) => ({
                staffId: st.staffId,
                userId: st.userId,
                hospitalId: st.hospitalId,
                departmentId: st.departmentId,
                specializationId: st.specializationId,
                status: st.status,
                phoneNo: st.phoneNo,
                workingHours: st.workingHours,
                averageRating: st.averageRating ?? null,
                skills: st.skills ?? null,
                bio: st.bio ?? null,
                yearsOfExperience: st.yearsOfExperience ?? null,
                createdAt: st.createdAt ?? randomPastDate(730),
                updatedAt: st.updatedAt ?? randomPastDate(365),
            })),
            skipDuplicates: true,
        });

        const count = await prisma.staff.count();
        console.log(`Seeded staff. Total in DB: ${count}`);

        // if (skipped.length > 0) {
        //     console.warn(
        //         `Skipped ${skipped.length} staff record(s) due to missing FK references:`,
        //         skipped
        //     );
        // }
    } catch (error) {
        console.error("Error seeding staff:", error);
        throw error;
    }
}

async function seedBedCapacities() {
    try {
        await prisma.bedCapacity.createMany({
            data: bedCapacityRecords.map((bedCapacity) => ({
                bedCapacityId: bedCapacity.bedCapacityId,
                hospitalId: bedCapacity.hospitalId,
                totalInpatientBeds: bedCapacity.totalInpatientBeds,
                generalInpatientBeds: bedCapacity.generalInpatientBeds,
                cots: bedCapacity.cots,
                maternityBeds: bedCapacity.maternityBeds,
                emergencyCasualtyBeds: bedCapacity.emergencyCasualtyBeds,
                intensiveCareUnitBeds: bedCapacity.intensiveCareUnitBeds,
                highDependencyUnitBeds: bedCapacity.highDependencyUnitBeds,
                isolationBeds: bedCapacity.isolationBeds,
                generalSurgicalTheatres: bedCapacity.generalSurgicalTheatres,
                maternitySurgicalTheatres:
                    bedCapacity.maternitySurgicalTheatres,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });
        console.log(`Seeded bed capacities`);
    } catch (error) {
        console.error("Error seeding bed capacities:", error);
        throw error;
    }
}

async function seedBeds() {
    try {
        const existingPatients = await prisma.patient.findMany({
            select: { patientId: true },
        });
        const validPatientIds = new Set(
            existingPatients.map((p) => p.patientId)
        );

        const filteredBeds = beds.filter(
            (bed) =>
                bed.patientId === null || validPatientIds.has(bed.patientId)
        );

        await prisma.bed.createMany({
            data: filteredBeds.map((bed) => ({
                bedId: bed.bedId,
                hospitalId: bed.hospitalId,
                patientId: bed.patientId ?? null,
                type: bed.type,
                ward: bed.ward,
                availability: bed.availability,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });

        const count = await prisma.bed.count();
        console.log(`Seeded beds. Total in DB: ${count}`);
    } catch (error) {
        console.error("Error seeding beds:", error);
        throw error;
    }
}

async function seedAppointments() {
    try {
        const validPatientIds = new Set(
            (
                await prisma.patient.findMany({ select: { patientId: true } })
            ).map((p) => p.patientId)
        );

        const validDoctorIds = new Set(
            (await prisma.doctor.findMany({ select: { doctorId: true } })).map(
                (d) => d.doctorId
            )
        );

        const validHospitalIds = new Set(
            (
                await prisma.hospital.findMany({ select: { hospitalId: true } })
            ).map((h) => h.hospitalId)
        );

        const filtered = appointments.filter(
            (a) =>
                validPatientIds.has(a.patientId) &&
                validDoctorIds.has(a.doctorId) &&
                validHospitalIds.has(a.hospitalId)
        );

        await prisma.appointment.createMany({
            data: filtered.map((appointment) => ({
                appointmentId: appointment.appointmentId,
                doctorId: appointment.doctorId,
                patientId: appointment.patientId,
                hospitalId: appointment.hospitalId,
                appointmentDate: appointment.appointmentDate,
                type: appointment.type,
                action: appointment.action,
                status: appointment.status,
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
                reasonForVisit: appointment.reasonForVisit,
                rescheduledDate: appointment.rescheduledDate,
                cancellationReason: appointment.cancellationReason,
                pendingReason: appointment.pendingReason,
                diagnosis: appointment.diagnosis,
                prescription: appointment.prescription,
                createdAt: randomPastDate(730),
                updatedAt: randomPastDate(365),
            })),
            skipDuplicates: true,
        });

        const count = await prisma.appointment.count();
        console.log(`Seeded appointments. Total in DB: ${count}`);
    } catch (error) {
        console.error("Error seeding appointments:", error.message);
        throw error;
    }
}

async function seedAppointmentNotes() {
    try {
        const validUserIds = new Set(
            (await prisma.user.findMany({ select: { userId: true } })).map(
                (u) => u.userId
            )
        );

        const validAppointmentIds = new Set(
            (
                await prisma.appointment.findMany({
                    select: { appointmentId: true },
                })
            ).map((a) => a.appointmentId)
        );

        const filtered = appointmentNotes.filter(
            (n) =>
                validUserIds.has(n.authorId) &&
                validAppointmentIds.has(n.appointmentId)
        );

        await prisma.appointmentNote.createMany({
            data: filtered.map((note) => ({
                appointmentNoteId: note.appointmentNoteId,
                appointmentId: note.appointmentId,
                authorId: note.authorId,
                authorRole: note.authorRole,
                content: note.content,
                createdAt: note.createdAt || randomPastDate(),
                updatedAt: note.updatedAt || randomPastDate(),
            })),
            skipDuplicates: true,
        });

        const count = await prisma.appointmentNote.count();
        console.log(`Seeded appointment notes. Total in DB: ${count}`);
    } catch (error) {
        console.error("Error seeding appointment notes:", error.message);
        throw error;
    }
}

async function seedPayments() {
    try {
        const validPatientIds = new Set(
            (
                await prisma.patient.findMany({ select: { patientId: true } })
            ).map((p) => p.patientId)
        );

        const validServiceIds = new Set(
            (
                await prisma.service.findMany({ select: { serviceId: true } })
            ).map((s) => s.serviceId)
        );

        const validHospitalIds = new Set(
            (
                await prisma.hospital.findMany({ select: { hospitalId: true } })
            ).map((h) => h.hospitalId)
        );

        const validAppointmentIds = new Set(
            (
                await prisma.appointment.findMany({
                    select: { appointmentId: true },
                })
            ).map((a) => a.appointmentId)
        );

        const skipped = [];

        const filtered = payments.filter((p) => {
            const isValid =
                validPatientIds.has(p.patientId) &&
                validServiceIds.has(p.serviceId) &&
                validHospitalIds.has(p.hospitalId) &&
                validAppointmentIds.has(p.appointmentId);
            if (!isValid) skipped.push(p);
            return isValid;
        });

        await prisma.payment.createMany({
            data: filtered.map((payment) => ({
                paymentId: payment.paymentId,
                hospitalId: payment.hospitalId,
                appointmentId: payment.appointmentId,
                patientId: payment.patientId,
                serviceId: payment.serviceId,
                amount: payment.amount,
                createdAt: payment.createdAt || new Date(),
                updatedAt: payment.updatedAt || new Date(),
            })),
            skipDuplicates: true,
        });

        console.log(
            `Seeded payments. Skipped ${skipped.length} invalid records.`
        );
        // if (skipped.length > 0) {
        //     console.log("Skipped payments:", skipped);
        // }

        const count = await prisma.payment.count();
        console.log(`Seeded payments. Total in DB: ${count}`);
    } catch (error) {
        console.error("Error seeding payments:", error.message);
        throw error;
    }
}

async function seedReferrals() {
    try {
        const validPatientIds = new Set(
            (
                await prisma.patient.findMany({ select: { patientId: true } })
            ).map((p) => p.patientId)
        );

        const validDoctorIds = new Set(
            (await prisma.doctor.findMany({ select: { doctorId: true } })).map(
                (d) => d.doctorId
            )
        );

        const validHospitalIds = new Set(
            (
                await prisma.hospital.findMany({ select: { hospitalId: true } })
            ).map((h) => h.hospitalId)
        );

        const skipped = [];

        const filtered = referrals.filter((r) => {
            const isValid =
                validPatientIds.has(r.patientId) &&
                validDoctorIds.has(r.referringDoctorId) &&
                validHospitalIds.has(r.originHospitalId) &&
                validHospitalIds.has(r.destinationHospitalId);
            if (!isValid) skipped.push(r);
            return isValid;
        });

        await prisma.referral.createMany({
            data: filtered.map((ref) => ({
                referralId: ref.referralId,
                patientId: ref.patientId,
                originHospitalId: ref.originHospitalId,
                destinationHospitalId: ref.destinationHospitalId,
                referringDoctorId: ref.referringDoctorId,
                previousReferralId: ref.previousReferralId || null,
                type: ref.type,
                status: ref.status || "PENDING",
                priority: ref.priority || "ROUTINE",
                effectiveDate: ref.effectiveDate,
                urgency: ref.urgency || null,
                isTransportRequired: ref.isTransportRequired,
                diagnosis: ref.diagnosis,
                outcomeStatus: ref.outcomeStatus,
                outcomeNotes: ref.outcomeNotes,
                closedAt: ref.closedAt,
                createdAt: ref.createdAt || randomPastDate(730),
                updatedAt: ref.updatedAt || randomPastDate(365),
            })),
            skipDuplicates: true,
        });

        console.log(
            `Seeded referrals. Skipped ${skipped.length} invalid records.`
        );
        // if (skipped.length > 0) {
        //     console.log("Skipped referrals:", skipped);
        // }
    } catch (error) {
        console.error("Error seeding referrals:", error.message);
        throw error;
    }
}

async function seedReferralDocuments() {
    try {
        const validReferralIds = new Set(
            (
                await prisma.referral.findMany({ select: { referralId: true } })
            ).map((r) => r.referralId)
        );

        const validUserIds = new Set(
            (await prisma.user.findMany({ select: { userId: true } })).map(
                (u) => u.userId
            )
        );

        const skipped = [];

        const filtered = referralDocuments.filter((d) => {
            const isValid =
                validReferralIds.has(d.referralId) &&
                validUserIds.has(d.uploadedBy) &&
                typeof d.fileData === "string" &&
                /^[A-Za-z0-9+/=]+$/.test(d.fileData);
            if (!isValid) skipped.push(d);
            return isValid;
        });

        await prisma.referralDocument.createMany({
            data: filtered.map((doc) => ({
                referralDocId: doc.referralDocId,
                referralId: doc.referralId,
                fileName: doc.fileName,
                fileType: doc.fileType,
                fileSize: doc.fileSize,
                fileData: doc.fileData,
                uploadedAt: doc.uploadedAt,
                uploadedBy: doc.uploadedBy,
                isEncrypted: doc.isEncrypted,
            })),
            skipDuplicates: true,
        });

        console.log(
            `Seeded referral documents. Skipped ${skipped.length} invalid records.`
        );
        // if (skipped.length > 0) {
        //     console.log("Skipped documents:", skipped);
        // }
    } catch (error) {
        console.error("Error seeding referral documents:", error.message);
        throw error;
    }
}

async function seedDoctorReferrals() {
    try {
        const validReferralIds = new Set(
            (
                await prisma.referral.findMany({ select: { referralId: true } })
            ).map((r) => r.referralId)
        );

        const validDoctorIds = new Set(
            (await prisma.doctor.findMany({ select: { doctorId: true } })).map(
                (d) => d.doctorId
            )
        );

        const validPatientIds = new Set(
            (
                await prisma.patient.findMany({ select: { patientId: true } })
            ).map((p) => p.patientId)
        );

        const skipped = [];

        const filtered = referralDoctors.filter((rd) => {
            const isValid =
                validReferralIds.has(rd.referralId) &&
                validDoctorIds.has(rd.doctorId) &&
                validPatientIds.has(rd.patientId) &&
                rd.referralRole !== undefined;

            if (!isValid) skipped.push(rd);
            return isValid;
        });

        await prisma.referralDoctor.createMany({
            data: filtered.map((ref) => ({
                doctorId: ref.doctorId,
                referralId: ref.referralId,
                patientId: ref.patientId,
                previousReferralId: ref.previousReferralId ?? null,
                referralRole: ref.referralRole,
            })),
            skipDuplicates: true,
        });

        console.log(
            `Seeded referral doctors. Skipped ${skipped.length} invalid records.`
        );
        // if (skipped.length > 0) {
        //     console.log("Skipped referral doctor records:", skipped);
        // }
    } catch (error) {
        console.error("Error seeding doctor referrals:", error.message);
        throw error;
    }
}

async function seedTransportations() {
    try {
        // 1. Fetch valid referral and patient IDs
        const [allReferrals, allPatients] = await Promise.all([
            prisma.referral.findMany({ select: { referralId: true } }),
            prisma.patient.findMany({ select: { patientId: true } }),
        ]);

        const validReferralIds = new Set(allReferrals.map((r) => r.referralId));
        const validPatientIds = new Set(allPatients.map((p) => p.patientId));

        const skipped = [];
        const transformedData = transportations
            .map((t) => {
                const hasValidReferral =
                    t.referralId != null && validReferralIds.has(t.referralId);
                const hasValidPatient =
                    t.patientId != null && validPatientIds.has(t.patientId);

                // Skip entirely if neither FK is valid
                if (!hasValidReferral && !hasValidPatient) {
                    skipped.push(t);
                    return null;
                }

                return {
                    transportationId: t.transportationId,
                    referralId: hasValidReferral ? t.referralId : null,
                    patientId: hasValidPatient ? t.patientId : null,
                    ambulanceRegNo: t.ambulanceRegNo ?? t.vehicleNumber ?? null,
                    driverName: t.driverName ?? t.transporterName ?? null,
                    driverContact:
                        t.driverContact ?? t.transporterPhone ?? null,
                    emergencyCallerPhoneNo: t.emergencyCallerPhoneNo ?? null,
                    pickupLocation: t.pickupLocation,
                    dropoffLocation: t.dropoffLocation ?? null,
                    pickupTime: t.pickupTime ?? t.pickedUpAt ?? null,
                    dropoffTime: t.dropoffTime ?? t.droppedOffAt ?? null,
                    cost: t.cost ?? null,
                    status: t.status,
                    notes: t.notes ?? null,
                    createdAt: t.createdAt,
                    updatedAt: t.updatedAt,
                };
            })
            .filter((t) => t !== null);

        // 2. Bulk insert valid/transformed rows
        await prisma.transportation.createMany({
            data: transformedData,
            skipDuplicates: true,
        });

        console.log(
            `Seeded transportations: inserted ${transformedData.length} records.`
        );
        // if (skipped.length) {
        //     console.warn(
        //         `Skipped ${skipped.length} record(s) due to invalid referralId & patientId:`,
        //         skipped
        //     );
        // }
    } catch (error) {
        console.error("Error seeding transportations:", error.message);
        throw error;
    }
}

async function seedAppointmentServices() {
    try {
        const validAppointmentIds = new Set(
            (
                await prisma.appointment.findMany({
                    select: { appointmentId: true },
                })
            ).map((a) => a.appointmentId)
        );

        const validServiceIds = new Set(
            (
                await prisma.service.findMany({ select: { serviceId: true } })
            ).map((s) => s.serviceId)
        );

        const validPatientIds = new Set(
            (
                await prisma.patient.findMany({ select: { patientId: true } })
            ).map((p) => p.patientId)
        );

        const validHospitalIds = new Set(
            (
                await prisma.hospital.findMany({ select: { hospitalId: true } })
            ).map((h) => h.hospitalId)
        );

        const validDepartmentIds = new Set(
            (
                await prisma.department.findMany({
                    select: { departmentId: true },
                })
            ).map((d) => d.departmentId)
        );

        const skipped = [];

        const filtered = appointmentServices.filter((s) => {
            const isValid =
                validAppointmentIds.has(s.appointmentId) &&
                validServiceIds.has(s.serviceId) &&
                validPatientIds.has(s.patientId) &&
                validHospitalIds.has(s.hospitalId) &&
                (s.departmentId === undefined ||
                    validDepartmentIds.has(s.departmentId));
            if (!isValid) skipped.push(s);
            return isValid;
        });

        await prisma.appointmentService.createMany({
            data: filtered.map((s) => ({
                appointmentId: s.appointmentId,
                hospitalId: s.hospitalId,
                patientId: s.patientId,
                departmentId: s.departmentId || null,
                serviceId: s.serviceId,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
            })),
            skipDuplicates: true,
        });

        console.log(
            `Seeded appointment services. Skipped ${skipped.length} invalid records.`
        );
        // if (skipped.length > 0) {
        //     console.log("Skipped appointmentService records:", skipped);
        // }
    } catch (error) {
        console.error("Error seeding appointment services:", error.message);
        throw error;
    }
}

async function seedServiceUsages() {
    try {
        // 1. Fetch valid foreign-key sets
        const [allPatients, allServices, allHospitals, allAppointments] =
            await Promise.all([
                prisma.patient.findMany({ select: { patientId: true } }),
                prisma.service.findMany({ select: { serviceId: true } }),
                prisma.hospital.findMany({ select: { hospitalId: true } }),
                prisma.appointment.findMany({
                    select: { appointmentId: true },
                }),
            ]);

        const validPatientIds = new Set(allPatients.map((p) => p.patientId));
        const validServiceIds = new Set(allServices.map((s) => s.serviceId));
        const validHospitalIds = new Set(allHospitals.map((h) => h.hospitalId));
        const validAppointmentIds = new Set(
            allAppointments.map((a) => a.appointmentId)
        );

        // 2. Filter source data against all required FKs
        const skipped = [];
        const validRows = serviceUsages.filter((su) => {
            const isValid =
                validPatientIds.has(su.patientId) &&
                validServiceIds.has(su.serviceId) &&
                validHospitalIds.has(su.hospitalId) &&
                validAppointmentIds.has(su.appointmentId);

            if (!isValid) skipped.push(su);
            return isValid;
        });

        // 3. Bulk insert only the truly valid rows
        await prisma.serviceUsage.createMany({
            data: validRows.map((su) => ({
                usageId: su.usageId,
                hospitalId: su.hospitalId,
                departmentId: su.departmentId ?? null,
                appointmentId: su.appointmentId,
                serviceId: su.serviceId,
                patientId: su.patientId,
                createdAt: su.createdAt,
                updatedAt: su.updatedAt,
            })),
            skipDuplicates: true,
        });

        // 4. Report results
        console.log(
            `Seeded service usages: inserted ${validRows.length} records.`
        );
        // if (skipped.length > 0) {
        //     console.warn(
        //         `Skipped ${skipped.length} invalid service usage record(s):`,
        //         skipped
        //     );
        // }
    } catch (error) {
        console.error("Error seeding service usages:", error.message);
        throw error;
    }
}

async function seedDoctorEarnings() {
    try {
        // 1. Fetch all valid doctor IDs
        const existingDoctors = await prisma.doctor.findMany({
            select: { doctorId: true },
        });
        const validDoctorIds = new Set(existingDoctors.map((d) => d.doctorId));

        // 2. Filter out any earnings with an invalid doctorId
        const skipped = [];
        const validRows = doctorEarnings.filter((e) => {
            const isValid = validDoctorIds.has(e.doctorId);
            if (!isValid) skipped.push(e);
            return isValid;
        });

        // 3. Bulk insert only the valid earnings
        await prisma.doctorEarning.createMany({
            data: validRows.map((e) => ({
                earningsId: e.earningsId,
                doctorId: e.doctorId,
                date: e.date,
                amount: e.amount,
                description: e.description ?? null,
            })),
            skipDuplicates: true,
        });

        console.log(
            `Seeded doctor earnings: inserted ${validRows.length} records.`
        );
        // if (skipped.length > 0) {
        //     console.warn(
        //         `Skipped ${skipped.length} earnings record(s) due to invalid doctorId:`,
        //         skipped
        //     );
        // }
    } catch (error) {
        console.error("Error seeding doctor earnings:", error.message);
        throw error;
    }
}

async function seedSessions() {
    try {
        const validUserIds = new Set(
            (await prisma.user.findMany({ select: { userId: true } })).map(
                (u) => u.userId
            )
        );

        const skipped = [];

        const filtered = sessions.filter((s) => {
            const isValid = validUserIds.has(s.userId);
            if (!isValid) skipped.push(s);
            return isValid;
        });

        await prisma.session.createMany({
            data: filtered.map((session) => ({
                sessionId: session.sessionId,
                sessionToken: session.sessionToken,
                userId: session.userId,
                expires: session.expires,
                createdAt: session.createdAt || randomPastDate(730),
                updatedAt: session.updatedAt || randomPastDate(365),
            })),
            skipDuplicates: true,
        });

        console.log(
            `Seeded sessions. Skipped ${skipped.length} invalid records.`
        );
        // if (skipped.length > 0) {
        //     console.log("Skipped session records:", skipped);
        // }
    } catch (error) {
        console.error("Error seeding sessions:", error.message);
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
    await prisma.passwordHistory.deleteMany();
    console.log("✅ Cleared PasswordHistory table");

    await seedHospitals();
    await seedSpecializations();
    await seedDepartments();
    await seedDepartmentSpecializations();
    await seedHospitalDepartments();
    await seedServices();
    await seedDepartmentServices();
    await seedHospitalServices();
    await seedBedCapacities();
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
    await seedAppointmentNotes();
    await seedPayments();
    await seedReferrals();
    await seedReferralDocuments();
    await seedDoctorReferrals();
    await seedTransportations();
    await seedAppointmentServices();
    await seedServiceUsages();
    await seedDoctorEarnings();
    await seedConversations();
    await seedConversationParticipants();
    await seedMessages();
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
