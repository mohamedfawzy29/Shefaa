import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientAppointmentService } from "../services/patientAppointmentService";
import type { BookAppointmentRequest } from "../types/patientAppointment";

export const PATIENT_APPOINTMENTS_QUERY_KEYS = {
    myAppointments: ["patient", "appointments", "myAppointments"] as const,
};

export function usePatientAppointments() {
    return useQuery({
        queryKey: PATIENT_APPOINTMENTS_QUERY_KEYS.myAppointments,
        queryFn: patientAppointmentService.getMyAppointments,
    });
}

export function useBookAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: BookAppointmentRequest) =>
            patientAppointmentService.bookAppointment(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PATIENT_APPOINTMENTS_QUERY_KEYS.myAppointments });
        },
    });
}

export function useCancelPatientAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => patientAppointmentService.cancelAppointment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PATIENT_APPOINTMENTS_QUERY_KEYS.myAppointments });
        },
    });
}

export function useReschedulePatientAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, request }: { id: string, request: { newAppointmentDate: string; newStartTime: string; newEndTime: string } }) =>
            patientAppointmentService.rescheduleAppointment(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PATIENT_APPOINTMENTS_QUERY_KEYS.myAppointments });
        },
    });
}
