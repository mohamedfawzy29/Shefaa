import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse, PatientResponse } from "../types/patient";

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

export const patientService = {
    getAll: async (): Promise<PatientResponse[]> => {
        const endpoints = [
            API_ENDPOINTS.ADMIN.PATIENTS.FALLBACK,    // /Patient
            `${API_ENDPOINTS.ADMIN.PATIENTS.FALLBACK}/all`, // /Patient/all
            API_ENDPOINTS.ADMIN.PATIENTS.BASE,        // /Admin/Patient
            `${API_ENDPOINTS.ADMIN.PATIENTS.BASE}/all`,   // /Admin/Patient/all
        ];

        for (const ep of endpoints) {
            try {
                const response = await api.get(ep);
                const list = extractArray<PatientResponse>(response.data);
                if (list.length > 0 || Array.isArray(response.data) || response.data?.data) {
                    return list;
                }
            } catch {
                // Try next fallback
            }
        }
        return [];
    },

    getById: async (id: string): Promise<PatientResponse> => {
        try {
            const response = await api.get<ApiResponse<PatientResponse>>(`/Patient/${id}`);
            return response.data.data!;
        } catch {
            const fallback = await api.get<ApiResponse<PatientResponse>>(`/Admin/Patient/${id}`);
            return fallback.data.data!;
        }
    },
};
