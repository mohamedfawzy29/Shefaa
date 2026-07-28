import { useQuery } from "@tanstack/react-query";
import { doctorService } from "../features/doctors/services/doctorService";
import type { PublicDoctorResponse } from "../features/doctors/types/doctor";

/** All Approved doctors from the public [AllowAnonymous] Patient/Doctor endpoint. */
export function usePublicDoctors() {
    return useQuery<PublicDoctorResponse[]>({
        queryKey: ["public", "doctors"],
        queryFn: () => doctorService.getPublicDoctors(),
        // No client-side status filter needed — backend returns Approved-only.
    });
}

/** Single doctor detail from the public [AllowAnonymous] Patient/Doctor/{id} endpoint.
 *  Includes DoctorSchedules for use by the booking modal (Phase 3). */
export function usePublicDoctor(id: string | undefined) {
    return useQuery<PublicDoctorResponse>({
        queryKey: ["public", "doctors", id],
        queryFn: () => doctorService.getPublicDoctorById(id!),
        enabled: !!id,
    });
}
