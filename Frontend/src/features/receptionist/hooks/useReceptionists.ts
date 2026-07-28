import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { receptionistService } from "../services/receptionistService";

export const RECEPTIONISTS_QUERY_KEY = ["admin", "receptionists"] as const;

export function useReceptionists() {
    return useQuery({
        queryKey: RECEPTIONISTS_QUERY_KEY,
        queryFn: receptionistService.getAll,
    });
}

export function useCreateReceptionist() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => receptionistService.create(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RECEPTIONISTS_QUERY_KEY });
        },
    });
}

export function useChangeReceptionistStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, action }: { id: string; action: "approve" | "reject" | "suspend" | "activate" }) => {
            switch (action) {
                case "approve": return receptionistService.approve(id);
                case "reject": return receptionistService.reject(id);
                case "suspend": return receptionistService.suspend(id);
                case "activate": return receptionistService.activate(id);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RECEPTIONISTS_QUERY_KEY });
        },
    });
}
