import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "Email or username is required"),
    password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string().email("Invalid email address"),
    userName: z.string().min(3, "Username must be at least 3 characters").max(50),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    gender: z.number(),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    phoneNumber: z.string().min(6, "Phone number is required"),
    address: z.string().optional(),
    nationalId: z.string().optional(),
    emergencyContact: z.string().optional(),
    bloodType: z.string().optional(),
    profileImg: z.any().optional(),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const registerDoctorSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string().email("Invalid email address"),
    userName: z.string().min(3, "Username must be at least 3 characters").max(50),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    gender: z.number(),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    phoneNumber: z.string().min(6, "Phone number is required"),
    profileImg: z.any().optional(),
    bio: z.string().min(1, "Bio is required").max(1000),
    yearsOfExperience: z.number().min(0, "Years of experience cannot be negative").max(60),
    licenseNumber: z.string().min(1, "License number is required").max(50),
    specializationId: z.string().min(1, "Please select a specialization"),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterDoctorFormData = z.infer<typeof registerDoctorSchema>;

export const registerReceptionistSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string().email("Invalid email address"),
    userName: z.string().min(3, "Username must be at least 3 characters").max(50),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    gender: z.number(),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    phoneNumber: z.string().min(6, "Phone number is required"),
    profileImg: z.any().optional(),
    address: z.string().optional(),
    nationalId: z.string().optional(),
    organizationId: z.string().min(1, "Please select an organization"),
    branchId: z.string().min(1, "Please select a branch"),

}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterReceptionistFormData = z.infer<typeof registerReceptionistSchema>;

export const forgotPasswordSchema = z.object({
    userNameOrEmail: z.string().min(1, "Email or username is required"),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const verifyOTPSchema = z.object({
    otp: z.string().length(6, "OTP must be exactly 6 digits"),
});
export type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const resendEmailSchema = z.object({
    userNameOrEmail: z.string().min(1, "Email or username is required"),
});
export type ResendEmailFormData = z.infer<typeof resendEmailSchema>;