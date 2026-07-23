import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "../services/appointmentService";

export const APPOINTMENTS_QUERY_KEY = ["admin", "appointments"] as const;

export function useAppointments() {
    return useQuery({
        queryKey: APPOINTMENTS_QUERY_KEY,
        queryFn: appointmentService.getAll,
    });
}
