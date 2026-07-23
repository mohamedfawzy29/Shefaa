import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userManagementService } from "../services/userManagementService";
import type { AssignRolesRequest } from "../types/userManagement";

export const USERS_QUERY_KEY = ["admin", "users"] as const;

/** Fetch all users */
export function useUsers() {
    return useQuery({
        queryKey: USERS_QUERY_KEY,
        queryFn: userManagementService.getUsers,
    });
}

/** Assign roles to a user (replaces current roles) */
export function useAssignRoles() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: AssignRolesRequest) =>
            userManagementService.assignRoles(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
    });
}

/** Lock a user account */
export function useLockUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => userManagementService.lockUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
    });
}

/** Unlock a user account */
export function useUnlockUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => userManagementService.unlockUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
    });
}
