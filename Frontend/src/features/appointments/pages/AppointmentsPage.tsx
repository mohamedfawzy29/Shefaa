import { useState, useMemo } from "react";
import PageContainer from "../../../components/layout/PageContainer";
import { EmptyState, ErrorState, StatsCard, Input, SectionHeader, Toolbar, Card } from "../../../components/ui";
import { useAppointments } from "../hooks/useAppointments";
import { AppointmentsTable } from "../components/AppointmentsTable";
import { Search, Calendar, Clock, CheckCircle2 } from "lucide-react";

export default function AppointmentsPage() {
    const { data: appointments, isLoading, isError, error, refetch } = useAppointments();

    const [searchQuery, setSearchQuery] = useState("");

    const filteredAppointments = useMemo(() => {
        const list = appointments ?? [];
        if (!searchQuery.trim()) return list;
        const q = searchQuery.toLowerCase();
        return list.filter(
            (a) =>
                (a.patientName ?? "").toLowerCase().includes(q) ||
                (a.doctorName ?? "").toLowerCase().includes(q) ||
                (a.branchName ?? "").toLowerCase().includes(q)
        );
    }, [appointments, searchQuery]);

    const total = appointments?.length ?? 0;
    const scheduled = appointments?.filter((a) => a.status === 0).length ?? 0;
    const completed = appointments?.filter((a) => a.status === 1).length ?? 0;

    return (
        <PageContainer noCard={true}>
            <SectionHeader
                title="Appointments"
                subtitle="View and manage patient schedules and visit logs."
                badge={
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Visits
                    </span>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 !mb-6">
                <StatsCard
                    label="Total Appointments"
                    value={total}
                    color="indigo"
                    icon={<Calendar className="h-4.5 w-4.5" />}
                    percentage={80}
                />
                <StatsCard
                    label="Scheduled"
                    value={scheduled}
                    color="blue"
                    icon={<Clock className="h-4.5 w-4.5" />}
                    percentage={60}
                />
                <StatsCard
                    label="Completed"
                    value={completed}
                    color="green"
                    icon={<CheckCircle2 className="h-4.5 w-4.5" />}
                    percentage={40}
                />
            </div>

            <Card variant="default" padding="lg">
                <Toolbar>
                    <Input
                        type="text"
                        placeholder="Search by patient, doctor, or branch…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="h-4.5 w-4.5 text-slate-400" />}
                        className="sm:max-w-md"
                    />
                </Toolbar>

                {isError ? (
                    <ErrorState
                        title="Failed to load appointments"
                        description={
                            error instanceof Error
                                ? error.message
                                : "An unexpected error occurred while fetching appointments."
                        }
                        onRetry={() => refetch()}
                    />
                ) : appointments?.length === 0 && !isLoading ? (
                    <EmptyState
                        title="No Appointments Found"
                        description="There are no appointments scheduled."
                        icon={<Calendar className="h-8 w-8 text-slate-400" />}
                    />
                ) : (
                    <AppointmentsTable
                        appointments={filteredAppointments}
                        isLoading={isLoading}
                    />
                )}
            </Card>
        </PageContainer>
    );
}
