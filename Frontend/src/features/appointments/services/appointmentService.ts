import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse, AppointmentResponse } from "../types/appointment";

const BASE = API_ENDPOINTS.APPOINTMENTS.BASE;

export const appointmentService = {
    getAll: async (): Promise<AppointmentResponse[]> => {
        const response = await api.get<ApiResponse<AppointmentResponse[]>>(BASE);
        return response.data.data ?? [];
    },

    getById: async (id: string): Promise<AppointmentResponse> => {
        const response = await api.get<ApiResponse<AppointmentResponse>>(`${BASE}/${id}`);
        return response.data.data!;
    },
};
