import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { CreateMedicalRecordRequest } from "../types/doctorMedical";
import type { MedicalRecordResponse } from "../../patient-medical/types/patientMedical";

function extractList(data: unknown): MedicalRecordResponse[] {
    if (!data) return [];
    if (Array.isArray(data)) return data as MedicalRecordResponse[];
    if (typeof data === "object") {
        const obj = data as Record<string, unknown>;
        if (Array.isArray(obj.data)) return obj.data as MedicalRecordResponse[];
        if (Array.isArray(obj.result)) return obj.result as MedicalRecordResponse[];
        if (Array.isArray(obj.items)) return obj.items as MedicalRecordResponse[];
    }
    return [];
}

export const doctorMedicalService = {
    /**
     * POST /api/DoctorArea/DoctorMedical/CreatePrescription
     * Fallbacks: /api/DoctorMedical/CreatePrescription, /api/DoctorMedical
     */
    createPrescription: async (request: CreateMedicalRecordRequest): Promise<void> => {
        const endpoints = [
            API_ENDPOINTS.DOCTOR_MEDICAL.CREATE_PRESCRIPTION, // /DoctorArea/DoctorMedical/CreatePrescription
            "/DoctorMedical/CreatePrescription",
            "/DoctorMedical",
        ];

        let lastErr: unknown;
        for (const ep of endpoints) {
            try {
                await api.post(ep, request);
                return;
            } catch (err) {
                lastErr = err;
            }
        }
        throw lastErr;
    },

    /**
     * GET /api/DoctorArea/DoctorMedical/{patientId}
     * Fallbacks: /api/DoctorMedical/{patientId}, /api/Patient/MedicalRecord/byappointment/{patientId}
     */
    getPatientMedicalHistory: async (patientId: string): Promise<MedicalRecordResponse[]> => {
        const endpoints = [
            `${API_ENDPOINTS.DOCTOR_MEDICAL.BASE}/${patientId}`,
            `/DoctorMedical/${patientId}`,
            `/Patient/MedicalRecord/byappointment/${patientId}`,
        ];

        for (const ep of endpoints) {
            try {
                const response = await api.get(ep);
                const list = extractList(response.data);
                if (list.length > 0 || Array.isArray(response.data) || response.data?.data) {
                    return list;
                }
            } catch {
                // Try next fallback
            }
        }
        return [];
    },
};
