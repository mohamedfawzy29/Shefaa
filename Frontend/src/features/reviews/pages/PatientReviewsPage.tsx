import { useState } from "react";
import { Star, MessageSquare, Calendar, Trash2, Edit } from "lucide-react";
import { useMyReviews, useDeleteReview } from "../hooks/usePatientReviews";
import { WriteReviewModal } from "../components/WriteReviewModal";
import type { ReviewResponse } from "../types/review";
import { Avatar } from "../../../components/ui/Avatar";
import { getProfileImageUrl } from "../../../utils/imageUrl";

export default function PatientReviewsPage() {
    const { data: reviews = [], isLoading, isError } = useMyReviews();
    const deleteMutation = useDeleteReview();

    const [editingReview, setEditingReview] = useState<ReviewResponse | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        setDeletingId(id);
        deleteMutation.mutate(id, {
            onSettled: () => setDeletingId(null)
        });
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700"}`}
                    />
                ))}
            </div>
        );
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="max-w-5x2 mx-auto !p-6 space-y-8">
            <WriteReviewModal
                existingReview={editingReview}
                onClose={() => setEditingReview(null)}
            />

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl !p-8 text-white shadow-xl space-y-2 !mb-5">
                <div className="inline-flex items-center gap-2 !px-3 !py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-emerald-200">
                    <Star className="h-3.5 w-3.5" />
                    Patient Portal
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">My Reviews</h1>
                <p className="text-emerald-100 text-sm max-w-xl leading-relaxed">
                    View and manage the feedback you've shared about your doctors.
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
                    <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
                </div>
            ) : isError ? (
                <div className="!p-8 rounded-3xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 text-center space-y-2">
                    <p className="text-base font-bold text-rose-700 dark:text-rose-300">Failed to load reviews</p>
                    <p className="text-xs text-rose-600 dark:text-rose-400">Please try refreshing the page.</p>
                </div>
            ) : reviews.length === 0 ? (
                <div className="!py-16 text-center space-y-3 bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800">
                    <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                        No Reviews Yet
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        You haven't left any reviews for your completed appointments.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((review) => (
                        <div key={review.reviewId} className="bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm !p-6 flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-800 transition-all space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar size="sm" name={review.doctorName} />
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Dr. {review.doctorName}</h3>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> {formatDate(review.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                {renderStars(review.rating)}
                            </div>

                            {review.comment && (
                                <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 !p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 flex-1">
                                    "{review.comment}"
                                </p>
                            )}

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => setEditingReview(review)}
                                    className="flex items-center gap-1.5 !px-3 !py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <Edit className="h-3.5 w-3.5" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(review.reviewId)}
                                    disabled={deletingId === review.reviewId}
                                    className="flex items-center gap-1.5 !px-3 !py-1.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 className="h-3.5 w-3.5" /> {deletingId === review.reviewId ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
