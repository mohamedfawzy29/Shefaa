import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { DoctorResponse, PublicDoctorResponse } from "../types/doctor";

const ADMIN_BASE = API_ENDPOINTS.ADMIN.DOCTORS.BASE; // /Admin/Doctor
const ADMIN_FALLBACK = API_ENDPOINTS.ADMIN.DOCTORS.FALLBACK; // /Doctor
const PATIENT_DOCTORS_BASE = API_ENDPOINTS.PATIENT_DOCTORS.BASE; // /Patient/DoctorControlller

function extractDoctorArray<T>(data: unknown): T[] {
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

function extractDoctorObject<T>(data: unknown): T | null {
    if (!data) return null;
    if (typeof data === "object" && !Array.isArray(data)) {
        const obj = data as Record<string, unknown>;
        if (obj.data && typeof obj.data === "object") return obj.data as T;
        return data as T;
    }
    return null;
}

export const doctorService = {
    // ── Admin Area endpoints (/api/Doctor or /api/Admin/Doctor) ──────────────

    getDoctors: async (): Promise<DoctorResponse[]> => {
        const response = await api.get(ADMIN_BASE);
        const list = extractDoctorArray<DoctorResponse>(response.data);
        return list;
    },

    getPendingDoctors: async (): Promise<DoctorResponse[]> => {
        const response = await api.get(`${ADMIN_BASE}/Pending`);
        const list = extractDoctorArray<DoctorResponse>(response.data);
        return list;
    },

    getDoctorById: async (id: string): Promise<DoctorResponse> => {
        const response = await api.get(`${ADMIN_BASE}/${id}`);
        return extractDoctorObject<DoctorResponse>(response.data)!;
    },

    approveDoctor: async (id: string): Promise<void> => {
        await api.patch(`${ADMIN_BASE}/${id}/Approve`);
    },

    rejectDoctor: async (id: string): Promise<void> => {
        await api.patch(`${ADMIN_BASE}/${id}/Reject`);
    },

    suspendDoctor: async (id: string): Promise<void> => {
        await api.patch(`${ADMIN_BASE}/${id}/Suspend`);
    },

    activateDoctor: async (id: string): Promise<void> => {
        await api.patch(`${ADMIN_BASE}/${id}/Activate`);
    },

    // ── Patient Area public endpoints (/api/Patient/DoctorControlller) ────────

    /** Public doctor search / browsing for patients & public visitors */
    getPublicDoctors: async (): Promise<PublicDoctorResponse[]> => {
        const endpoints = [
            PATIENT_DOCTORS_BASE,    // /Patient/DoctorControlller
            "/Patient/Doctor",        // /Patient/Doctor
            "/Patient/Doctor/all",
        ];

        for (const ep of endpoints) {
            try {
                const response = await api.get(ep);
                const list = extractDoctorArray<PublicDoctorResponse>(response.data);
                if (list.length > 0 || Array.isArray(response.data) || response.data?.data) {
                    return list;
                }
            } catch {
                // Try next fallback
            }
        }
        return [];
    },

    /** Public doctor detail for booking modal */
    getPublicDoctorById: async (id: string): Promise<PublicDoctorResponse> => {
        try {
            const response = await api.get(`${PATIENT_DOCTORS_BASE}/${id}`);
            const doc = extractDoctorObject<PublicDoctorResponse>(response.data);
            if (doc) return doc;
        } catch {
            // Fallback
        }

        const fallbackRes = await api.get(`/Patient/Doctor/${id}`);
        return extractDoctorObject<PublicDoctorResponse>(fallbackRes.data)!;
    },
};
