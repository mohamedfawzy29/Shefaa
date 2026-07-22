import type { ReviewResponse } from "../types/review";
import { Table, type Column } from "../../../components/ui/Table";
import { Star, Trash2, User, Stethoscope } from "lucide-react";

interface ReviewsTableProps {
    reviews: ReviewResponse[];
    isLoading?: boolean;
    onDelete: (r: ReviewResponse) => void;
}

export function ReviewsTable({
    reviews,
    isLoading,
    onDelete,
}: ReviewsTableProps) {
    const columns: Column<ReviewResponse>[] = [
        {
            header: "Patient",
            render: (r) => (
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{r.patientName}</span>
                </div>
            ),
        },
        {
            header: "Doctor",
            render: (r) => (
                <div className="flex items-center gap-2">
                    <Stethoscope className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dr. {r.doctorName}</span>
                </div>
            ),
        },
        {
            header: "Rating",
            render: (r) => (
                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`h-4 w-4 ${i < r.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                                }`}
                        />
                    ))}
                    <span className="!ml-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">{r.rating}.0</span>
                </div>
            ),
        },
        {
            header: "Comment",
            render: (r) => (
                <span
                    className="text-xs text-slate-600 dark:text-slate-400 italic max-w-[260px] truncate block"
                    title={r.comment}
                >
                    "{r.comment}"
                </span>
            ),
        },
        {
            header: "Date",
            render: (r) => (
                <span className="text-xs text-slate-500 font-mono">
                    {new Date(r.createdAt).toLocaleDateString()}
                </span>
            ),
        },
        {
            header: "Actions",
            align: "right",
            render: (r) => (
                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        onClick={() => onDelete(r)}
                        className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all cursor-pointer"
                        title="Delete review"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={reviews}
            isLoading={isLoading}
            keyExtractor={(r) => r.reviewId}
        />
    );
}
