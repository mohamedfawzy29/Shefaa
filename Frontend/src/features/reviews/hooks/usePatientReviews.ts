import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientReviewService, type AddReviewRequest, type UpdateReviewRequest } from "../services/patientReviewService";

export const PATIENT_REVIEWS_QUERY_KEYS = {
    all: ["patient", "reviews"] as const,
    myReviews: ["patient", "reviews", "myReviews"] as const,
    doctorReviews: (doctorId: string) => ["patient", "reviews", "doctor", doctorId] as const,
};

export function useMyReviews() {
    return useQuery({
        queryKey: PATIENT_REVIEWS_QUERY_KEYS.myReviews,
        queryFn: patientReviewService.getMyReviews,
    });
}

export function useDoctorReviews(doctorId: string) {
    return useQuery({
        queryKey: PATIENT_REVIEWS_QUERY_KEYS.doctorReviews(doctorId),
        queryFn: () => patientReviewService.getDoctorReviews(doctorId),
        enabled: !!doctorId,
    });
}

export function useAddReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: AddReviewRequest) => patientReviewService.addReview(request),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: PATIENT_REVIEWS_QUERY_KEYS.myReviews });
            queryClient.invalidateQueries({ queryKey: PATIENT_REVIEWS_QUERY_KEYS.doctorReviews(variables.doctorId) });
        },
    });
}

export function useUpdateReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reviewId, request }: { reviewId: string; request: UpdateReviewRequest }) =>
            patientReviewService.updateReview(reviewId, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PATIENT_REVIEWS_QUERY_KEYS.all });
        },
    });
}

export function useDeleteReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewId: string) => patientReviewService.deleteReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PATIENT_REVIEWS_QUERY_KEYS.all });
        },
    });
}
