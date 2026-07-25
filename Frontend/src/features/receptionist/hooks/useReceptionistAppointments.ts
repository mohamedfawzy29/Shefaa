import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { receptionistAppointmentService } from "../services/receptionistAppointmentService";

export const RECEPTIONIST_APPOINTMENTS_QUERY_KEYS = {
    today: (date?: string) => ["receptionist", "appointments", "today", date] as const,
};

export function useReceptionistTodayAppointments(date?: string) {
    return useQuery({
        queryKey: RECEPTIONIST_APPOINTMENTS_QUERY_KEYS.today(date),
        queryFn: () => receptionistAppointmentService.getTodayAppointments(date),
        refetchInterval: 1000 * 30, // Auto-refresh desk queue every 30 seconds
    });
}

export function useCheckInAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => receptionistAppointmentService.checkIn(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["receptionist", "appointments", "today"] });
        },
    });
}

export function useMarkNoShowAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => receptionistAppointmentService.markNoShow(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["receptionist", "appointments", "today"] });
        },
    });
}

export function useUpdateReceptionistBranch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (branchId: string) => receptionistAppointmentService.updateBranch(branchId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["receptionist", "appointments", "today"] });
        },
    });
}
