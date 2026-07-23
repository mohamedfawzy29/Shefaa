import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse, SpecializationResponse } from "../types/specialization";

const BASE = API_ENDPOINTS.SPECIALIZATIONS.BASE;

export const specializationService = {
    /** GET /api/Admin/Specializations */
    getAll: async (): Promise<SpecializationResponse[]> => {
        const response = await api.get<ApiResponse<SpecializationResponse[]>>(BASE);
        return response.data.data ?? [];
    },

    /** GET /api/Admin/Specializations/{id} */
    getById: async (id: string): Promise<SpecializationResponse> => {
        const response = await api.get<ApiResponse<SpecializationResponse>>(`${BASE}/${id}`);
        return response.data.data!;
    },

    /**
     * POST /api/Admin/Specializations
     * Sends multipart/form-data — do NOT set Content-Type manually.
     * Axios automatically adds the correct boundary when the body is FormData.
     */
    create: async (formData: FormData): Promise<SpecializationResponse> => {
        const response = await api.post<ApiResponse<SpecializationResponse>>(BASE, formData);
        return response.data.data!;
    },

    /**
     * PUT /api/Admin/Specializations/{id}
     * Sends multipart/form-data — do NOT set Content-Type manually.
     * Axios automatically adds the correct boundary when the body is FormData.
     */
    update: async (id: string, formData: FormData): Promise<SpecializationResponse> => {
        const response = await api.put<ApiResponse<SpecializationResponse>>(
            `${BASE}/${id}`,
            formData
        );
        return response.data.data!;
    },

    /** DELETE /api/Admin/Specializations/{id} */
    delete: async (id: string): Promise<void> => {
        await api.delete(`${BASE}/${id}`);
    },
};
