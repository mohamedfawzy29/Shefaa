// ─── Response DTOs (mirror backend exactly) ───────────────────────────────────

export interface UserPhoneNumber {
    /** Exact shape depends on how the backend serialises UserPhoneNumber.
     *  Exposed here as-is from the controller; extend when the backend
     *  model is shared. */
    [key: string]: unknown;
}

export interface UserResponse {
    id: string;                              // Guid serialised as string
    firstName: string;
    lastName: string;
    email: string;
    role: string;                            // first role or ""
    profileImageUrl: string;
    isLockedOut: boolean;
    isActive: boolean;
    phoneNumbers: UserPhoneNumber[];
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data?: T;
    errors?: string[];
}

// ─── Request DTOs (mirror backend exactly) ────────────────────────────────────

export interface AssignRolesRequest {
    userId: string;    // Guid
    roles: string[];
}
