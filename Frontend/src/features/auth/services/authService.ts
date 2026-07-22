import axios from "axios";

import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse } from "../types/apiResponse";
import type { AuthenticatedResponse } from "../types/authenticatedResponse";
import type { LoginRequest } from "../types/loginRequest";
import type {
    RegisterPatientRequest,
    RegisterDoctorRequest,
    RegisterReceptionistRequest,
    ForgotPasswordRequest,
    VerifyOTPRequest,
    VerifyOTPResponse,
    ResetPasswordRequest,
    ResendEmailConfirmationRequest,
} from "../types/authTypes";

// ── helpers ───────────────────────────────────────────────────────────────────

function extractError(error: unknown, fallback: string): never {
    if (axios.isAxiosError<ApiResponse>(error) && error.response) {
        const body = error.response.data;
        const message = body?.errors?.[0] ?? body?.message ?? fallback;
        throw new Error(message);
    }
    throw new Error("Unable to reach the server. Please check your connection.");
}

// ── service ───────────────────────────────────────────────────────────────────

const authService = {
    login: async (credentials: LoginRequest): Promise<AuthenticatedResponse> => {
        try {
            const response = await api.post<AuthenticatedResponse>(
                API_ENDPOINTS.AUTH.LOGIN,
                credentials,
            );
            return response.data;
        } catch (error) {
            extractError(error, "Login failed.");
        }
    },

    registerPatient: async (data: RegisterPatientRequest): Promise<void> => {
        try {
            const formData = new FormData();
            formData.append("FirstName", data.firstName);
            formData.append("LastName", data.lastName);
            formData.append("Email", data.email);
            formData.append("UserName", data.userName);
            formData.append("Password", data.password);
            formData.append("ConfirmPassword", data.confirmPassword);
            formData.append("Gender", String(data.gender));
            formData.append("DateOfBirth", data.dateOfBirth);
            if (data.profileImg) formData.append("ProfileImg", data.profileImg);
            if (data.address) formData.append("Address", data.address);
            if (data.nationalId) formData.append("NationalId", data.nationalId);
            if (data.emergencyContact) formData.append("EmergencyContact", data.emergencyContact);
            if (data.bloodType) formData.append("BloodType", data.bloodType);
            data.phoneNumbers.forEach((p) => formData.append("PhoneNumbers", p));

            await api.post(API_ENDPOINTS.AUTH.REGISTER_PATIENT, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        } catch (error) {
            extractError(error, "Registration failed.");
        }
    },

    registerDoctor: async (data: RegisterDoctorRequest): Promise<void> => {
        try {
            const formData = new FormData();
            formData.append("FirstName", data.firstName);
            formData.append("LastName", data.lastName);
            formData.append("Email", data.email);
            formData.append("UserName", data.userName);
            formData.append("Password", data.password);
            formData.append("ConfirmPassword", data.confirmPassword);
            formData.append("Gender", String(data.gender));
            formData.append("DateOfBirth", data.dateOfBirth);
            if (data.profileImg) formData.append("ProfileImg", data.profileImg);
            formData.append("Bio", data.bio);
            formData.append("YearsOfExperience", String(data.yearsOfExperience));
            formData.append("LicenseNumber", data.licenseNumber);
            formData.append("SpecializationId", data.specializationId);
            data.phoneNumbers.forEach((p) => formData.append("PhoneNumbers", p));
            await api.post(API_ENDPOINTS.AUTH.REGISTER_DOCTOR, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        } catch (error) {
            extractError(error, "Doctor registration failed.");
        }
    },

    registerReceptionist: async (data: RegisterReceptionistRequest): Promise<void> => {
        try {
            const formData = new FormData();
            formData.append("FirstName", data.firstName);
            formData.append("LastName", data.lastName);
            formData.append("Email", data.email);
            formData.append("UserName", data.userName);
            formData.append("Password", data.password);
            formData.append("ConfirmPassword", data.confirmPassword);
            formData.append("Gender", String(data.gender));
            formData.append("DateOfBirth", data.dateOfBirth);
            if (data.profileImg) formData.append("ProfileImg", data.profileImg);
            if (data.address) formData.append("Address", data.address);
            if (data.nationalId) formData.append("NationalId", data.nationalId);
            formData.append("OrganizationId", data.organizationId);
            formData.append("BranchId", data.branchId);
            data.phoneNumbers.forEach((p) => formData.append("PhoneNumbers", p));
            await api.post(API_ENDPOINTS.AUTH.REGISTER_RECEPTIONIST, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        } catch (error) {
            extractError(error, "Receptionist registration failed.");
        }
    },

    confirmEmail: async (userId: string, token: string): Promise<void> => {
        try {
            await api.get(API_ENDPOINTS.AUTH.CONFIRM_EMAIL, {
                params: { UserId: userId, Token: token },
            });
        } catch (error) {
            extractError(error, "Email confirmation failed.");
        }
    },

    resendEmailConfirmation: async (data: ResendEmailConfirmationRequest): Promise<void> => {
        try {
            await api.post(API_ENDPOINTS.AUTH.RESEND_EMAIL_CONFIRMATION, data);
        } catch (error) {
            extractError(error, "Failed to resend confirmation email.");
        }
    },

    forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
        try {
            await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
        } catch (error) {
            extractError(error, "Failed to send OTP.");
        }
    },

    verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
        try {
            const response = await api.post<ApiResponse<VerifyOTPResponse>>(
                API_ENDPOINTS.AUTH.VERIFY_OTP,
                data,
            );
            return response.data.data!;
        } catch (error) {
            extractError(error, "OTP verification failed.");
        }
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
        try {
            await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
        } catch (error) {
            extractError(error, "Password reset failed.");
        }
    },
};

export default authService;
