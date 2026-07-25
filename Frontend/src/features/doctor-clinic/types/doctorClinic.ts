
export interface AddDoctorBranchRequest {
    branchId: string;
    consultionFee: number;
    isPrimary: boolean;
}

export interface MyBranchResponse {
    branchId: string;
    consultionFee: number;
    isPrimary: boolean;
}

export interface EnrichedMyBranch extends MyBranchResponse {
    branchName: string;
}

export interface AddDoctorScheduleRequest {
    branchId: string;
    dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
    startTime: string; // TimeSpan format e.g. "09:00:00"
    endTime: string;   // TimeSpan format e.g. "17:00:00"
    slotDurationMinutes: number;
    maxPatients: number;
}

export interface DoctorScheduleResponse {
    id: string;
    branchId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    maxPatients: number;
    isActive: boolean;
}

export interface EnrichedDoctorSchedule extends DoctorScheduleResponse {
    branchName: string;
}

export interface DoctorAppointmentResponse {
    appointmentId: string;
    patientId: string;
    patientName: string;
    visitReason?: string;
    startTime: string;
    endTime: string;
    status: number;
    notes?: string;
    branchName: string;
}
