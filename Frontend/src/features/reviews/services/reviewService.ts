import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse, ReviewResponse } from "../types/review";

function extractArray<T>(data: unknown): T[] {
    if (!data) return [];
    if (Array.isArray(data)) return data as T[];
    if (typeof data === "object") {
        const obj = data as Record<string, unknown>;
        if (Array.isArray(obj.data)) return obj.data as T[];
        if (Array.isArray(obj.result)) return obj.result as T[];
        if (Array.isArray(obj.items)) return obj.items as T[];
    }
    return [];
}

export const reviewService = {
    getAll: async (): Promise<ReviewResponse[]> => {
        const endpoints = [
            API_ENDPOINTS.ADMIN.REVIEWS.FALLBACK,    // /Review
            `${API_ENDPOINTS.ADMIN.REVIEWS.FALLBACK}/all`,
            API_ENDPOINTS.ADMIN.REVIEWS.BASE,        // /Admin/Review
            `${API_ENDPOINTS.ADMIN.REVIEWS.BASE}/all`,
        ];

        for (const ep of endpoints) {
            try {
                const response = await api.get(ep);
                const list = extractArray<ReviewResponse>(response.data);
                if (list.length > 0 || Array.isArray(response.data) || response.data?.data) {
                    return list;
                }
            } catch {
                // Try next fallback
            }
        }
        return [];
    },

    getById: async (id: string): Promise<ReviewResponse> => {
        try {
            const response = await api.get<ApiResponse<ReviewResponse>>(`/Review/${id}`);
            return response.data.data!;
        } catch {
            const fallback = await api.get<ApiResponse<ReviewResponse>>(`/Admin/Review/${id}`);
            return fallback.data.data!;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/Review/${id}`);
        } catch {
            await api.delete(`/Admin/Review/${id}`);
        }
    },
};
