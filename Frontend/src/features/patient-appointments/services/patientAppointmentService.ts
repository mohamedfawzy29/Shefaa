import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse } from "../../doctors/types/doctor";
import type { PatientAppointment, BookAppointmentRequest } from "../types/patientAppointment";

const BASE = API_ENDPOINTS.PATIENT_APPOINTMENTS.BASE; // /Patient/Appiontment (Patient Area)

export const patientAppointmentService = {
    /** GET /api/Patient/Appiontment/my-appointments */
    getMyAppointments: async (): Promise<PatientAppointment[]> => {
        const response = await api.get<PatientAppointment[]>(API_ENDPOINTS.PATIENT_APPOINTMENTS.MY_APPOINTMENTS);
        const data = response.data;
        return Array.isArray(data) ? data : ((data as unknown as ApiResponse<PatientAppointment[]>).data ?? []);
    },

    /** POST /api/Patient/Appiontment/book */
    bookAppointment: async (request: BookAppointmentRequest): Promise<void> => {
        await api.post(API_ENDPOINTS.PATIENT_APPOINTMENTS.BOOK, request);
    },

    /** PUT /api/Patient/Appiontment/cancel/{id} */
    cancelAppointment: async (appointmentId: string): Promise<void> => {
        await api.put(API_ENDPOINTS.PATIENT_APPOINTMENTS.CANCEL_APPOINTMENT(appointmentId));
    },

    /** PUT /api/Patient/Appiontment/reschedule/{id} */
    rescheduleAppointment: async (appointmentId: string, request: { newAppointmentDate: string; newStartTime: string; newEndTime: string }): Promise<void> => {
        await api.put(API_ENDPOINTS.PATIENT_APPOINTMENTS.RESCHEDULE_APPOINTMENT(appointmentId), request);
    },
};
