import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse, ReceptionistResponse } from "../types/receptionist";

const BASE = API_ENDPOINTS.RECEPTIONISTS.BASE;

export const receptionistService = {
    getAll: async (): Promise<ReceptionistResponse[]> => {
        const response = await api.get<ApiResponse<ReceptionistResponse[]>>(BASE);
        return response.data.data ?? [];
    },

    getPending: async (): Promise<ReceptionistResponse[]> => {
        const response = await api.get<ApiResponse<ReceptionistResponse[]>>(`${BASE}/Pending`);
        return response.data.data ?? [];
    },

    create: async (formData: FormData): Promise<ReceptionistResponse> => {
        const response = await api.post<ApiResponse<ReceptionistResponse>>(BASE, formData);
        return response.data.data!;
    },

    approve: async (id: string): Promise<void> => {
        await api.patch(`${BASE}/${id}/Approve`);
    },

    reject: async (id: string): Promise<void> => {
        await api.patch(`${BASE}/${id}/Reject`);
    },

    suspend: async (id: string): Promise<void> => {
        await api.patch(`${BASE}/${id}/Suspend`);
    },

    activate: async (id: string): Promise<void> => {
        await api.patch(`${BASE}/${id}/Activate`);
    },
};
