import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorClinicService } from "../services/doctorClinicService";
import { useBranches } from "../../lookups/hooks/useLookups";
import type {
    AddDoctorBranchRequest,
    AddDoctorScheduleRequest,
    EnrichedMyBranch,
    EnrichedDoctorSchedule,
} from "../types/doctorClinic";

export const DOCTOR_CLINIC_QUERY_KEYS = {
    myBranches: ["doctor", "clinic", "myBranches"] as const,
    mySchedules: ["doctor", "clinic", "mySchedules"] as const,
    todayAppointments: ["doctor", "clinic", "todayAppointments"] as const,
};

/**
 * Fetches current doctor's joined branches and enriches each item with
 * its human-readable branchName by cross-referencing useBranches() lookup.
 */
export function useMyBranches(options?: { enabled?: boolean }) {
    const { data: allBranches = [], isLoading: isBranchesLoading } = useBranches();

    const query = useQuery({
        queryKey: DOCTOR_CLINIC_QUERY_KEYS.myBranches,
        queryFn: doctorClinicService.getMyBranches,
        enabled: options?.enabled,
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

/**
 * Fetches current doctor's working hours/schedules and enriches them with branch names.
 */
export function useMySchedules() {
    const { data: allBranches = [], isLoading: isBranchesLoading } = useBranches();

    const query = useQuery({
        queryKey: DOCTOR_CLINIC_QUERY_KEYS.mySchedules,
        queryFn: doctorClinicService.getMySchedules,
    });

    const enrichedSchedules: EnrichedDoctorSchedule[] = (query.data ?? []).map((schedule) => {
        const match = allBranches.find((b) => b.id.toLowerCase() === schedule.branchId.toLowerCase());
        return {
            ...schedule,
            branchName: match ? match.name : `Branch (${schedule.branchId.slice(0, 8)}...)`,
        };
    });

    return {
        ...query,
        data: enrichedSchedules,
        rawSchedules: query.data ?? [],
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

/** Hook to leave a branch */
export function useLeaveBranch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (branchId: string) => doctorClinicService.leaveBranch(branchId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DOCTOR_CLINIC_QUERY_KEYS.myBranches });
            queryClient.invalidateQueries({ queryKey: DOCTOR_CLINIC_QUERY_KEYS.mySchedules });
        },
    });
}

/** Hook to add working hours / schedule */
export function useAddSchedule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: AddDoctorScheduleRequest) => doctorClinicService.addSchedule(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DOCTOR_CLINIC_QUERY_KEYS.mySchedules });
        },
    });
}

/** Hook for Doctor's today appointments */
export function useTodayAppointments() {
    return useQuery({
        queryKey: DOCTOR_CLINIC_QUERY_KEYS.todayAppointments,
        queryFn: doctorClinicService.getTodayAppointments,
    });
}
