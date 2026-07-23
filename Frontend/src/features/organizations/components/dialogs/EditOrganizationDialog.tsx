import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Select } from "../../../../components/ui/Select";
import { useUpdateOrganization } from "../../hooks/useOrganizations";
import type { OrganizationResponse } from "../../types/organization";
import {
    editOrganizationSchema,
    type EditOrganizationFormData,
} from "../../validation/organizationSchema";

interface EditOrganizationDialogProps {
    organization: OrganizationResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EditOrganizationDialog({
    organization,
    isOpen,
    onClose,
}: EditOrganizationDialogProps) {
    const updateMutation = useUpdateOrganization();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<EditOrganizationFormData>({
        resolver: zodResolver(editOrganizationSchema),
        defaultValues: {
            legalName: "",
            taxNumber: "",
            commercialRegistrationNumber: "",
            mainEmail: "",
            mainPhone: "",
            websiteUrl: "",
            logoImg: "",
            status: "Active",
        },
    });

    useEffect(() => {
        if (organization && isOpen) {
            reset({
                legalName: organization.legalName,
                taxNumber: organization.taxNumber,
                commercialRegistrationNumber: organization.commercialRegistrationNumber || "",
                mainEmail: organization.mainEmail,
                mainPhone: organization.mainPhone,
                websiteUrl: organization.websiteUrl || "",
                logoImg: organization.logoImg || "",
                status: organization.status,
            });
        }
    }, [organization, isOpen, reset]);

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = (data: EditOrganizationFormData) => {
        if (!organization) return;

        updateMutation.mutate(
            { id: organization.id, data },
            {
                onSuccess: () => handleClose(),
                onError: (error) => {
                    console.error("Failed to update organization:", error);
                    alert(error instanceof Error ? error.message : "Update failed.");
                },
            }
        );
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            title="Edit Organization"
            >
            <p className="text-sm text-slate-500 mb-4">Update the details of the organization.</p>
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
