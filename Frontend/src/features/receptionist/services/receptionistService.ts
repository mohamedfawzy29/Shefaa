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
        const endpoints = [
            API_ENDPOINTS.ADMIN.RECEPTIONISTS.FALLBACK,    // /Receptionist
            `${API_ENDPOINTS.ADMIN.RECEPTIONISTS.FALLBACK}/all`,
            API_ENDPOINTS.ADMIN.RECEPTIONISTS.BASE,        // /Admin/Receptionist
            `${API_ENDPOINTS.ADMIN.RECEPTIONISTS.BASE}/all`,
        ];

        for (const ep of endpoints) {
            try {
                const response = await api.get(ep);
                const list = extractArray<ReceptionistResponse>(response.data);
                if (list.length > 0 || Array.isArray(response.data) || response.data?.data) {
                    return list;
                }
            } catch {
                // Try next fallback
            }
        }
        return [];
    },

    getPending: async (): Promise<ReceptionistResponse[]> => {
        const endpoints = [
            `${API_ENDPOINTS.ADMIN.RECEPTIONISTS.FALLBACK}/Pending`,
            `${API_ENDPOINTS.ADMIN.RECEPTIONISTS.BASE}/Pending`,
        ];

        for (const ep of endpoints) {
            try {
                const response = await api.get(ep);
                const list = extractArray<ReceptionistResponse>(response.data);
                if (list.length > 0 || Array.isArray(response.data) || response.data?.data) {
                    return list;
                }
            } catch {
                // Try next fallback
            }
        }
        return [];
    },

    create: async (formData: FormData): Promise<ReceptionistResponse> => {
        try {
            const response = await api.post<ApiResponse<ReceptionistResponse>>(
                API_ENDPOINTS.ADMIN.RECEPTIONISTS.FALLBACK,
                formData
            );
            return response.data.data!;
        } catch {
            const response = await api.post<ApiResponse<ReceptionistResponse>>(
                API_ENDPOINTS.ADMIN.RECEPTIONISTS.BASE,
                formData
            );
            return response.data.data!;
        }
    },

    approve: async (id: string): Promise<void> => {
        try {
            await api.patch(`/Receptionist/${id}/Approve`);
        } catch {
            await api.patch(`/Admin/Receptionist/${id}/Approve`);
        }
    },

    reject: async (id: string): Promise<void> => {
        try {
            await api.patch(`/Receptionist/${id}/Reject`);
        } catch {
            await api.patch(`/Admin/Receptionist/${id}/Reject`);
        }
    },

    suspend: async (id: string): Promise<void> => {
        try {
            await api.patch(`/Receptionist/${id}/Suspend`);
        } catch {
            await api.patch(`/Admin/Receptionist/${id}/Suspend`);
        }
    },

    activate: async (id: string): Promise<void> => {
        try {
            await api.patch(`/Receptionist/${id}/Activate`);
        } catch {
            await api.patch(`/Admin/Receptionist/${id}/Activate`);
        }
    },
};
