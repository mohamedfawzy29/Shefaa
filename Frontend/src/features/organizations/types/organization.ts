export interface OrganizationResponse {
    id: string;
    legalName: string;
    taxNumber: string;
    commercialRegistrationNumber?: string;
    mainEmail: string;
    mainPhone: string;
    logoImg?: string;
    websiteUrl?: string;
    status: string;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data?: T;
    errors?: string[];
}
