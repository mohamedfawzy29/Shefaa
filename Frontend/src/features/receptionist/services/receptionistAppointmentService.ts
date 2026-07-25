import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";

export interface ReceptionistAppointmentResponse {
    appointmentId: string;
    patientName: string;
    doctorName: string;
    branchName: string;
    appointmentDate: string; // ISO date string e.g. "2026-07-24"
    startTime: string;       // "09:00:00"
    endTime: string;         // "10:00:00"
    visitReason?: string;
    notes?: string;
    status: number;          // 0=Scheduled, 1=Completed, 2=Cancelled, 3=CheckedIn, 4=NoShow
    createdAt: string;
    updatedAt: string;
    cancelledAt?: string;
}

function extractList(data: unknown): ReceptionistAppointmentResponse[] {
    if (!data) return [];
    if (Array.isArray(data)) return data as ReceptionistAppointmentResponse[];
    if (typeof data === "object") {
        const obj = data as Record<string, unknown>;
        if (Array.isArray(obj.data)) return obj.data as ReceptionistAppointmentResponse[];
        if (Array.isArray(obj.result)) return obj.result as ReceptionistAppointmentResponse[];
        if (Array.isArray(obj.items)) return obj.items as ReceptionistAppointmentResponse[];
    }
    return [];
}

const PRIMARY_BASE = API_ENDPOINTS.RECEPTIONIST_APPOINTMENTS.BASE; // /Receptionist/Appointment

export const receptionistAppointmentService = {
    /**
     * GET /api/Receptionist/Appointment
     * Retrieves appointment queue for the receptionist's assigned branch.
     * Can filter by date. Defaults to today on the backend if no date is provided.
     */
    getTodayAppointments: async (date?: string): Promise<ReceptionistAppointmentResponse[]> => {
        const queryParams = date ? `?date=${date}` : "";
        const endpoints = [
            `${PRIMARY_BASE}${queryParams}`,
            `${PRIMARY_BASE}/Today${queryParams}`,
            `/Appointment${queryParams}`,
            `/Appointment/Today${queryParams}`,
        ];

        for (const ep of endpoints) {
            try {
                const response = await api.get(ep);
                const list = extractList(response.data);
                if (list.length > 0 || Array.isArray(response.data) || response.data?.data) {
                    return list;
                }
            } catch {
                // Try next endpoint
            }
        }
        return [];
    },

    /** PATCH /api/Receptionist/Appointment/{id}/CheckIn */
    checkIn: async (appointmentId: string): Promise<void> => {
        try {
            await api.patch(`${PRIMARY_BASE}/${appointmentId}/CheckIn`);
        } catch {
            await api.patch(`/Appointment/${appointmentId}/CheckIn`);
        }
    },

    /** PATCH /api/Receptionist/Appointment/{id}/NoShow */
    markNoShow: async (appointmentId: string): Promise<void> => {
        try {
            await api.patch(`${PRIMARY_BASE}/${appointmentId}/NoShow`);
        } catch {
            await api.patch(`/Appointment/${appointmentId}/NoShow`);
        }
    },

    /** PATCH /api/Receptionist/Appointment/UpdateBranch */
    updateBranch: async (branchId: string): Promise<void> => {
        const response = await api.patch(`${PRIMARY_BASE}/UpdateBranch`, { branchId });
        return response.data;
    },
};