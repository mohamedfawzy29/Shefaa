import { z } from "zod";

// TODO: Verify validation rules with backend requirements
export const doctorSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(5, "Phone number is required"),
    branch: z.string().min(1, "Branch is required"),
    specialization: z.string().min(1, "Specialization is required"),
    status: z.enum(["Active", "Inactive"]),
    profileImageUrl: z.string().optional(),
});

export type DoctorFormData = z.infer<typeof doctorSchema>;
