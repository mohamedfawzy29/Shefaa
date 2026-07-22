import { useQuery } from "@tanstack/react-query";
import { patientService } from "../services/patientService";

export const PATIENTS_QUERY_KEY = ["admin", "patients"] as const;

export function usePatients() {
    return useQuery({
        queryKey: PATIENTS_QUERY_KEY,
        queryFn: patientService.getAll,
    });
}
