import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../auth/hooks/useAuth";
import { appointmentService } from "../services/appointmentService";

export function useAppointments() {
    return useQuery({
        queryKey: ["appointments", "admin"],
        queryFn: () => appointmentService.getAll(),
        staleTime: 1000 * 30, // 30s cache
    });
}
