import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";
import { useDeleteReview } from "../../hooks/useReviews";
import type { ReviewResponse } from "../../types/review";

interface DeleteReviewDialogProps {
    review: ReviewResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export function DeleteReviewDialog({
    review,
    isOpen,
    onClose,
}: DeleteReviewDialogProps) {
    const deleteMutation = useDeleteReview();

    if (!review) return null;

    const handleDelete = () => {
        deleteMutation.mutate(review.reviewId, {
            onSuccess: () => onClose(),
            onError: (error) => {
                console.error("Failed to delete review:", error);
                alert(error instanceof Error ? error.message : "Failed to delete.");
            },
        });
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Delete Review"
            >
            <p className="text-sm text-slate-500 mb-4">Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="bg-red-50 p-4 rounded-lg mt-4 mb-6 border border-red-100">
                <p className="text-sm text-red-800 font-medium">Review by {review.patientName}:</p>
                <p className="text-base text-red-900 font-bold mt-1 italic">
                    "{review.comment}"
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
                    Delete Review
                </Button>
            </div>
        </Modal>
    );
}
