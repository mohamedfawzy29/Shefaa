import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Select } from "../../../../components/ui/Select";
import { useCreateBranch } from "../../hooks/useBranches";
import { useOrganizations } from "../../../organizations/hooks/useOrganizations";
import {
    createBranchSchema,
    type CreateBranchFormData,
} from "../../validation/branchSchema";

interface CreateBranchDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateBranchDialog({ isOpen, onClose }: CreateBranchDialogProps) {
    const createMutation = useCreateBranch();
    const { data: organizations, isLoading: isLoadingOrgs } = useOrganizations();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateBranchFormData>({
        resolver: zodResolver(createBranchSchema),
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

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = (data: CreateBranchFormData) => {
        createMutation.mutate(data, {
            onSuccess: () => handleClose(),
            onError: (error) => {
                console.error("Failed to create branch:", error);
                alert(error instanceof Error ? error.message : "Creation failed.");
            },
        });
    };

    const orgOptions = organizations?.map((o) => ({
        label: o.legalName,
        value: o.id,
    })) || [];

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            title="Add Branch"
            >
            <p className="text-sm text-slate-500 mb-4">Create a new branch for an organization.</p>
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
                        disabled={isSubmitting || createMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || createMutation.isPending}
                        loading={isSubmitting || createMutation.isPending}
                    >
                        Create Branch
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
