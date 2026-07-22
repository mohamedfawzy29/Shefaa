import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../services/reviewService";

export const REVIEWS_QUERY_KEY = ["admin", "reviews"] as const;

export function useReviews() {
    return useQuery({
        queryKey: REVIEWS_QUERY_KEY,
        queryFn: reviewService.getAll,
    });
}

export function useDeleteReview() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => reviewService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
        },
    });
}
