import { useState, useMemo } from "react";
import PageContainer from "../../../components/layout/PageContainer";
import { useDoctors, useAllDoctorsStats, useDoctorAction, type DoctorFilterTab, type DoctorActionType } from "../hooks/useDoctors";
import { DoctorsTable } from "../components/DoctorsTable";
import { EmptyState, ErrorState, StatsCard, Input, SectionHeader, Toolbar, Card } from "../../../components/ui";
import { Search, Stethoscope, CheckCircle, Clock, CheckCircle2, AlertCircle, X } from "lucide-react";

const TABS: { key: DoctorFilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "suspended", label: "Suspended" },
    { key: "rejected", label: "Rejected" },
];

export default function DoctorsPage() {
    const [activeTab, setActiveTab] = useState<DoctorFilterTab>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Queries
    const { data: doctors, isLoading, isError, error, refetch } = useDoctors(activeTab);
    const { data: allDoctors } = useAllDoctorsStats();

    // Mutations
    const actionMutation = useDoctorAction();

    // Filtered list based on search
    const filteredDoctors = useMemo(() => {
        const list = doctors ?? [];
        if (!searchQuery.trim()) return list;
        const q = searchQuery.toLowerCase();
        return list.filter(
            (d) =>
                `${d.firstName} ${d.lastName}`.toLowerCase().includes(q) ||
                (d.email ?? "").toLowerCase().includes(q) ||
                (d.specialization ?? "").toLowerCase().includes(q)
        );
    }, [doctors, searchQuery]);

    // Top Cards Stats (computed from all doctors)
    const statsSource = allDoctors ?? doctors ?? [];
    const total = statsSource.length;
    const approved = statsSource.filter((d) => d.status === 1).length;
    const pending = statsSource.filter((d) => d.status === 0).length;

    // Action Handler
    const handleAction = async (id: string, action: DoctorActionType) => {
        setActionLoadingId(id);
        setToast(null);
        try {
            await actionMutation.mutateAsync({ id, action });
            const actionLabel =
                action === "approve" ? "approved"
                    : action === "reject" ? "rejected"
                        : action === "suspend" ? "suspended"
                            : "activated";
            setToast({
                type: "success",
                message: `Doctor successfully ${actionLabel}.`,
            });
        } catch (err) {
            setToast({
                type: "error",
                message: err instanceof Error ? err.message : "Failed to execute action.",
            });
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <PageContainer noCard={true}>
            <SectionHeader
                title="Doctors"
                subtitle="View and manage registered doctors."
                badge={
                    <span className="flex items-center gap-1">
                        <Stethoscope className="h-3.5 w-3.5" />
                        Directory
                    </span>
                }
            />

            {/* Toast Notification Banner */}
            {toast && (
                <div
                    className={`!mb-5 flex items-center justify-between gap-3 rounded-2xl !px-4 !py-3.5 text-sm font-medium transition-all ${toast.type === "success"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                        }`}
                >
                    <div className="flex items-center gap-2.5">
                        {toast.type === "success" ? (
                            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                            <AlertCircle className="h-4.5 w-4.5 text-rose-600 dark:text-rose-400 shrink-0" />
                        )}
                        <span>{toast.message}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setToast(null)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Existing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 !mb-6 !mt-4">
                <StatsCard
                    label="Total Doctors"
                    value={total}
                    color="indigo"
                    icon={<Stethoscope className="h-4.5 w-4.5" />}
                    percentage={75}
                />
                <StatsCard
                    label="Approved"
                    value={approved}
                    color="green"
                    icon={<CheckCircle className="h-4.5 w-4.5" />}
                    percentage={90}
                />
                <StatsCard
                    label="Pending Review"
                    value={pending}
                    color="amber"
                    icon={<Clock className="h-4.5 w-4.5" />}
                    percentage={10}
                />
            </div>

            {/* Table Card with Filter Tabs & Search */}
            <Card variant="default" className="rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-visible">
                <Toolbar className="flex flex-col lg:flex-row justify-between items-center lg:items-center gap-5 !px-4 !py-4">
                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 !p-2 shadow-inner">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`rounded-xl !px-3.5 !py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${activeTab === tab.key
                                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs"
                                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <Input
                        type="text"
                        placeholder="Search doctors by name, email or specialization..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="h-5 w-5 text-slate-400" />}
                        className="w-full lg:w-[420px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                </Toolbar>

                {isError ? (
                    <ErrorState
                        title="Failed to load doctors"
                        description={
                            error instanceof Error
                                ? error.message
                                : "An unexpected error occurred while fetching doctors."
                        }
                        onRetry={() => refetch()}
                    />
                ) : filteredDoctors.length === 0 && !isLoading ? (
                    <EmptyState
                        title="No Doctors Found"
                        description={
                            searchQuery
                                ? `No doctors match "${searchQuery}".`
                                : `There are no ${activeTab === "all" ? "" : activeTab} doctors.`
                        }
                        icon={<Stethoscope className="h-8 w-8 text-slate-400" />}
                    />
                ) : (
                    <DoctorsTable
                        doctors={filteredDoctors}
                        isLoading={isLoading}
                        onAction={handleAction}
                        actionLoadingId={actionLoadingId}
                    />
                )}
            </Card>
        </PageContainer>
    );
}
