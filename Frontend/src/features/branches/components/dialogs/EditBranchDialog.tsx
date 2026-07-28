import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Select } from "../../../../components/ui/Select";
import { useUpdateBranch } from "../../hooks/useBranches";
import { useOrganizations } from "../../../organizations/hooks/useOrganizations";
import type { BranchResponse } from "../../types/branch";
import {
    editBranchSchema,
    type EditBranchFormData,
} from "../../validation/branchSchema";

interface EditBranchDialogProps {
    branch: BranchResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EditBranchDialog({ branch, isOpen, onClose }: EditBranchDialogProps) {
    const updateMutation = useUpdateBranch();
    const { data: organizations, isLoading: isLoadingOrgs } = useOrganizations();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<EditBranchFormData>({
        resolver: zodResolver(editBranchSchema),
        defaultValues: {
            isActive: true,
            country: "Egypt",
            organizationId: "",
            branchName: "",
            branchEmail: "",
            city: "",
            governorate: "",
            address: "",
        },
    });

    useEffect(() => {
        if (branch && isOpen) {
            reset({
                isActive: branch.isActive,
                country: branch.country,
                organizationId: branch.organizationId,
                branchName: branch.branchName,
                branchEmail: branch.branchEmail,
                city: branch.city,
                governorate: branch.governorate,
                address: branch.address,
            });
        }
    }, [branch, isOpen, reset]);

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = (data: EditBranchFormData) => {
        if (!branch) return;

        updateMutation.mutate(
            { id: branch.id, data },
            {
                onSuccess: () => handleClose(),
                onError: (error) => {
                    console.error("Failed to update branch:", error);
                    alert(error instanceof Error ? error.message : "Update failed.");
                },
            }
        );
    };

    const orgOptions = organizations?.map((o) => ({
        label: o.legalName,
        value: o.id,
    })) || [];

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            title="Edit Branch"
            >
            <p className="text-sm text-slate-500 mb-4">Update branch details.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Select
                    label="Organization"
                    {...register("organizationId")}
                    error={errors.organizationId?.message}
                    options={[{ label: "Select Organization", value: "" }, ...orgOptions]}
                    disabled={isLoadingOrgs}
                />

                <Input
                    label="Branch Name"
                    {...register("branchName")}
                    error={errors.branchName?.message}
                />
                
                <Input
                    label="Branch Email"
                    type="email"
                    {...register("branchEmail")}
                    error={errors.branchEmail?.message}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Country"
                        {...register("country")}
                        error={errors.country?.message}
                    />
                    <Input
                        label="Governorate"
                        {...register("governorate")}
                        error={errors.governorate?.message}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="City"
                        {...register("city")}
                        error={errors.city?.message}
                    />
                    <Input
                        label="Address"
                        {...register("address")}
                        error={errors.address?.message}
                    />
                </div>

                <Select
                    label="Status"
                    {...register("isActive", {
                        setValueAs: (v) => v === "true" || v === true,
                    })}
                    error={errors.isActive?.message}
                    options={[
                        { label: "Active", value: "true" },
                        { label: "Inactive", value: "false" },
                    ]}
                />

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isSubmitting || updateMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isDirty || isSubmitting || updateMutation.isPending}
                        loading={isSubmitting || updateMutation.isPending}
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
