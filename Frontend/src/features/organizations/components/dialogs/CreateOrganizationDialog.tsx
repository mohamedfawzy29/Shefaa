import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Select } from "../../../../components/ui/Select";
import { useCreateOrganization } from "../../hooks/useOrganizations";
import {
    createOrganizationSchema,
    type CreateOrganizationFormData,
} from "../../validation/organizationSchema";

interface CreateOrganizationDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateOrganizationDialog({ isOpen, onClose }: CreateOrganizationDialogProps) {
    const createMutation = useCreateOrganization();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateOrganizationFormData>({
        resolver: zodResolver(createOrganizationSchema),
        defaultValues: {
            status: "Active",
            websiteUrl: "",
            logoImg: "",
            commercialRegistrationNumber: "",
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = (data: CreateOrganizationFormData) => {
        createMutation.mutate(data, {
            onSuccess: () => handleClose(),
            onError: (error) => {
                console.error("Failed to create organization:", error);
                alert(error instanceof Error ? error.message : "Creation failed.");
            },
        });
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            title="Add Organization"
            >
            <p className="text-sm text-slate-500 mb-4">Create a new medical organization.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Legal Name"
                    {...register("legalName")}
                    error={errors.legalName?.message}
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Tax Number"
                        {...register("taxNumber")}
                        error={errors.taxNumber?.message}
                    />
                    <Input
                        label="Commercial Reg. Number"
                        {...register("commercialRegistrationNumber")}
                        error={errors.commercialRegistrationNumber?.message}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Main Email"
                        type="email"
                        {...register("mainEmail")}
                        error={errors.mainEmail?.message}
                    />
                    <Input
                        label="Main Phone"
                        {...register("mainPhone")}
                        error={errors.mainPhone?.message}
                    />
                </div>

                <Input
                    label="Website URL"
                    type="url"
                    {...register("websiteUrl")}
                    error={errors.websiteUrl?.message}
                />

                <Input
                    label="Logo URL"
                    type="url"
                    {...register("logoImg")}
                    error={errors.logoImg?.message}
                />

                <Select
                    label="Status"
                    {...register("status")}
                    error={errors.status?.message}
                    options={[
                        { label: "Active", value: "Active" },
                        { label: "Inactive", value: "Inactive" },
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
                        Create Organization
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
