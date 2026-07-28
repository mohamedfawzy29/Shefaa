import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse, ReceptionistResponse } from "../types/receptionist";

function extractArray<T>(data: unknown): T[] {
    if (!data) return [];
    if (Array.isArray(data)) return data as T[];
    if (typeof data === "object") {
        const obj = data as Record<string, unknown>;
        if (Array.isArray(obj.data)) return obj.data as T[];
        if (Array.isArray(obj.result)) return obj.result as T[];
        if (Array.isArray(obj.items)) return obj.items as T[];
    }
    return [];
}

export const receptionistService = {
    getAll: async (): Promise<ReceptionistResponse[]> => {
        const response = await api.get(API_ENDPOINTS.ADMIN.RECEPTIONISTS.BASE);
        const list = extractArray<ReceptionistResponse>(response.data);
        return list;
    },

    getPending: async (): Promise<ReceptionistResponse[]> => {
        const response = await api.get(`${API_ENDPOINTS.ADMIN.RECEPTIONISTS.BASE}/Pending`);
        const list = extractArray<ReceptionistResponse>(response.data);
        return list;
    },

    create: async (formData: FormData): Promise<ReceptionistResponse> => {
        const response = await api.post<ApiResponse<ReceptionistResponse>>(
            API_ENDPOINTS.ADMIN.RECEPTIONISTS.BASE,
            formData
        );
        return response.data.data!;
    },

    approve: async (id: string): Promise<void> => {
        await api.patch(`/Admin/Receptionist/${id}/Approve`);
    },

    reject: async (id: string): Promise<void> => {
        await api.patch(`/Admin/Receptionist/${id}/Reject`);
    },

    suspend: async (id: string): Promise<void> => {
        await api.patch(`/Admin/Receptionist/${id}/Suspend`);
    },

    activate: async (id: string): Promise<void> => {
        await api.patch(`/Admin/Receptionist/${id}/Activate`);
    },
};
