import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
    Star, MessageSquare, X, CheckCircle2, Loader2, Send
} from "lucide-react";
import { useAddReview, useUpdateReview } from "../hooks/usePatientReviews";
import type { ReviewResponse } from "../types/review";
import type { PatientAppointment } from "../../patient-appointments/types/patientAppointment";

const reviewSchema = z.object({
    comment: z.string().max(1000, "Comment cannot exceed 1000 characters.").optional(),
});
type ReviewFormData = z.infer<typeof reviewSchema>;

interface WriteReviewModalProps {
    appointment?: PatientAppointment | null;
    existingReview?: ReviewResponse | null;
    onClose: () => void;
}

export function WriteReviewModal({ appointment, existingReview, onClose }: WriteReviewModalProps) {
    const isOpen = !!appointment || !!existingReview;
    
    const [rating, setRating] = useState<number>(existingReview?.rating ?? 0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [step, setStep] = useState<1 | 2>(1);
    const [serverError, setServerError] = useState<string | null>(null);

    const addMutation = useAddReview();
    const updateMutation = useUpdateReview();
    const isPending = addMutation.isPending || updateMutation.isPending;

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            comment: existingReview?.comment ?? "",
        }
    });

    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setRating(0);
            setHoverRating(0);
            setServerError(null);
            reset();
        } else if (existingReview) {
            setRating(existingReview.rating);
            setValue("comment", existingReview.comment);
        }
    }, [isOpen, existingReview, reset, setValue]);

    if (!isOpen) return null;

    // Use doctor name from appointment, or fallback to existingReview doctor name
    const doctorName = appointment?.doctor?.user 
        ? `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}` 
        : existingReview?.doctorName 
            ? `Dr. ${existingReview.doctorName}`
            : "Doctor";

    const onSubmit = handleSubmit((data: ReviewFormData) => {
        if (rating === 0) {
            setServerError("Please select a rating from 1 to 5 stars.");
            return;
        }
        setServerError(null);

        if (existingReview) {
            updateMutation.mutate(
                { reviewId: existingReview.reviewId, request: { rating, comment: data.comment || "" } },
                {
                    onSuccess: () => setStep(2),
                    onError: (err: any) => setServerError(err.response?.data?.message || "Failed to update review.")
                }
            );
        } else if (appointment) {
            addMutation.mutate(
                { doctorId: appointment.doctor.doctorId, appointmentId: appointment.id, rating, comment: data.comment || "" },
                {
                    onSuccess: () => setStep(2),
                    onError: (err: any) => setServerError(err.response?.data?.message || "Failed to submit review.")
                }
            );
        }
    });

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-lg mx-4 bg-white dark:bg-[#12141c] rounded-3xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden animate-fade-in-scale">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 !px-6 !py-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
                            {existingReview ? "Edit Review" : "Leave a Review"}
                        </p>
                        <h2 className="text-lg font-bold text-white mt-0.5">{doctorName}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="!p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="!p-6 space-y-6">
                    {step === 2 ? (
                        <div className="flex flex-col items-center justify-center !py-8 space-y-4 text-center">
                            <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Review Submitted!</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Thank you for your feedback.
                            </p>
                            <button
                                onClick={onClose}
                                className="!mt-4 !px-6 !py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold cursor-pointer"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={onSubmit} id="review-form" className="space-y-6">
                            {/* Star Rating */}
                            <div className="flex flex-col items-center space-y-3">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                    How was your experience? <span className="text-rose-500">*</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                                        >
                                            <Star
                                                className={`h-10 w-10 transition-colors duration-200 ${
                                                    star <= (hoverRating || rating)
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-slate-200 dark:text-slate-700"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                                    <MessageSquare className="h-4 w-4 text-slate-400" />
                                    Additional Comments (Optional)
                                </label>
                                <textarea
                                    {...register("comment")}
                                    rows={4}
                                    placeholder="Share details of your experience..."
                                    className={[
                                        "w-full rounded-2xl border text-sm !px-4 !py-3 resize-none outline-none transition-all",
                                        "bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder:text-slate-400",
                                        errors.comment
                                            ? "border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20"
                                            : "border-slate-200 dark:border-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20",
                                    ].join(" ")}
                                />
                                {errors.comment && (
                                    <p className="text-xs text-rose-500 mt-1">{errors.comment.message}</p>
                                )}
                            </div>

                            {serverError && (
                                <div className="!p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-400 font-semibold">
                                    {serverError}
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="!px-6 !py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-bold transition-colors cursor-pointer flex items-center gap-2"
                                >
                                    {isPending ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> {existingReview ? "Updating..." : "Submitting..."}</>
                                    ) : (
                                        <><Send className="h-4 w-4" /> {existingReview ? "Update Review" : "Submit Review"}</>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
