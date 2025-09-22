// src/components/hospitals/ui/add-new-hospital/hospitalValidation.ts

import * as z from "zod";
import { KEPHLevel, HospitalOwnershipType } from "@/lib/definitions";

export const basicInfoSchema = z.object({
  hospitalName: z.string().min(1, "Hospital name is required"),
  hospitalLink: z.string().url().optional().or(z.literal('')),
  referralCode: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
});

export const contactSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  emergencyPhone: z.string().optional(),
  emergencyEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
});

export const regulatorySchema = z.object({
  kephLevel: z.nativeEnum(KEPHLevel).optional(),
  regulatoryBody: z.string().optional(),
  ownershipType: z.nativeEnum(HospitalOwnershipType).optional(),
  facilityType: z.string().optional(),
  nhifAccreditation: z.string().optional(),
  regulated: z.string().optional(),
  regulationStatus: z.string().optional(),
  regulatingBody: z.string().optional(),
  registrationNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
});

export const locationSchema = z.object({
  county: z.string().min(1, "County is required"),
  subCounty: z.string().optional(),
  ward: z.string().optional(),
  town: z.string().optional(),
  streetAddress: z.string().optional(),
  nearestLandmark: z.string().optional(),
  plotNumber: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const operatingHoursSchema = z.object({
  open24Hours: z.string().optional(),
  openWeekends: z.string().optional(),
  operatingHours: z.string().optional(),
});

export const ownershipSchema = z.object({
  owner: z.string().optional(),
});

export const hospitalSchema = basicInfoSchema
  .merge(contactSchema)
  .merge(regulatorySchema)
  .merge(locationSchema)
  .merge(operatingHoursSchema)
  .merge(ownershipSchema);
