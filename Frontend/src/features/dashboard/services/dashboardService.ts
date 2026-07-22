import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { DbCounters, ChartDataItem } from "../types/dashboard";

export const dashboardService = {
    getCounters: async (): Promise<DbCounters> => {
        const response = await api.get<DbCounters>(API_ENDPOINTS.DASHBOARD.COUNTERS);
        return response.data;
    },

    getAppointmentChart: async (): Promise<ChartDataItem[]> => {
        const response = await api.get<ChartDataItem[]>(API_ENDPOINTS.DASHBOARD.APPOINTMENT_CHART);
        return response.data;
    },

    getTopSpecializationsChart: async (): Promise<ChartDataItem[]> => {
        const response = await api.get<ChartDataItem[]>(API_ENDPOINTS.DASHBOARD.TOP_SPECIALIZATIONS_CHART);
        return response.data;
    },
};
