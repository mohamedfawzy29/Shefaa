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
        const response = await api.get(API_ENDPOINTS.ADMIN.REVIEWS.BASE);
        const list = extractArray<ReviewResponse>(response.data);
        return list;
    },

    getById: async (id: string): Promise<ReviewResponse> => {
        const response = await api.get<ApiResponse<ReviewResponse>>(`/Admin/Review/${id}`);
        return response.data.data!;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/Admin/Review/${id}`);
    },
};
