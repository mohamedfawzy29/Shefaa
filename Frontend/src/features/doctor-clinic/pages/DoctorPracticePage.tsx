import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    useTodayAppointments,
    useMyBranches,
} from "../hooks/useDoctorClinic";
import { WriteMedicalRecordModal } from "../../doctor-medical/components/WriteMedicalRecordModal";
import {
    Calendar, CheckCircle2, Clock, UserCheck, Building2,
    FileText, ArrowRight, Stethoscope, AlertCircle, Search,
    Filter, RefreshCw, Activity,
} from "lucide-react";
import type { DoctorAppointmentResponse } from "../types/doctorClinic";

// Status Badge Helper
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
        default:
            return (
                <span className="inline-flex items-center gap-1 !px-2.5 !py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Status #{status}
                </span>
            );
    }
}

export default function DoctorPracticePage() {
    const { data: appointments = [], isLoading, isRefetching, refetch } = useTodayAppointments();
    const { data: myBranches = [] } = useMyBranches();

    // Search and status filter
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Modal state
    const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointmentResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Compute Statistics
    const totalToday = appointments.length;
    const checkedInCount = appointments.filter((a) => a.status === 3).length;
    const completedCount = appointments.filter((a) => a.status === 1).length;

    // Filter appointments
    const filteredAppointments = useMemo(() => {
        return appointments.filter((app) => {
            const matchesSearch =
                !search ||
                app.patientName.toLowerCase().includes(search.toLowerCase()) ||
                (app.visitReason && app.visitReason.toLowerCase().includes(search.toLowerCase())) ||
                app.branchName.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "checked-in" && app.status === 3) ||
                (statusFilter === "scheduled" && app.status === 0) ||
                (statusFilter === "completed" && app.status === 1) ||
                (statusFilter === "cancelled" && app.status === 2);

            return matchesSearch && matchesStatus;
        });
    }, [appointments, search, statusFilter]);

    const handleOpenModal = (app: DoctorAppointmentResponse) => {
        setSelectedAppointment(app);
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-7xl mx-auto !p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 !pb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <Activity className="h-6 w-6 text-cyan-600" /> Practice Overview & Today's Consultations
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Real-time overview of today's clinical schedule and patient queues.</p>
                </div>
                <Link
                    to="/doctor/clinic"
                    className="inline-flex items-center gap-2 !px-4 !py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
                >
                    <Building2 className="h-4 w-4" /> Manage Clinic & Schedules <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            {/* Today's Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800 !p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Today</span>
                        <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Calendar className="h-4.5 w-4.5" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalToday}</p>
                    <p className="text-xs text-slate-400">Appointments scheduled today</p>
                </div>

                <div className="bg-white dark:bg-[#12141c] rounded-3xl border border-amber-200/80 dark:border-amber-900/40 !p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Checked-In / Waiting</span>
                        <div className="h-9 w-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <UserCheck className="h-4.5 w-4.5" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-amber-900 dark:text-amber-200">{checkedInCount}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">Ready for consultation</p>
                </div>

                <div className="bg-white dark:bg-[#12141c] rounded-3xl border border-emerald-200/80 dark:border-emerald-900/40 !p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Completed Today</span>
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 className="h-4.5 w-4.5" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-200">{completedCount}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">Prescriptions written</p>
                </div>

                <div className="bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800 !p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Branches</span>
                        <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <Building2 className="h-4.5 w-4.5" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{myBranches.length}</p>
                    <p className="text-xs text-slate-400">Practicing locations</p>
                </div>
            </div>

            {/* Today's Appointments List & Queue */}
            <div className="bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
                {/* Section Bar */}
                <div className="!p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Today's Patient Queue</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Examine patients and write prescriptions for checked-in appointments</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter patient or reason..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="!pl-9 !pr-3 !py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none w-48 focus:w-60 transition-all"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-xl !p-1 bg-slate-50 dark:bg-slate-800">
                            {[
                                { id: "all", label: "All" },
                                { id: "checked-in", label: "Waiting" },
                                { id: "completed", label: "Done" },
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
                            Refresh Queue
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
                        <Stethoscope className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
                        <p className="text-base font-bold text-slate-700 dark:text-slate-300">No Appointments Match Filter</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Try clearing your search query or selecting a different status filter.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <th className="!p-4">Time</th>
                                    <th className="!p-4">Patient Name</th>
                                    <th className="!p-4">Visit Reason</th>
                                    <th className="!p-4">Branch</th>
                                    <th className="!p-4">Status</th>
                                    <th className="!p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                {filteredAppointments.map((app) => {
                                    const isCheckedIn = app.status === 3;
                                    return (
                                        <tr key={app.appointmentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                            <td className="!p-4 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                {app.startTime.slice(0, 5)} – {app.endTime.slice(0, 5)}
                                            </td>
                                            <td className="!p-4 font-bold text-slate-900 dark:text-slate-100">
                                                {app.patientName}
                                            </td>
                                            <td className="!p-4 text-slate-600 dark:text-slate-400 text-xs">
                                                {app.visitReason || "General Consultation"}
                                            </td>
                                            <td className="!p-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                                                {app.branchName}
                                            </td>
                                            <td className="!p-4">
                                                <AppointmentStatusBadge status={app.status} />
                                            </td>
                                            <td className="!p-4 text-right">
                                                {isCheckedIn ? (
                                                    <button
                                                        onClick={() => handleOpenModal(app)}
                                                        className="inline-flex items-center gap-1.5 !px-3.5 !py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
                                                    >
                                                        <Stethoscope className="h-3.5 w-3.5" />
                                                        Start Consultation
                                                    </button>
                                                ) : app.status === 1 ? (
                                                    <button
                                                        onClick={() => handleOpenModal(app)}
                                                        className="inline-flex items-center gap-1.5 !px-3 !py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold cursor-pointer hover:bg-emerald-100"
                                                    >
                                                        <FileText className="h-3.5 w-3.5" />
                                                        View Record
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled
                                                        title="Patient must check in first"
                                                        className="inline-flex items-center gap-1.5 !px-3 !py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 text-xs font-medium cursor-not-allowed"
                                                    >
                                                        <FileText className="h-3.5 w-3.5" />
                                                        Start Consultation
                                                    </button>
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

            {/* Write Medical Record Modal */}
            <WriteMedicalRecordModal
                appointmentId={selectedAppointment?.appointmentId ?? null}
                patientName={selectedAppointment?.patientName ?? ""}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedAppointment(null);
                }}
            />
        </div>
    );
}
