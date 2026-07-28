import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export const DASHBOARD_KEYS = {
    all: ["dashboard"] as const,
    counters: () => [...DASHBOARD_KEYS.all, "counters"] as const,
    appointmentChart: () => [...DASHBOARD_KEYS.all, "appointment-chart"] as const,
    specializationsChart: () => [...DASHBOARD_KEYS.all, "specializations-chart"] as const,
    recentActivities: () => [...DASHBOARD_KEYS.all, "recent-activities"] as const,
};

export function useDashboardCounters(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: DASHBOARD_KEYS.counters(),
        queryFn: dashboardService.getCounters,
        enabled: options?.enabled,
    });
}

export function useAppointmentChart(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: DASHBOARD_KEYS.appointmentChart(),
        queryFn: dashboardService.getAppointmentChart,
        enabled: options?.enabled,
    });
}

export function useTopSpecializationsChart(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: DASHBOARD_KEYS.specializationsChart(),
        queryFn: dashboardService.getTopSpecializationsChart,
        enabled: options?.enabled,
    });
}

export function useRecentActivities(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: DASHBOARD_KEYS.recentActivities(),
        queryFn: dashboardService.getRecentActivities,
        enabled: options?.enabled,
    });
}
