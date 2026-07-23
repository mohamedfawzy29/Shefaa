import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse, PatientResponse } from "../types/patient";

const BASE = API_ENDPOINTS.PATIENTS.BASE;

export const patientService = {
    getAll: async (): Promise<PatientResponse[]> => {
        const response = await api.get<ApiResponse<PatientResponse[]>>(BASE);
        return response.data.data ?? [];
    },

    getById: async (id: string): Promise<PatientResponse> => {
        const response = await api.get<ApiResponse<PatientResponse>>(`${BASE}/${id}`);
        return response.data.data!;
    },
};
