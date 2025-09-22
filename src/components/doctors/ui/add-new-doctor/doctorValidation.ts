import { z } from "zod";

export const doctorValidationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNo: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().nullable(),
  qualifications: z.string().optional(),
  about: z.string().optional(),
  specializationId: z.number({ required_error: "Specialization is required." }).min(1, "Specialization is required"),
  departmentId: z.number({ required_error: "Department is required." }).min(1, "Department is required"),
  hospitalId: z.number({ required_error: "Hospital is required." }).min(1, "Hospital is required"),
  status: z.string().optional(),
  profileImageUrl: z.string().url().optional().nullable(),
});

export type DoctorFormValues = z.infer<typeof doctorValidationSchema>;
