import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorClinicService } from "../services/doctorClinicService";
import { useBranches } from "../../lookups/hooks/useLookups";
import type {
    AddDoctorBranchRequest,
    AddDoctorScheduleRequest,
    EnrichedMyBranch,
} from "../types/doctorClinic";

export const DOCTOR_CLINIC_QUERY_KEYS = {
    myBranches: ["doctor", "clinic", "myBranches"] as const,
    todayAppointments: ["doctor", "clinic", "todayAppointments"] as const,
};

/**
 * Fetches current doctor's joined branches and enriches each item with
 * its human-readable branchName by cross-referencing useBranches() lookup.
 */
export function useMyBranches() {
    const { data: allBranches = [], isLoading: isBranchesLoading } = useBranches();

    const query = useQuery({
        queryKey: DOCTOR_CLINIC_QUERY_KEYS.myBranches,
        queryFn: doctorClinicService.getMyBranches,
    });

    const enrichedBranches: EnrichedMyBranch[] = (query.data ?? []).map((mb) => {
        const match = allBranches.find((b) => b.id.toLowerCase() === mb.branchId.toLowerCase());
        return {
            ...mb,
            branchName: match ? match.name : `Branch (${mb.branchId.slice(0, 8)}...)`,
        };
    });

    return {
        ...query,
        data: enrichedBranches,
        rawBranches: query.data ?? [],
        isLoading: query.isLoading || isBranchesLoading,
    };
}

/** Hook to join a branch */
export function useJoinBranch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: AddDoctorBranchRequest) => doctorClinicService.joinBranch(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DOCTOR_CLINIC_QUERY_KEYS.myBranches });
        },
    });
}

/** Hook to add working hours / schedule */
export function useAddSchedule() {
    return useMutation({
        mutationFn: (request: AddDoctorScheduleRequest) => doctorClinicService.addSchedule(request),
    });
}

/** Hook for Doctor's today appointments */
export function useTodayAppointments() {
    return useQuery({
        queryKey: DOCTOR_CLINIC_QUERY_KEYS.todayAppointments,
        queryFn: doctorClinicService.getTodayAppointments,
    });
}
