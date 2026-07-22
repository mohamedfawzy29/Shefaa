import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createSpecializationSchema,
    type CreateSpecializationFormData,
} from "../../validation/specializationSchema";
import { useCreateSpecialization } from "../../hooks/useSpecializations";
import { Modal } from "../../../../components/ui/Modal";
import { Input } from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/Button";

interface CreateSpecializationDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateSpecializationDialog({ isOpen, onClose }: CreateSpecializationDialogProps) {
    const createMutation = useCreateSpecialization();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CreateSpecializationFormData>({
        resolver: zodResolver(createSpecializationSchema),
    });

    // Reset form and preview when dialog closes
    useEffect(() => {
        if (!isOpen) {
            reset();
            setPreview(null);
        }
    }, [isOpen, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue("icon", file, { shouldValidate: true });
        const url = URL.createObjectURL(file);
        setPreview(url);
    };

    // Revoke object URL on unmount / preview change to prevent memory leaks
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const onSubmit = (data: CreateSpecializationFormData) => {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.description) formData.append("description", data.description);
        if (data.icon) formData.append("icon", data.icon);

        createMutation.mutate(formData, { onSuccess: () => onClose() });
    };

    const footer = (
        <>
            <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
            </Button>
            <Button
                type="submit"
                form="create-specialization-form"
                loading={createMutation.isPending}
            >
                Create
            </Button>
        </>
    );

    return (
        <Modal
            title="New Specialization"
            open={isOpen}
            onClose={onClose}
            footer={footer}
            maxWidth="md"
        >
            <form
                id="create-specialization-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                aria-label="Create specialization"
            >
                <Input
                    label="Name"
                    placeholder="e.g. Cardiology"
                    error={errors.name?.message}
                    {...register("name")}
                />

                {/* Description — plain textarea wired through RHF */}
                <div className="w-full">
                    <label
                        htmlFor="create-description"
                        className="block text-sm font-medium text-slate-700 mb-1"
                    >
                        Description
                    </label>
                    <textarea
                        id="create-description"
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
                        Icon Image
                    </label>
                    <div className="flex items-center gap-4">
                        {/* Preview */}
                        <div className="h-14 w-14 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
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
                                Choose Image
                            </Button>
                            <p className="text-xs text-slate-400 mt-1">
                                JPG, PNG, WebP — max 5 MB
                            </p>
                        </div>
                        {/* Hidden file input */}
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

                {createMutation.isError && (
                    <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg p-2">
                        Failed to create specialization. Please try again.
                    </p>
                )}
            </form>
        </Modal>
    );
}
