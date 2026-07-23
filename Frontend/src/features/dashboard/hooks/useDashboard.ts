import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export const DASHBOARD_KEYS = {
    all: ["dashboard"] as const,
    counters: () => [...DASHBOARD_KEYS.all, "counters"] as const,
    appointmentChart: () => [...DASHBOARD_KEYS.all, "appointment-chart"] as const,
    specializationsChart: () => [...DASHBOARD_KEYS.all, "specializations-chart"] as const,
};

export function useDashboardCounters() {
    return useQuery({
        queryKey: DASHBOARD_KEYS.counters(),
        queryFn: dashboardService.getCounters,
    });
}

export function useAppointmentChart() {
    return useQuery({
        queryKey: DASHBOARD_KEYS.appointmentChart(),
        queryFn: dashboardService.getAppointmentChart,
    });
}

export function useTopSpecializationsChart() {
    return useQuery({
        queryKey: DASHBOARD_KEYS.specializationsChart(),
        queryFn: dashboardService.getTopSpecializationsChart,
    });
}
