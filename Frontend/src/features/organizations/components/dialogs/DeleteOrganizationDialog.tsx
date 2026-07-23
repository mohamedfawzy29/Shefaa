import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";
import { useDeleteOrganization } from "../../hooks/useOrganizations";
import type { OrganizationResponse } from "../../types/organization";

interface DeleteOrganizationDialogProps {
    organization: OrganizationResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export function DeleteOrganizationDialog({
    organization,
    isOpen,
    onClose,
}: DeleteOrganizationDialogProps) {
    const deleteMutation = useDeleteOrganization();

    if (!organization) return null;

    const handleDelete = () => {
        deleteMutation.mutate(organization.id, {
            onSuccess: () => onClose(),
            onError: (error) => {
                console.error("Failed to delete organization:", error);
                alert(error instanceof Error ? error.message : "Failed to delete.");
            },
        });
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Delete Organization"
            >
            <p className="text-sm text-slate-500 mb-4">Are you sure you want to delete this organization? This action cannot be undone.</p>
            <div className="bg-red-50 p-4 rounded-lg mt-4 mb-6 border border-red-100">
                <p className="text-sm text-red-800 font-medium">Organization to delete:</p>
                <p className="text-base text-red-900 font-bold mt-1">
                    {organization.legalName}
                </p>
                <p className="text-sm text-red-700 mt-1">
                    Tax Number: {organization.taxNumber}
                </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    disabled={deleteMutation.isPending}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    className="!bg-red-600 hover:!bg-red-700 text-white"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    loading={deleteMutation.isPending}
                >
                    Delete Organization
                </Button>
            </div>
        </Modal>
    );
}
