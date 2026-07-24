import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type {
    AddDoctorBranchRequest,
    MyBranchResponse,
    AddDoctorScheduleRequest,
    DoctorAppointmentResponse,
} from "../types/doctorClinic";

function extractList<T>(data: unknown): T[] {
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

const BASE = API_ENDPOINTS.DOCTOR_CLINIC.BASE; // /DoctorArea/DoctorClinic

export const doctorClinicService = {
    /**
     * GET /api/DoctorArea/DoctorClinic/MyBranches
     * Fallbacks: /api/DoctorClinic/MyBranches, /api/Doctor/MyBranches
     */
    getMyBranches: async (): Promise<MyBranchResponse[]> => {
        const endpoints = [
            API_ENDPOINTS.DOCTOR_CLINIC.MY_BRANCHES,
            "/DoctorClinic/MyBranches",
            "/Doctor/MyBranches",
        ];

        for (const ep of endpoints) {
            try {
                const response = await api.get(ep);
                const list = extractList<MyBranchResponse>(response.data);
                if (list.length > 0 || Array.isArray(response.data) || response.data?.data) {
                    return list;
                }
            } catch {
                // Fallback to next endpoint
            }
        }
        return [];
    },

    /** POST /api/DoctorArea/DoctorClinic/JoinBranch */
    joinBranch: async (request: AddDoctorBranchRequest): Promise<void> => {
        try {
            await api.post(API_ENDPOINTS.DOCTOR_CLINIC.JOIN_BRANCH, request);
        } catch {
            await api.post("/DoctorClinic/JoinBranch", request);
        }
    },

    /** POST /api/DoctorArea/DoctorClinic/AddSchedule */
    addSchedule: async (request: AddDoctorScheduleRequest): Promise<void> => {
        try {
            await api.post(API_ENDPOINTS.DOCTOR_CLINIC.ADD_SCHEDULE, request);
        } catch {
            await api.post("/DoctorClinic/AddSchedule", request);
        }
    },

    /**
     * GET /api/DoctorArea/DoctorClinic/TodayAppointments
     * Fallbacks: /api/DoctorArea/DoctorClinic, /api/DoctorClinic/TodayAppointments, /api/DoctorClinic
     */
    getTodayAppointments: async (): Promise<DoctorAppointmentResponse[]> => {
        const endpoints = [
            API_ENDPOINTS.DOCTOR_CLINIC.TODAY_APPOINTMENTS, // /DoctorArea/DoctorClinic/TodayAppointments
            BASE,                                           // /DoctorArea/DoctorClinic
            "/DoctorClinic/TodayAppointments",              // /DoctorClinic/TodayAppointments
            "/DoctorClinic",                                // /DoctorClinic
        ];

        for (const ep of endpoints) {
            try {
                const response = await api.get(ep);
                const list = extractList<DoctorAppointmentResponse>(response.data);
                if (list.length > 0 || Array.isArray(response.data) || response.data?.data) {
                    return list;
                }
            } catch {
                // Fallback to next endpoint
            }
        }
        return [];
    },
};
