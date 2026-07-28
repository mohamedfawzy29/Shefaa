import { useQuery } from "@tanstack/react-query";
import { patientDoctorService, type PatientDoctorFilter } from "../services/patientDoctorService";

export const PATIENT_DOCTORS_QUERY_KEYS = {
    list: (filter?: PatientDoctorFilter) => ["patient", "doctors", filter] as const,
    detail: (id: string) => ["patient", "doctors", id] as const,
};

export function usePatientDoctors(filter?: PatientDoctorFilter) {
    return useQuery({
        queryKey: PATIENT_DOCTORS_QUERY_KEYS.list(filter),
        queryFn: () => patientDoctorService.getDoctors(filter),
        staleTime: 1000 * 60 * 5, // 5 min cache — doctor list rarely changes
    });
}

export function usePatientDoctorDetail(id: string | null) {
    return useQuery({
        queryKey: PATIENT_DOCTORS_QUERY_KEYS.detail(id ?? ""),
        queryFn: () => patientDoctorService.getDoctorById(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}
