import api from "../../../api/axios";
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
    /** GET /api/Patient/Doctor?searchQuery=...&specializationId=...&orderBy=rating */
    getDoctors: async (filter?: PatientDoctorFilter): Promise<PublicDoctorResponse[]> => {
        const params: Record<string, string> = {};
        if (filter?.searchQuery) params.SearchQuery = filter.searchQuery;
        if (filter?.specializationId) params.SpecializationId = filter.specializationId;
        if (filter?.orderBy) params.OrderBy = filter.orderBy;

        try {
            const response = await api.get("/Patient/Doctor", { params });
            const list = extractDoctorArray(response.data);
            if (list.length > 0) return list;
        } catch {
            // Fallback to typo route if backend uses controller name
        }

        try {
            const fallback = await api.get("/Patient/DoctorControlller", { params });
            return extractDoctorArray(fallback.data);
        } catch {
            return [];
        }
    },

    /** GET /api/Patient/Doctor/{id} — returns doctor with schedule for booking */
    getDoctorById: async (id: string): Promise<PublicDoctorResponse> => {
        try {
            const response = await api.get(`/Patient/Doctor/${id}`);
            const doc = extractDoctorObject(response.data);
            if (doc) return doc;
        } catch {
            // Fallback
        }

        const fallback = await api.get(`/Patient/DoctorControlller/${id}`);
        return extractDoctorObject(fallback.data)!;
    },
};
