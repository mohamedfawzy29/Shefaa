import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type {
    AddDoctorBranchRequest,
    MyBranchResponse,
    AddDoctorScheduleRequest,
    DoctorScheduleResponse,
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
        const response = await api.get(API_ENDPOINTS.DOCTOR_CLINIC.MY_BRANCHES);
        const list = extractList<MyBranchResponse>(response.data);
        return list;
    },

    /**
     * GET /api/Doctor/DoctorClinic/MySchedules
     */
    getMySchedules: async (): Promise<DoctorScheduleResponse[]> => {
        const response = await api.get(API_ENDPOINTS.DOCTOR_CLINIC.MY_SCHEDULES);
        const list = extractList<DoctorScheduleResponse>(response.data);
        return list;
    },

    /** POST /api/DoctorArea/DoctorClinic/JoinBranch */
    joinBranch: async (request: AddDoctorBranchRequest): Promise<void> => {
        await api.post("/DoctorArea/DoctorClinic/JoinBranch", request);
    },

    leaveBranch: async (branchId: string): Promise<void> => {
        await api.delete(`/DoctorArea/DoctorClinic/LeaveBranch/${branchId}`);
    },

    /** POST /api/DoctorArea/DoctorClinic/AddSchedule */
    addSchedule: async (request: AddDoctorScheduleRequest): Promise<void> => {
        await api.post(API_ENDPOINTS.DOCTOR_CLINIC.ADD_SCHEDULE, request);
    },

    /**
     * GET /api/DoctorArea/DoctorClinic/TodayAppointments
     * Fallbacks: /api/DoctorArea/DoctorClinic, /api/DoctorClinic/TodayAppointments, /api/DoctorClinic
     */
    getTodayAppointments: async (): Promise<DoctorAppointmentResponse[]> => {
        const response = await api.get(API_ENDPOINTS.DOCTOR_CLINIC.TODAY_APPOINTMENTS);
        const list = extractList<DoctorAppointmentResponse>(response.data);
        return list;
    },
};
