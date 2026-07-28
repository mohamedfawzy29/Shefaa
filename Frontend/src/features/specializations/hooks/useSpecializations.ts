import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { specializationService } from "../services/specializationService";

export const SPECIALIZATIONS_QUERY_KEY = ["admin", "specializations"] as const;

/** Fetch all specializations */
export function useSpecializations() {
    return useQuery({
        queryKey: SPECIALIZATIONS_QUERY_KEY,
        queryFn: specializationService.getAll,
    });
}

/** Create a new specialization (FormData) */
export function useCreateSpecialization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => specializationService.create(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SPECIALIZATIONS_QUERY_KEY });
        },
    });
}

/** Update an existing specialization (FormData) */
export function useUpdateSpecialization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
            specializationService.update(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SPECIALIZATIONS_QUERY_KEY });
        },
    });
}

/** Delete a specialization */
export function useDeleteSpecialization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => specializationService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SPECIALIZATIONS_QUERY_KEY });
        },
    });
}
