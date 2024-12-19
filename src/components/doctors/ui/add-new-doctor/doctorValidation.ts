// // src/components/doctors/ui/doctorValidation.ts

// /**
//  * Utility for validating doctor form data.
//  */

// /**
//  * Validates the form data for adding a doctor.
//  * @param formData The data to validate.
//  * @returns `true` if valid, `false` otherwise.
//  */
// export const validateFormData = (formData: any): string[] => {
//     const errors: string[] = [];

//     if (!formData.name || formData.name.trim().length < 3) {
//         errors.push("Name must be at least 3 characters long.");
//     }

//     const phoneRegex = /^[0-9]{10}$/;
//     if (!formData.phone || !phoneRegex.test(formData.phone)) {
//         errors.push("Phone must be a valid 10-digit number.");
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!formData.email || !emailRegex.test(formData.email)) {
//         errors.push("Email must be a valid email address.");
//     }

//     if (!formData.specializationId) {
//         errors.push("Specialization is required.");
//     }

//     if (!formData.departmentId) {
//         errors.push("Department is required.");
//     }

//     if (!formData.dateOfBirth || !isValidDate(formData.dateOfBirth)) {
//         errors.push("Date of Birth must be valid.");
//     }

//     if (!formData.profileImage && !formData.profileImageUrl) {
//         errors.push("Profile image is required.");
//     }

//     return errors;
// };


// /**
//  * Checks if a given date is valid.
//  * @param date The date string to validate.
//  * @returns `true` if valid, `false` otherwise.
//  */
// export const isValidDate = (date: string): boolean => {
//     const parsedDate = Date.parse(date);
//     return !isNaN(parsedDate);
// };

// /**
//  * Checks if a file is a valid image type.
//  * @param file The file object to validate.
//  * @returns `true` if valid, `false` otherwise.
//  */
// export const isValidImageType = (file: File): boolean => {
//     const allowedTypes = ["image/jpeg", "image/png"];
//     return allowedTypes.includes(file.type);
// };
