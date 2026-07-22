import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignRolesSchema, type AssignRolesFormData } from "../../validation/userManagementSchema";
import { useAssignRoles } from "../../hooks/useUserManagement";
import type { UserResponse } from "../../types/userManagement";
import { Modal } from "../../../../components/ui/Modal";
import { Select } from "../../../../components/ui/Select";
import { Button } from "../../../../components/ui/Button";

/**
 * Available system roles.
 * These must match the roles seeded/created on the backend.
 * Backend validates each role via _roleManager.RoleExistsAsync().
 */
const SYSTEM_ROLES = [
    { label: "Select a role…", value: "" },
    { label: "Admin", value: "Admin" },
    { label: "Doctor", value: "Doctor" },
    { label: "Receptionist", value: "Receptionist" },
    { label: "Patient", value: "Patient" },
];

interface AssignRolesDialogProps {
    user: UserResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export function AssignRolesDialog({ user, isOpen, onClose }: AssignRolesDialogProps) {
    const assignMutation = useAssignRoles();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AssignRolesFormData>({
        resolver: zodResolver(assignRolesSchema),
        defaultValues: { role: "" },
    });

    // Pre-fill the current role when the dialog opens; reset on close
    useEffect(() => {
        if (isOpen && user) {
            reset({ role: user.role ?? "" });
        } else {
            reset({ role: "" });
        }
    }, [isOpen, user, reset]);

    const onSubmit = (data: AssignRolesFormData) => {
        if (!user) return;

        // Backend expects: { userId: Guid, roles: string[] }
        assignMutation.mutate(
            {
                userId: user.id,
                roles: [data.role],
            },
            { onSuccess: () => onClose() }
        );
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.style.display = "none";
        const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
        if (fallback) fallback.style.display = "flex";
    };

    const initials = (user?.firstName ?? "U").charAt(0).toUpperCase();

    const footer = (
        <>
            <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
            </Button>
            <Button
                type="submit"
                form="assign-roles-form"
                loading={assignMutation.isPending}
            >
                Save Role
            </Button>
        </>
    );

    return (
        <Modal
            title="Assign Role"
            open={isOpen}
            onClose={onClose}
            footer={footer}
            maxWidth="sm"
        >
            {/* User identity strip */}
            <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                    {user?.profileImageUrl ? (
                        <>
                            <img
                                src={user.profileImageUrl}
                                alt={`${user.firstName ?? ""} ${user.lastName ?? ""}`}
                                className="h-full w-full object-cover rounded-full"
                                onError={handleImageError}
                            />
                            <span
                                className="text-blue-600 font-bold text-sm hidden items-center justify-center h-full w-full"
                                aria-hidden="true"
                            >
                                {initials}
                            </span>
                        </>
                    ) : (
                        <span className="text-blue-600 font-bold text-sm">
                            {initials}
                        </span>
                    )}
                </div>
                <div>
                    <p className="font-semibold text-slate-900">
                        {user?.firstName ?? ""} {user?.lastName ?? ""}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email ?? ""}</p>
                </div>
            </div>

            <form
                id="assign-roles-form"
                onSubmit={handleSubmit(onSubmit)}
                aria-label="Assign system role"
            >
                <Select
                    label="System Role"
                    error={errors.role?.message}
                    options={SYSTEM_ROLES}
                    {...register("role")}
                />
                {assignMutation.isError && (
                    <p
                        role="alert"
                        className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg p-2"
                    >
                        Failed to assign role. Please try again.
                    </p>
                )}
            </form>
        </Modal>
    );
}
