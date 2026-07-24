import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse, BranchResponse } from "../types/branch";
import type { CreateBranchFormData, EditBranchFormData } from "../validation/branchSchema";

const BASE = API_ENDPOINTS.ADMIN.BRANCHES.BASE; // /Admin/Branches — Admin area only

export const branchService = {
    getAll: async (): Promise<BranchResponse[]> => {
        try {
            const response = await api.get<ApiResponse<BranchResponse[]>>(BASE);
            return response.data.data ?? [];
        } catch {
            return [];
        }
    },

    getById: async (id: string): Promise<BranchResponse> => {
        const response = await api.get<ApiResponse<BranchResponse>>(`${BASE}/${id}`);
        return response.data.data!;
    },

    create: async (data: CreateBranchFormData): Promise<BranchResponse> => {
        const response = await api.post<ApiResponse<BranchResponse>>(BASE, data);
        return response.data.data!;
    },

    update: async (id: string, data: EditBranchFormData): Promise<BranchResponse> => {
        const response = await api.put<ApiResponse<BranchResponse>>(
            `${BASE}/${id}`,
            data
        );
        return response.data.data!;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`${BASE}/${id}`);
    },
};
