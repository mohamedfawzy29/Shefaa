import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profileService";
import type { UpdateProfileRequest, ChangePasswordRequest } from "../types/profile";

export const PROFILE_QUERY_KEY = ["profile"] as const;

export function useProfile() {
    return useQuery({
        queryKey: PROFILE_QUERY_KEY,
        queryFn: profileService.getProfile,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateProfileRequest) => profileService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        },
    });
}

export function useUpdatePassword() {
    return useMutation({
        mutationFn: (data: ChangePasswordRequest) => profileService.updatePassword(data),
    });
}

export function useUpdateProfileImage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file: File) => profileService.updateProfileImage(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        },
    });
}
