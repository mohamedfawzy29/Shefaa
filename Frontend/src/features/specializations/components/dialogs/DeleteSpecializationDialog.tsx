import axios from "axios";
import type { SpecializationResponse, ApiResponse } from "../../types/specialization";
import { useDeleteSpecialization } from "../../hooks/useSpecializations";
import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";

interface DeleteSpecializationDialogProps {
    specialization: SpecializationResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Extracts the human-readable error message from an Axios error.
 * Prefers the backend ApiResponse.message, falls back to errors[] array,
 * then to the generic Axios message.
 */
function extractErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        const body = err.response?.data as ApiResponse<unknown> | undefined;
        if (body?.message) return body.message;
        if (body?.errors?.length) return body.errors.join(" ");
    }
    return "Failed to delete specialization. Please try again.";
}

export function DeleteSpecializationDialog({
    specialization,
    isOpen,
    onClose,
}: DeleteSpecializationDialogProps) {
    const deleteMutation = useDeleteSpecialization();

    const handleDelete = () => {
        if (!specialization) return;
        deleteMutation.mutate(specialization.id, { onSuccess: () => onClose() });
    };

    const footer = (
        <>
            <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
            </Button>
            <Button
                type="button"
                variant="danger"
                loading={deleteMutation.isPending}
                onClick={handleDelete}
            >
                Delete
            </Button>
        </>
    );

    return (
        <Modal
            title="Delete Specialization"
            open={isOpen}
            onClose={onClose}
            footer={footer}
            maxWidth="sm"
        >
            <div className="text-center py-2">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                    <svg
                        className="h-8 w-8 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z"
                        />
                    </svg>
                </div>
                <p className="text-sm text-slate-500">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-slate-700">
                        {specialization?.name ?? ""}
                    </span>
                    ? This action cannot be undone.
                </p>

                {deleteMutation.isError && (
                    <p role="alert" className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg p-2">
                        {extractErrorMessage(deleteMutation.error)}
                    </p>
                )}
            </div>
        </Modal>
    );
}
