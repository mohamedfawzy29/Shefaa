export interface BranchResponse {
    id: string;
    branchName: string;
    branchEmail: string;
    country: string;
    city: string;
    governorate: string;
    address: string;
    isActive: boolean;
    organizationId: string;
    organizationName: string;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data?: T;
    errors?: string[];
}
