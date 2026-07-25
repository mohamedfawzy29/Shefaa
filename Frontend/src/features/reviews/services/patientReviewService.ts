import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse, ReviewResponse } from "../types/review";

export interface AddReviewRequest {
    doctorId: string;
    appointmentId: string;
    rating: number;
    comment: string;
}

export interface UpdateReviewRequest {
    rating: number;
    comment: string;
}

export const patientReviewService = {
    /** POST /api/Patient/Reviews/add */
    addReview: async (request: AddReviewRequest): Promise<void> => {
        await api.post(API_ENDPOINTS.PATIENT_REVIEWS.ADD, request);
    },

    /** GET /api/Patient/Reviews/myreviews */
    getMyReviews: async (): Promise<ReviewResponse[]> => {
        const response = await api.get<ApiResponse<ReviewResponse[]>>(API_ENDPOINTS.PATIENT_REVIEWS.MY_REVIEWS);
        return response.data.data ?? [];
    },

    /** PUT /api/Patient/Reviews/update/{id} */
    updateReview: async (reviewId: string, request: UpdateReviewRequest): Promise<void> => {
        await api.put(API_ENDPOINTS.PATIENT_REVIEWS.UPDATE(reviewId), request);
    },

    /** DELETE /api/Patient/Reviews/delete/{id} */
    deleteReview: async (reviewId: string): Promise<void> => {
        await api.delete(API_ENDPOINTS.PATIENT_REVIEWS.DELETE(reviewId));
    },

    /** GET /api/Patient/Reviews/doctor/{id} */
    getDoctorReviews: async (doctorId: string): Promise<ReviewResponse[]> => {
        const response = await api.get<ApiResponse<ReviewResponse[]>>(API_ENDPOINTS.PATIENT_REVIEWS.BY_DOCTOR(doctorId));
        return response.data.data ?? [];
    },
};
