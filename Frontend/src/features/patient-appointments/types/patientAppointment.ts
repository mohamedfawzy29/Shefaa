import type { PublicScheduleResponse } from "../../doctors/types/doctor";

export interface PatientAppointmentDoctor {
    doctorId: string;
    user?: {
        firstName: string;
        lastName: string;
        profileImg?: string;
    };
    specialization?: {
        name: string;
    };
}

export interface PatientAppointmentBranch {
    id: string;
    branchName: string;
    address?: string;
}

export interface PatientAppointment {
    id: string;
    appointmentDate: string; // ISO date string e.g. "2026-07-25"
    startTime: string;       // "09:00:00"
    endTime: string;         // "10:00:00"
    visitReason?: string;
    status: number;          // 0=Scheduled, 1=Completed, 2=Cancelled, 3=CheckedIn, 4=NoShow
    notes?: string;
    doctor?: PatientAppointmentDoctor;
    branch?: PatientAppointmentBranch;
}

/** Request body for POST /api/Patient/Appointment/book */
export interface BookAppointmentRequest {
    doctorId: string;
    branchId: string;
    appointmentDate: string;   // "YYYY-MM-DD"
    startTime: string;         // "HH:mm:ss"
    endTime: string;           // "HH:mm:ss"
    visitReason?: string;
}

/** Request body for PUT /api/Patient/Appiontment/reschedule/{id} */
export interface RescheduleAppointmentRequest {
    newAppointmentDate: string;   // "YYYY-MM-DD"
    newStartTime: string;         // "HH:mm:ss"
    newEndTime: string;           // "HH:mm:ss"
}

/** Used by the booking modal to represent a selectable time slot */
export interface TimeSlot {
    startTime: string;   // "HH:mm"
    endTime: string;     // "HH:mm"
    schedule: PublicScheduleResponse;
}
