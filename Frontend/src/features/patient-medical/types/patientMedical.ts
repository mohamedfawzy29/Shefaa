export interface MedicalRecordDoctor {
    doctorId: string;
    user?: {
        firstName: string;
        lastName: string;
        profileImg?: string;
    };
}

export interface MedicalRecordAppointment {
    id: string;
    appointmentDate: string; // ISO String e.g. "2026-07-24"
    startTime: string;
    endTime: string;
    visitReason?: string;
}

export interface MedicalRecordResponse {
    id: string;
    appointmentId: string;
    doctorId: string;
    patientId: string;
    chiefComplaint: string;
    diagnosis: string;
    treatmentPlan: string;
    doctorNotes?: string;
    followUpDate?: string;
    doctor?: MedicalRecordDoctor;
    appointment: MedicalRecordAppointment;
}
