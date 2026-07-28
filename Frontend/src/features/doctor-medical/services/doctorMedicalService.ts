import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { CreateMedicalRecordRequest } from "../types/doctorMedical";
import type { MedicalRecordResponse } from "../../patient-medical/types/patientMedical";
import type { ApiResponse } from "../../doctors/types/doctor";

export const doctorMedicalService = {
    /**
     * POST /api/DoctorArea/DoctorMedical/CreatePrescription
     * Fallbacks: /api/DoctorMedical/CreatePrescription, /api/DoctorMedical
     */
    createPrescription: async (request: CreateMedicalRecordRequest): Promise<void> => {
        await api.post(API_ENDPOINTS.DOCTOR_MEDICAL.CREATE_PRESCRIPTION, request);
    },

    /** GET /api/DoctorArea/DoctorMedical/ByAppointment/{id} */
    getRecordByAppointment: async (appointmentId: string): Promise<MedicalRecordResponse> => {
        const response = await api.get<ApiResponse<MedicalRecordResponse>>(API_ENDPOINTS.DOCTOR_MEDICAL.BY_APPOINTMENT(appointmentId));
        return response.data.data!;
    },
};
