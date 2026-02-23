import { z } from "zod";

export const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[+]?[0-9\-\s()]+$/, "Invalid phone number"),
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date);
    return birthDate < new Date();
  }, "Date of birth must be in the past"),
  gender: z.enum(["male", "female", "other"], {
    message: "Gender is required",
  }),
  address: z.string().min(5, "Address is required"),
  preferredLanguage: z.string().min(1, "Preferred language is required"),
  nationality: z.string().min(1, "Nationality is required"),
  religion: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
