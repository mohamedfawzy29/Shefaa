import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { branchService } from "../services/branchService";
import type { CreateBranchFormData, EditBranchFormData } from "../validation/branchSchema";

export const BRANCHES_QUERY_KEY = ["admin", "branches"] as const;

export function useBranches() {
    return useQuery({
        queryKey: BRANCHES_QUERY_KEY,
        queryFn: branchService.getAll,
    });
}

export function useCreateBranch() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBranchFormData) => branchService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRANCHES_QUERY_KEY });
        },
    });
}

export function useUpdateBranch() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: EditBranchFormData }) =>
            branchService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRANCHES_QUERY_KEY });
        },
    });
}

export function useDeleteBranch() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => branchService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRANCHES_QUERY_KEY });
        },
    });
}
