import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { DbCounters, ChartDataItem } from "../types/dashboard";
import type { ApiResponse } from "../../doctors/types/doctor";

export const dashboardService = {
    /** GET /api/Admin/Dashboard/counters */
    getCounters: async (): Promise<DbCounters> => {
        const response = await api.get<ApiResponse<DbCounters>>(API_ENDPOINTS.ADMIN.DASHBOARD.COUNTERS);
        return response.data.data!;
    },

    /** GET /api/Admin/Dashboard/appointment-chart */
    getAppointmentChart: async (): Promise<ChartDataItem[]> => {
        const response = await api.get<ApiResponse<ChartDataItem[]>>(API_ENDPOINTS.ADMIN.DASHBOARD.APPOINTMENT_CHART);
        return response.data.data ?? [];
    },

    /** GET /api/Admin/Dashboard/top-specializations-chart */
    getTopSpecializationsChart: async (): Promise<ChartDataItem[]> => {
        const response = await api.get<ApiResponse<ChartDataItem[]>>(API_ENDPOINTS.ADMIN.DASHBOARD.TOP_SPECIALIZATIONS_CHART);
        return response.data.data ?? [];
    },

    /** GET /api/Admin/Dashboard/recent-activities */
    getRecentActivities: async (): Promise<import("../types/dashboard").RecentActivity[]> => {
        const response = await api.get<ApiResponse<import("../types/dashboard").RecentActivity[]>>(API_ENDPOINTS.ADMIN.DASHBOARD.RECENT_ACTIVITIES);
        return response.data.data ?? [];
    },
};
