/**
 * Matches backend DoctorResponse DTO exactly.
 * Source: Shefaa/DTOs/Response/DoctorResponse.cs
 */
export interface DoctorResponse {
    doctorId: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumbers: string[];
    profileImageUrl: string;
    specialization: string;
    licenseNumber: string;
    yearsOfExperience: number;
    averageRating: number;
    status: number; // 0=Pending, 1=Approved, 2=Rejected, 3=Suspended
}

/**
 * Standard API envelope used by all backend controllers.
 */
export interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data?: T;
    errors?: string[];
}

// Keep backward-compat alias used by DoctorsPage/DoctorsTable
export type Doctor = DoctorResponse;

// Placeholders for CRUD — currently not used by any backend endpoint in the Admin area
export type CreateDoctorRequest = Omit<DoctorResponse, "doctorId" | "userId" | "averageRating">;
export type UpdateDoctorRequest = Partial<CreateDoctorRequest>;
