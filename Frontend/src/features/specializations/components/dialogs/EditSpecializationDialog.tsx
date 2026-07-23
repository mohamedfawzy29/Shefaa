import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    editSpecializationSchema,
    type EditSpecializationFormData,
} from "../../validation/specializationSchema";
import { useUpdateSpecialization } from "../../hooks/useSpecializations";
import type { SpecializationResponse } from "../../types/specialization";
import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";

interface EditSpecializationDialogProps {
    specialization: SpecializationResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EditSpecializationDialog({
    specialization,
    isOpen,
    onClose,
}: EditSpecializationDialogProps) {
    const updateMutation = useUpdateSpecialization();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [bannerImgError, setBannerImgError] = useState(false);
    const [previewImgError, setPreviewImgError] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<EditSpecializationFormData>({
        resolver: zodResolver(editSpecializationSchema),
    });

    // Pre-fill description when dialog opens; clear on close
    useEffect(() => {
        if (isOpen && specialization) {
            reset({ description: specialization.description ?? "" });
            setPreview(null);
            setBannerImgError(false);
            setPreviewImgError(false);
        } else {
            reset({});
            setPreview(null);
            setBannerImgError(false);
            setPreviewImgError(false);
        }
    }, [isOpen, specialization, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue("icon", file, { shouldValidate: true });
        const url = URL.createObjectURL(file);
        setPreview(url);
        setPreviewImgError(false); // new local file is always valid
    };

    // Revoke object URL on unmount / preview change
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const onSubmit = (data: EditSpecializationFormData) => {
        if (!specialization) return;

        const formData = new FormData();
        if (data.description !== undefined) formData.append("description", data.description);
        if (data.icon) formData.append("icon", data.icon);

        updateMutation.mutate(
            { id: specialization.id, formData },
            { onSuccess: () => onClose() }
        );
    };

    // Current icon to display — local preview takes priority
    const displayedIcon = preview ?? specialization?.iconImg ?? null;

    const footer = (
        <>
            <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
            </Button>
            <Button
                type="submit"
                form="edit-specialization-form"
                loading={updateMutation.isPending}
            >
                Save Changes
            </Button>
        </>
    );

    return (
        <Modal
            title="Edit Specialization"
            open={isOpen}
            onClose={onClose}
            footer={footer}
            maxWidth="md"
        >
            {/* Read-only name banner */}
            <div className="mb-4 flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center overflow-hidden shrink-0">
                    {specialization?.iconImg && !bannerImgError ? (
                        <img
                            src={specialization.iconImg}
                            alt={specialization.name}
                            className="h-full w-full object-cover"
                            onError={() => setBannerImgError(true)}
                        />
                    ) : (
                        <span className="text-indigo-600 font-bold text-sm">
                            {(specialization?.name ?? "S").charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <div>
                    <p className="font-semibold text-slate-900">{specialization?.name ?? ""}</p>
                    <p className="text-xs text-slate-400">Name cannot be changed</p>
                </div>
            </div>

            <form
                id="edit-specialization-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                aria-label="Edit specialization"
            >
                {/* Description */}
                <div className="w-full">
                    <label
                        htmlFor="edit-description"
                        className="block text-sm font-medium text-slate-700 mb-1"
                    >
                        Description
                    </label>
                    <textarea
                        id="edit-description"
                        rows={3}
                        placeholder="Brief description (optional)"
                        className={`w-full rounded-lg border px-4 py-2 text-sm outline-none transition-colors focus:ring-1 resize-none ${
                            errors.description
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                        aria-invalid={errors.description ? "true" : "false"}
                        {...register("description")}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-xs mt-1" role="alert">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                {/* Icon upload */}
                <div className="w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Replace Icon
                    </label>
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {displayedIcon && !previewImgError ? (
                                <img
                                    src={displayedIcon}
                                    alt="Icon preview"
                                    className="h-full w-full object-cover"
                                    onError={() => setPreviewImgError(true)}
                                />
                            ) : (
                                <svg
                                    className="h-6 w-6 text-slate-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                    />
                                </svg>
                            )}
                        </div>
                        <div>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {displayedIcon ? "Change Image" : "Choose Image"}
                            </Button>
                            <p className="text-xs text-slate-400 mt-1">
                                JPG, PNG, WebP — max 5 MB
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                    {errors.icon && (
                        <p className="text-red-500 text-xs mt-1" role="alert">
                            {errors.icon.message}
                        </p>
                    )}
                </div>

                {updateMutation.isError && (
                    <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg p-2">
                        Failed to update specialization. Please try again.
                    </p>
                )}
            </form>
        </Modal>
    );
}
