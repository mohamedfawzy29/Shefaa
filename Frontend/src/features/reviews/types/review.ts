export interface ReviewResponse {
    reviewId: string;
    appointmentId: string;
    patientName: string;
    doctorName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data?: T;
    errors?: string[];
}
