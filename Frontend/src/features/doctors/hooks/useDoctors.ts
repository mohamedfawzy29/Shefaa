import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorService } from "../services/doctorService";

export const DOCTORS_QUERY_KEY = ["admin", "doctors"] as const;

export type DoctorFilterTab = "all" | "pending" | "approved" | "suspended" | "rejected";

export function useDoctors(tab: DoctorFilterTab = "all") {
    return useQuery({
        queryKey: [...DOCTORS_QUERY_KEY, tab],
        queryFn: async () => {
            if (tab === "pending") {
                return doctorService.getPendingDoctors();
            }
            const list = await doctorService.getDoctors();
            if (tab === "approved") return list.filter((d) => d.status === 1);
            if (tab === "rejected") return list.filter((d) => d.status === 2);
            if (tab === "suspended") return list.filter((d) => d.status === 3);
            return list;
        },
    });
}

export function useAllDoctorsStats() {
    return useQuery({
        queryKey: [...DOCTORS_QUERY_KEY, "all-stats"],
        queryFn: doctorService.getDoctors,
    });
}

export function useDoctor(id: string | null) {
    return useQuery({
        queryKey: [...DOCTORS_QUERY_KEY, id],
        queryFn: () => doctorService.getDoctorById(id!),
        enabled: !!id,
    });
}

export type DoctorActionType = "approve" | "reject" | "suspend" | "activate";

export function useDoctorAction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, action }: { id: string; action: DoctorActionType }) => {
            switch (action) {
                case "approve":
                    return doctorService.approveDoctor(id);
                case "reject":
                    return doctorService.rejectDoctor(id);
                case "suspend":
                    return doctorService.suspendDoctor(id);
                case "activate":
                    return doctorService.activateDoctor(id);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
        },
    });
}
