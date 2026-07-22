import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";

export interface LookupItem {
    id: string;
    name: string;
    organizationId?: string;
}

export function useSpecializations() {
    return useQuery({
        queryKey: ["lookup", "specializations"],
        queryFn: async () => {
            const res = await api.get("/Lookup/Specializations");
            return res.data.data as LookupItem[];
        },
    });
}

export function useBranches() {
    return useQuery({
        queryKey: ["lookup", "branches"],
        queryFn: async () => {
            const res = await api.get("/Lookup/Branches");
            return res.data.data as LookupItem[];
        },
    });
}

export function useOrganizations() {
    return useQuery({
        queryKey: ["lookup", "organizations"],
        queryFn: async () => {
            const res = await api.get("/Lookup/Organizations");
            return res.data.data as LookupItem[];
        },
    });
}