// ─── Response DTOs (mirror backend exactly) ───────────────────────────────────

export interface SpecializationResponse {
    id: string;           // Guid serialised as string
    name: string;
    description?: string;
    iconImg?: string;     // backend field name is iconImg
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data?: T;
    errors?: string[];
}
