import { z } from "zod";

export const profileSchema = z.object({
    firstName: z.string().min(2, "First name is required (min 2 chars)"),
    lastName: z.string().min(2, "Last name is required (min 2 chars)"),
    gender: z.number(),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    phoneNumbers: z.string(),
});

export const passwordSchema = z
    .object({
        currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
        newPassword: z.string().min(6, "New password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type ProfileFormData = z.infer<typeof profileSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
