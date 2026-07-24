export interface MedicationItem {
    id: string;
    name: string;
    dosage: string;        // e.g. "500mg" or "1 tablet"
    frequency: string;     // e.g. "Every 8 hours" or "Twice daily"
    duration: string;      // e.g. "5 days" or "1 week"
    instructions?: string; // e.g. "Take after meals"
}

export interface CreateMedicalRecordRequest {
    appointmentId: string;
    chiefComplaint: string;
    diagnosis: string;
    treatmentPlan: string;
    doctorNotes?: string;
    followUpDate?: string; // ISO Date String e.g. "2026-08-01"
}
