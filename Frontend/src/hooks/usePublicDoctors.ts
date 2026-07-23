import { useQuery } from "@tanstack/react-query";
import { doctorService } from "../features/doctors/services/doctorService";
import type { DoctorResponse } from "../features/doctors/types/doctor";

/** All approved doctors (status === 1) — used by public patient area */
export function usePublicDoctors() {
    return useQuery<DoctorResponse[]>({
        queryKey: ["public", "doctors"],
        queryFn: async () => {
            const all = await doctorService.getDoctors();
            return all.filter((d) => d.status === 1);
        },
    });
}

/** Single doctor by id — no auth required if backend allows */
export function usePublicDoctor(id: string | undefined) {
    return useQuery<DoctorResponse>({
        queryKey: ["public", "doctors", id],
        queryFn: () => doctorService.getDoctorById(id!),
        enabled: !!id,
    });
}
