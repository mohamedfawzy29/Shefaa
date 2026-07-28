import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationService } from "../services/organizationService";
import type { CreateOrganizationFormData, EditOrganizationFormData } from "../validation/organizationSchema";

export const ORGANIZATIONS_QUERY_KEY = ["admin", "organizations"] as const;

export function useOrganizations() {
    return useQuery({
        queryKey: ORGANIZATIONS_QUERY_KEY,
        queryFn: organizationService.getAll,
    });
}

export function useCreateOrganization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateOrganizationFormData) => organizationService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_QUERY_KEY });
        },
    });
}

export function useUpdateOrganization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: EditOrganizationFormData }) =>
            organizationService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_QUERY_KEY });
        },
    });
}

export function useDeleteOrganization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => organizationService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_QUERY_KEY });
        },
    });
}
