import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse, DoctorResponse } from "../types/doctor";

const BASE = API_ENDPOINTS.DOCTORS.BASE;

export const doctorService = {
    getDoctors: async (): Promise<DoctorResponse[]> => {
        const response = await api.get<ApiResponse<DoctorResponse[]>>(BASE);
        return response.data.data ?? [];
    },

    getPendingDoctors: async (): Promise<DoctorResponse[]> => {
        const response = await api.get<ApiResponse<DoctorResponse[]>>(`${BASE}/Pending`);
        return response.data.data ?? [];
    },

    getDoctorById: async (id: string): Promise<DoctorResponse> => {
        const response = await api.get<ApiResponse<DoctorResponse>>(`${BASE}/${id}`);
        return response.data.data!;
    },

    approveDoctor: async (id: string): Promise<void> => {
        await api.patch(`${BASE}/${id}/Approve`);
    },

    rejectDoctor: async (id: string): Promise<void> => {
        await api.patch(`${BASE}/${id}/Reject`);
    },

    suspendDoctor: async (id: string): Promise<void> => {
        await api.patch(`${BASE}/${id}/Suspend`);
    },

    activateDoctor: async (id: string): Promise<void> => {
        await api.patch(`${BASE}/${id}/Activate`);
    },
};
