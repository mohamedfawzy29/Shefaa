import { useQuery } from "@tanstack/react-query";
import { patientMedicalService } from "../services/patientMedicalService";

export const PATIENT_MEDICAL_QUERY_KEYS = {
    myHistory: ["patient", "medical", "myHistory"] as const,
};

export function usePatientMedicalHistory() {
    return useQuery({
        queryKey: PATIENT_MEDICAL_QUERY_KEYS.myHistory,
        queryFn: patientMedicalService.getMyMedicalHistory,
    });
}
