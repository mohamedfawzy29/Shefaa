import { useState, useMemo } from "react";
import PageContainer from "../../../components/layout/PageContainer";
import { EmptyState, ErrorState, StatsCard, Input, SectionHeader, Toolbar, Card } from "../../../components/ui";
import { useReviews } from "../hooks/useReviews";
import { ReviewsTable } from "../components/ReviewsTable";
import { DeleteReviewDialog } from "../components/dialogs/DeleteReviewDialog";
import type { ReviewResponse } from "../types/review";
import { Search, Star, MessageSquare } from "lucide-react";

export default function ReviewsPage() {
    const { data: reviews, isLoading, isError, error, refetch } = useReviews();

    const [searchQuery, setSearchQuery] = useState("");
    const [reviewToDelete, setReviewToDelete] = useState<ReviewResponse | null>(null);

    const filteredReviews = useMemo(() => {
        const list = reviews ?? [];
        if (!searchQuery.trim()) return list;
        const q = searchQuery.toLowerCase();
        return list.filter(
            (r) =>
                (r.patientName ?? "").toLowerCase().includes(q) ||
                (r.doctorName ?? "").toLowerCase().includes(q) ||
                (r.comment ?? "").toLowerCase().includes(q)
        );
    }, [reviews, searchQuery]);

    const total = reviews?.length ?? 0;
    const averageRating = total > 0 ? (reviews!.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : "0";

    return (
        <PageContainer noCard={true}>
            <SectionHeader
                title="Reviews"
                subtitle="Monitor patient feedback and doctor review scores."
                badge={
                    <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        Feedback
                    </span>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 !mb-6">
                <StatsCard label="Total Reviews" value={total} color="indigo" icon={<MessageSquare className="h-4.5 w-4.5" />} percentage={65} />
                <StatsCard label="Average Rating" value={Number(averageRating)} color="amber" icon={<Star className="h-4.5 w-4.5" />} percentage={Number(averageRating) * 20} />
            </div>

            <Card variant="default" padding="lg">
                <Toolbar>
                    <Input
                        type="text"
                        placeholder="Search by patient, doctor, or comment…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="h-4.5 w-4.5 text-slate-400" />}
                        className="sm:max-w-md"
                    />
                </Toolbar>

                {isError ? (
                    <ErrorState
                        title="Failed to load reviews"
                        description={
                            error instanceof Error
                                ? error.message
                                : "An unexpected error occurred while fetching reviews."
                        }
                        onRetry={() => refetch()}
                    />
                ) : reviews?.length === 0 && !isLoading ? (
                    <EmptyState
                        title="No Reviews Found"
                        description="No reviews have been submitted yet."
                        icon={<Star className="h-8 w-8 text-slate-400" />}
                    />
                ) : (
                    <ReviewsTable reviews={filteredReviews} isLoading={isLoading} onDelete={(r) => setReviewToDelete(r)} />
                )}
            </Card>

            <DeleteReviewDialog
                review={reviewToDelete}
                isOpen={!!reviewToDelete}
                onClose={() => setReviewToDelete(null)}
            />
        </PageContainer>
    );
}
