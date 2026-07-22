// ── Requests (mirror backend DTOs exactly) ────────────────────────────────────

export interface RegisterPatientRequest {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;
    gender: number;
    dateOfBirth: string;
    profileImg?: File | null;
    address?: string;
    nationalId?: string;
    emergencyContact?: string;
    bloodType?: string;
    phoneNumbers: string[];
}

export interface RegisterDoctorRequest {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;
    gender: number;
    dateOfBirth: string;
    profileImg?: File | null;
    bio: string;
    yearsOfExperience: number;
    licenseNumber: string;
    specializationId: string;
    phoneNumbers: string[];
}

export interface RegisterReceptionistRequest {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;
    gender: number;
    dateOfBirth: string;
    profileImg?: File | null;
    address?: string;
    nationalId?: string;
    organizationId: string;
    branchId: string;
    phoneNumbers: string[];
}

export interface ForgotPasswordRequest {
    userNameOrEmail: string;
}

export interface VerifyOTPRequest {
    userNameOrEmail: string;
    otp: string;
}

export interface ResetPasswordRequest {
    userNameOrEmail: string;
    resetToken: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ResendEmailConfirmationRequest {
    userNameOrEmail: string;
}

// ── Responses ─────────────────────────────────────────────────────────────────

export interface VerifyOTPResponse {
    resetToken: string;
}
