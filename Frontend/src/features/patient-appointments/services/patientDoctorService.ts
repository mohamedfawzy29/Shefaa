import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { PublicDoctorResponse } from "../../doctors/types/doctor";

export interface PatientDoctorFilter {
    searchQuery?: string;
    specializationId?: string;
    orderBy?: "rating";
}

function extractDoctorArray(data: unknown): PublicDoctorResponse[] {
    if (!data) return [];
    if (Array.isArray(data)) return data as PublicDoctorResponse[];
    if (typeof data === "object") {
        const obj = data as Record<string, unknown>;
        if (Array.isArray(obj.data)) return obj.data as PublicDoctorResponse[];
        if (Array.isArray(obj.result)) return obj.result as PublicDoctorResponse[];
        if (Array.isArray(obj.items)) return obj.items as PublicDoctorResponse[];
    }
    return [];
}

function extractDoctorObject(data: unknown): PublicDoctorResponse | null {
    if (!data) return null;
    if (typeof data === "object" && !Array.isArray(data)) {
        const obj = data as Record<string, unknown>;
        if (obj.data && typeof obj.data === "object") return obj.data as PublicDoctorResponse;
        return data as PublicDoctorResponse;
    }
    return null;
}

export const patientDoctorService = {
    /** GET /api/Patient/DoctorControlller?searchQuery=...&specializationId=...&orderBy=rating */
    getDoctors: async (filter?: PatientDoctorFilter): Promise<PublicDoctorResponse[]> => {
        const params: Record<string, string> = {};
        if (filter?.searchQuery) params.SearchQuery = filter.searchQuery;
        if (filter?.specializationId) params.SpecializationId = filter.specializationId;
        if (filter?.orderBy) params.OrderBy = filter.orderBy;

        const response = await api.get(API_ENDPOINTS.PATIENT_DOCTORS.BASE, { params });
        return extractDoctorArray(response.data);
    },

    /** GET /api/Patient/DoctorControlller/{id} */
    getDoctorById: async (id: string): Promise<PublicDoctorResponse> => {
        const response = await api.get(`${API_ENDPOINTS.PATIENT_DOCTORS.BASE}/${id}`);
        return extractDoctorObject(response.data)!;
    },
};
