import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../auth/hooks/useAuth";
import { appointmentService } from "../services/appointmentService";

export function useAppointments() {
    const { currentUser } = useAuth();
    const role = currentUser?.role;

    return useQuery({
        queryKey: ["appointments", role ?? "guest"],
        queryFn: () => appointmentService.getByRole(role),
        staleTime: 1000 * 30, // 30s cache
    });
}
