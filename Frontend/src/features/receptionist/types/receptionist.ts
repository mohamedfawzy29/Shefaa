export interface ReceptionistResponse {
    receptionistId: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumbers: string[];
    branchName: string;
    profileImageUrl?: string;
    status: number; // 0 = Pending, 1 = Approved, 2 = Rejected, 3 = Suspended (Assuming Enum)
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data?: T;
    errors?: string[];
}
