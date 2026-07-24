import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse } from "../../doctors/types/doctor";
import type { PatientAppointment, BookAppointmentRequest } from "../types/patientAppointment";

const BASE = API_ENDPOINTS.PATIENT_APPOINTMENTS.BASE; // /Patient/Appiontment (Patient Area)

export const patientAppointmentService = {
    /** GET /api/Patient/Appiontment/GetMyAppointments (or my-appointments) */
    getMyAppointments: async (): Promise<PatientAppointment[]> => {
        try {
            const response = await api.get<PatientAppointment[]>(`${BASE}/GetMyAppointments`);
            const data = response.data;
            return Array.isArray(data) ? data : ((data as unknown as ApiResponse<PatientAppointment[]>).data ?? []);
        } catch {
            try {
                const fallback = await api.get<PatientAppointment[]>("/Patient/Appointment/my-appointments");
                const data = fallback.data;
                return Array.isArray(data) ? data : ((data as unknown as ApiResponse<PatientAppointment[]>).data ?? []);
            } catch {
                return [];
            }
        }
    },

    /** POST /api/Patient/Appiontment/book */
    bookAppointment: async (request: BookAppointmentRequest): Promise<void> => {
        try {
            await api.post(`${BASE}/book`, request);
        } catch {
            await api.post("/Patient/Appointment/book", request);
        }
    },

    /** PUT /api/Patient/Appiontment/CancelAppointment/{id} */
    cancelAppointment: async (appointmentId: string): Promise<void> => {
        try {
            await api.put(`${BASE}/CancelAppointment/${appointmentId}`);
        } catch {
            await api.put(`/Patient/Appointment/cancel/${appointmentId}`);
        }
    },
};
