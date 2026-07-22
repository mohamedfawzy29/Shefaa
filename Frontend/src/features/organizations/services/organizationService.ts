import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse, OrganizationResponse } from "../types/organization";
import type { CreateOrganizationFormData, EditOrganizationFormData } from "../validation/organizationSchema";

const BASE = API_ENDPOINTS.ORGANIZATIONS.BASE;

export const organizationService = {
    /** GET /api/Admin/Organizations */
    getAll: async (): Promise<OrganizationResponse[]> => {
        const response = await api.get<ApiResponse<OrganizationResponse[]>>(BASE);
        return response.data.data ?? [];
    },

    /** GET /api/Admin/Organizations/{id} */
    getById: async (id: string): Promise<OrganizationResponse> => {
        const response = await api.get<ApiResponse<OrganizationResponse>>(`${BASE}/${id}`);
        return response.data.data!;
    },

    /** POST /api/Admin/Organizations */
    create: async (data: CreateOrganizationFormData): Promise<OrganizationResponse> => {
        const response = await api.post<ApiResponse<OrganizationResponse>>(BASE, data);
        return response.data.data!;
    },

    /** PUT /api/Admin/Organizations/{id} */
    update: async (id: string, data: EditOrganizationFormData): Promise<OrganizationResponse> => {
        const response = await api.put<ApiResponse<OrganizationResponse>>(
            `${BASE}/${id}`,
            data
        );
        return response.data.data!;
    },

    /** DELETE /api/Admin/Organizations/{id} */
    delete: async (id: string): Promise<void> => {
        await api.delete(`${BASE}/${id}`);
    },
};
