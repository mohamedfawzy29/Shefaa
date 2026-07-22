import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse } from "../../doctors/types/doctor";
import type { ApplicationUserResponse, UpdateProfileRequest, ChangePasswordRequest } from "../types/profile";

export const profileService = {
    getProfile: async (): Promise<ApplicationUserResponse> => {
        const response = await api.get<ApiResponse<ApplicationUserResponse>>(API_ENDPOINTS.PROFILE.BASE);
        return response.data.data!;
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<ApplicationUserResponse> => {
        const response = await api.put<ApiResponse<ApplicationUserResponse>>(API_ENDPOINTS.PROFILE.BASE, data);
        return response.data.data!;
    },

    updatePassword: async (data: ChangePasswordRequest): Promise<void> => {
        await api.put<ApiResponse<object>>(API_ENDPOINTS.PROFILE.PASSWORD, data);
    },

    updateProfileImage: async (file: File): Promise<{ profileImage: string }> => {
        const formData = new FormData();
        formData.append("ProfileImage", file);
        const response = await api.patch<ApiResponse<{ profileImage: string }>>(
            API_ENDPOINTS.PROFILE.IMAGE,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data.data!;
    },
};
