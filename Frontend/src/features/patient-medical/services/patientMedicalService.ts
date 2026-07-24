import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse } from "../../doctors/types/doctor";
import type { MedicalRecordResponse } from "../types/patientMedical";

const BASE = API_ENDPOINTS.PATIENT_MEDICAL.BASE; // /Patient/MedicalRecord (Patient Area)

export const patientMedicalService = {
    /** GET /api/Patient/MedicalRecord/myhistory */
    getMyMedicalHistory: async (): Promise<MedicalRecordResponse[]> => {
        try {
            const response = await api.get<ApiResponse<MedicalRecordResponse[]>>(`${BASE}/myhistory`);
            return response.data.data ?? [];
        } catch {
            return [];
        }
    },

    /** GET /api/Patient/MedicalRecord/byappointment/{id} */
    getRecordByAppointment: async (appointmentId: string): Promise<MedicalRecordResponse> => {
        const response = await api.get<ApiResponse<MedicalRecordResponse>>(`${BASE}/byappointment/${appointmentId}`);
        return response.data.data!;
    },
};
