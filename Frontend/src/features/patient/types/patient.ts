export interface PatientResponse {
    patientId: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumbers: string[];
    address?: string;
    nationalId?: string;
    emergencyContact?: string;
    bloodType?: string;
    profileImageUrl?: string;
    isActive: boolean;
    isLockedOut: boolean;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data?: T;
    errors?: string[];
}
