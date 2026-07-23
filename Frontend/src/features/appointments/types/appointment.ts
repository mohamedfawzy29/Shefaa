export interface AppointmentResponse {
    appointmentId: string;
    patientName: string;
    doctorName: string;
    branchName: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    visitReason: string;
    notes: string;
    status: number; // 0=Scheduled, 1=Completed, 2=Cancelled, 3=NoShow
    createdAt: string;
    updatedAt: string;
    cancelledAt?: string;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data?: T;
    errors?: string[];
}
