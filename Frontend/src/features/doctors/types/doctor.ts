/**
 * Matches backend DoctorResponse DTO exactly.
 * Source: Shefaa/DTOs/Response/DoctorResponse.cs
 * Used by Admin pages only (requires ADMIN_ROLE).
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
 * Safe public-facing doctor type — no PII.
 * Matches backend PublicDoctorResponse DTO.
 * Source: Shefaa/DTOs/Response/PublicDoctorResponse.cs
 * Used by public pages (HomePage, PublicDoctorsPage, PublicDoctorDetailPage).
 */
export interface PublicDoctorResponse {
    doctorId: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    specialization: string;
    bio: string;
    yearsOfExperience: number;
    averageRating: number;
    status: number; // 0=Pending, 1=Approved, 2=Rejected, 3=Suspended
    doctorSchedules: PublicScheduleResponse[];
    bookedSlots?: PublicBookedSlotResponse[];
}

export interface PublicBookedSlotResponse {
    date: string; // "YYYY-MM-DD"
    startTime: string; // "HH:mm:ss"
}

/**
 * Doctor schedule as returned by the public detail endpoint.
 * Matches backend PublicScheduleResponse DTO.
 * Used by the booking modal to compute available time slots.
 */
export interface PublicScheduleResponse {
    id: string;
    branchId: string;
    dayOfWeek: number;         // 0=Sunday … 6=Saturday (JS DayOfWeek enum)
    startTime: string;         // "HH:mm:ss"
    endTime: string;           // "HH:mm:ss"
    slotDurationMinutes: number;
    maxPatients: number;
    isActive: boolean;
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
