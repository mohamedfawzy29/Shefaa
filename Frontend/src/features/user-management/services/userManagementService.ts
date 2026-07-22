import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse, AssignRolesRequest, UserResponse } from "../types/userManagement";

export const userManagementService = {
    /** GET /api/Admin/UserManagement */
    getUsers: async (): Promise<UserResponse[]> => {
        const response = await api.get<ApiResponse<UserResponse[]>>(
            API_ENDPOINTS.USER_MANAGEMENT.BASE
        );
        return response.data.data ?? [];
    },

    /** POST /api/Admin/UserManagement/AssignRoles */
    assignRoles: async (request: AssignRolesRequest): Promise<void> => {
        await api.post<ApiResponse<object>>(
            API_ENDPOINTS.USER_MANAGEMENT.ASSIGN_ROLES,
            request
        );
    },

    /** POST /api/Admin/UserManagement/LockUser/{id} */
    lockUser: async (id: string): Promise<void> => {
        await api.post<ApiResponse<object>>(
            `${API_ENDPOINTS.USER_MANAGEMENT.BASE}/LockUser/${id}`
        );
    },

    /** POST /api/Admin/UserManagement/UnlockUser/{id} */
    unlockUser: async (id: string): Promise<void> => {
        await api.post<ApiResponse<object>>(
            `${API_ENDPOINTS.USER_MANAGEMENT.BASE}/UnlockUser/${id}`
        );
    },
};
