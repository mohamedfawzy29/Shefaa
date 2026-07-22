import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse, ReviewResponse } from "../types/review";

const BASE = API_ENDPOINTS.REVIEWS.BASE;

export const reviewService = {
    getAll: async (): Promise<ReviewResponse[]> => {
        const response = await api.get<ApiResponse<ReviewResponse[]>>(BASE);
        return response.data.data ?? [];
    },

    getById: async (id: string): Promise<ReviewResponse> => {
        const response = await api.get<ApiResponse<ReviewResponse>>(`${BASE}/${id}`);
        return response.data.data!;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`${BASE}/${id}`);
    },
};
