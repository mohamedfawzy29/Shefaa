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
        const response = await api.get(API_ENDPOINTS.ADMIN.PATIENTS.BASE);
        const list = extractArray<PatientResponse>(response.data);
        return list;
    },

    getById: async (id: string): Promise<PatientResponse> => {
        const response = await api.get<ApiResponse<PatientResponse>>(`/Admin/Patient/${id}`);
        return response.data.data!;
    },
};
