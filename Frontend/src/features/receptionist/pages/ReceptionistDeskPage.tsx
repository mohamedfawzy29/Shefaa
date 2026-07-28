import { useState, useMemo, useEffect } from "react";
import {
    useReceptionistTodayAppointments,
    useCheckInAppointment,
    useMarkNoShowAppointment,
} from "../hooks/useReceptionistAppointments";
import {
    Calendar, CheckCircle2, Clock, UserCheck, Building2,
    Search, RefreshCw, UserX, AlertCircle, MapPin
} from "lucide-react";
import { BranchSelectionModal } from "../components/BranchSelectionModal";

function AppointmentStatusBadge({ status }: { status: number }) {
    switch (status) {
        case 0:
            return (
                <span className="inline-flex items-center gap-1 !px-2.5 !py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <Clock className="h-3 w-3" /> Scheduled
                </span>
            );
        case 1:
            return (
                <span className="inline-flex items-center gap-1 !px-2.5 !py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="h-3 w-3" /> Completed
                </span>
            );
        case 2:
            return (
                <span className="inline-flex items-center gap-1 !px-2.5 !py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    <AlertCircle className="h-3 w-3" /> Cancelled
                </span>
            );
        case 3:
            return (
                <span className="inline-flex items-center gap-1 !px-2.5 !py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse">
                    <UserCheck className="h-3 w-3 text-amber-600" /> Checked-In
                </span>
            );
        case 4:
            return (
                <span className="inline-flex items-center gap-1 !px-2.5 !py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                    <UserX className="h-3 w-3" /> No Show
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1 !px-2.5 !py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Status #{status}
                </span>
            );
    }
}

export default function ReceptionistDeskPage() {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const { data: appointments = [], isLoading, isRefetching, refetch } = useReceptionistTodayAppointments(selectedDate);
    const checkInMutation = useCheckInAppointment();
    const noShowMutation = useNoShowMutation();

    function useNoShowMutation() {
        return useMarkNoShowAppointment();
    }

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [actionId, setActionId] = useState<string | null>(null);
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

    // Sync active branch to localStorage whenever queue is not empty
    useEffect(() => {
        if (appointments.length > 0) {
            localStorage.setItem('receptionistActiveBranchName', appointments[0].branchName);
        }
    }, [appointments]);

    // Derive active branch name from the first appointment if available, fallback to localStorage
    const activeBranchName = appointments.length > 0
        ? appointments[0].branchName
        : localStorage.getItem('receptionistActiveBranchName');

    // Compute Statistics
    const totalToday = appointments.length;
    const scheduledCount = appointments.filter((a) => a.status === 0).length;
    const checkedInCount = appointments.filter((a) => a.status === 3).length;
    const completedCount = appointments.filter((a) => a.status === 1).length;

    // Filter appointments
    const filteredAppointments = useMemo(() => {
        return appointments.filter((app) => {
            const matchesSearch =
                !search ||
                app.patientName.toLowerCase().includes(search.toLowerCase()) ||
                app.doctorName.toLowerCase().includes(search.toLowerCase()) ||
                (app.visitReason && app.visitReason.toLowerCase().includes(search.toLowerCase()));

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "scheduled" && app.status === 0) ||
                (statusFilter === "checked-in" && app.status === 3) ||
                (statusFilter === "completed" && app.status === 1) ||
                (statusFilter === "no-show" && app.status === 4);

            return matchesSearch && matchesStatus;
        });
    }, [appointments, search, statusFilter]);

    const handleCheckIn = (id: string) => {
        setActionId(id);
        checkInMutation.mutate(id, {
            onSettled: () => setActionId(null),
        });
    };

    const handleNoShow = (id: string) => {
        if (!window.confirm("Mark this patient as No-Show?")) return;
        setActionId(id);
        noShowMutation.mutate(id, {
            onSettled: () => setActionId(null),
        });
    };

    return (
        <div className="max-w-7x2 mx-auto !p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 !pb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <Building2 className="h-6 w-6 text-blue-600" /> Reception Desk & Patient Queue
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Manage today's branch check-ins and patient arrivals.
                    </p>
                </div>

                {/* Branch Selection Control */}
                <div className="flex items-center gap-3 bg-white dark:bg-[#12141c] border border-slate-200 dark:border-slate-700 !px-4 !py-2 rounded-2xl shadow-sm">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Branch</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-blue-500" />
                            {activeBranchName || "Unknown Branch"}
                        </span>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                    <button
                        onClick={() => setIsBranchModalOpen(true)}
                        className="!px-3 !py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                        Switch
                    </button>
                </div>
            </div>

            {/* Today's Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 !my-5">
                <div className="bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800 !p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total</span>
                        <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Calendar className="h-4.5 w-4.5" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalToday}</p>
                    <p className="text-xs text-slate-400">Branch visits for selected date</p>
                </div>

                <div className="bg-white dark:bg-[#12141c] rounded-3xl border border-blue-200/80 dark:border-blue-900/40 !p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Awaiting Arrival</span>
                        <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Clock className="h-4.5 w-4.5" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-blue-900 dark:text-blue-200">{scheduledCount}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Scheduled patients</p>
                </div>

                <div className="bg-white dark:bg-[#12141c] rounded-3xl border border-amber-200/80 dark:border-amber-900/40 !p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Checked-In / Waiting</span>
                        <div className="h-9 w-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <UserCheck className="h-4.5 w-4.5" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-amber-900 dark:text-amber-200">{checkedInCount}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">In waiting room</p>
                </div>

                <div className="bg-white dark:bg-[#12141c] rounded-3xl border border-emerald-200/80 dark:border-emerald-900/40 !p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Completed</span>
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 className="h-4.5 w-4.5" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-200">{completedCount}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">Visits completed</p>
                </div>
            </div>

            {/* Queue Management Table */}
            <div className="bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
                {/* Toolbar */}
                <div className="!p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Branch Appointments</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Mark patient arrivals or flag no-show appointments in real-time</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search patient, doctor..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="!pl-9 !pr-3 !py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none w-48 focus:w-60 transition-all"
                            />
                        </div>

                        {/* Date Filter */}
                        <div className="relative flex items-center">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="!px-3 !py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-xl !p-1 bg-slate-50 dark:bg-slate-800">
                            {[
                                { id: "all", label: "All" },
                                { id: "scheduled", label: "Awaiting" },
                                { id: "checked-in", label: "Checked-In" },
                                { id: "completed", label: "Completed" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setStatusFilter(tab.id)}
                                    className={[
                                        "!px-2.5 !py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                                        statusFilter === tab.id
                                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400",
                                    ].join(" ")}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => refetch()}
                            className="!px-3 !py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="!p-8 space-y-4 animate-pulse">
                        <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                        <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div className="!py-16 text-center space-y-3">
                        <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
                        <p className="text-base font-bold text-slate-700 dark:text-slate-300">No Appointments Found</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">There are no appointments matching your current filter.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <th className="!p-4">Time</th>
                                    <th className="!p-4">Patient Name</th>
                                    <th className="!p-4">Doctor</th>
                                    <th className="!p-4">Visit Reason</th>
                                    <th className="!p-4">Status</th>
                                    <th className="!p-4 text-right">Quick Desk Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                {filteredAppointments.map((app) => {
                                    const isScheduled = app.status === 0;
                                    const isPendingAction = actionId === app.appointmentId;

                                    return (
                                        <tr key={app.appointmentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                            <td className="!p-4 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                {app.startTime.slice(0, 5)} – {app.endTime.slice(0, 5)}
                                            </td>
                                            <td className="!p-4 font-bold text-slate-900 dark:text-slate-100">
                                                {app.patientName}
                                            </td>
                                            <td className="!p-4 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                                                Dr. {app.doctorName}
                                            </td>
                                            <td className="!p-4 text-slate-600 dark:text-slate-400 text-xs">
                                                {app.visitReason || "General Visit"}
                                            </td>
                                            <td className="!p-4">
                                                <AppointmentStatusBadge status={app.status} />
                                            </td>
                                            <td className="!p-4 text-right">
                                                {isScheduled ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleCheckIn(app.appointmentId)}
                                                            disabled={isPendingAction}
                                                            className="inline-flex items-center gap-1.5 !px-3 !py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                                                        >
                                                            <UserCheck className="h-3.5 w-3.5" />
                                                            {isPendingAction ? "Updating…" : "Mark Arrived"}
                                                        </button>
                                                        <button
                                                            onClick={() => handleNoShow(app.appointmentId)}
                                                            disabled={isPendingAction}
                                                            className="inline-flex items-center gap-1.5 !px-3 !py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                                                        >
                                                            <UserX className="h-3.5 w-3.5" />
                                                            No Show
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">No action needed</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Branch Selection Modal */}
            <BranchSelectionModal
                isOpen={isBranchModalOpen}
                onClose={() => setIsBranchModalOpen(false)}
                currentBranchName={activeBranchName}
            />
        </div>
    );
}
