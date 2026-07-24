import { useState } from "react";
import { usePatientAppointments, useCancelPatientAppointment } from "../hooks/usePatientAppointments";
import { Avatar } from "../../../components/ui/Avatar";
import { getProfileImageUrl } from "../../../utils/imageUrl";
import { Calendar, Clock, MapPin, CheckCircle2, UserCheck, XCircle, Stethoscope } from "lucide-react";

function StatusBadge({ status }: { status: number }) {
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
                    <XCircle className="h-3 w-3" /> Cancelled
                </span>
            );
        case 3:
            return (
                <span className="inline-flex items-center gap-1 !px-2.5 !py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
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

export default function PatientAppointmentsPage() {
    const { data: appointments = [], isLoading, isError } = usePatientAppointments();
    const cancelMutation = useCancelPatientAppointment();
    const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    // Upcoming: Scheduled (0)
    const upcomingList = appointments.filter((a) => a.status === 0);
    // History: Completed (1), Cancelled (2), NoShow (4), CheckedIn (3)
    const historyList = appointments.filter((a) => a.status === 1 || a.status === 2 || a.status === 4 || a.status === 3);

    const activeList = activeTab === "upcoming" ? upcomingList : historyList;

    const handleCancel = (id: string) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        setCancellingId(id);
        cancelMutation.mutate(id, {
            onSettled: () => setCancellingId(null),
        });
    };

    return (
        <div className="max-w-5x2 mx-auto !p-6 space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 rounded-3xl !p-8 text-white shadow-xl space-y-2">
                <div className="inline-flex items-center gap-2 !px-3 !py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-cyan-200">
                    <Calendar className="h-3.5 w-3.5" />
                    Patient Portal
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">My Appointments</h1>
                <p className="text-blue-100 text-sm max-w-xl leading-relaxed">
                    Track your upcoming doctor consultations and view your past visit history.
                </p>
            </div>

            {/* Tabs & Content Container */}
            <div className="space-y-6">
                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 !mt-5 !mb-5">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={[
                            "!pb-3 !px-6 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2",
                            activeTab === "upcoming"
                                ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200",
                        ].join(" ")}
                    >
                        Upcoming Appointments
                        <span className="!px-2 !py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 text-xs font-extrabold">
                            {upcomingList.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab("history")}
                        className={[
                            "!pb-3 !px-6 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2",
                            activeTab === "history"
                                ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200",
                        ].join(" ")}
                    >
                        Appointment History
                        <span className="!px-2 !py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-extrabold">
                            {historyList.length}
                        </span>
                    </button>
                </div>

                {/* List Content */}
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
                        <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
                    </div>
                ) : isError ? (
                    <div className="!p-8 rounded-3xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 text-center space-y-2">
                        <p className="text-base font-bold text-rose-700 dark:text-rose-300">Failed to load appointments</p>
                        <p className="text-xs text-rose-600 dark:text-rose-400">Please try refreshing the page.</p>
                    </div>
                ) : activeList.length === 0 ? (
                    <div className="!py-16 text-center space-y-3 bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800">
                        <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
                        <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                            {activeTab === "upcoming" ? "No Upcoming Appointments" : "No Past Appointment History"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {activeTab === "upcoming"
                                ? "You have no scheduled doctor visits coming up."
                                : "Your completed or cancelled appointments will appear here."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeList.map((app) => {
                            const doctorUser = app.doctor?.user;
                            const doctorName = doctorUser ? `Dr. ${doctorUser.firstName} ${doctorUser.lastName}` : "Doctor";
                            const doctorImg = getProfileImageUrl(doctorUser?.profileImg);
                            const canCancel = app.status === 0; // Scheduled

                            return (
                                <div
                                    key={app.id}
                                    className="bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm !p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-cyan-300 dark:hover:border-cyan-800 transition-all"
                                >
                                    <div className="flex items-start gap-4">
                                        <Avatar src={doctorImg} name={doctorName} size="md" />
                                        <div className="space-y-1.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{doctorName}</h3>
                                                <StatusBadge status={app.status} />
                                            </div>
                                            {app.doctor?.specialization?.name && (
                                                <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                                                    <Stethoscope className="h-3.5 w-3.5" />
                                                    {app.doctor.specialization.name}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 !pt-1">
                                                <span className="flex items-center gap-1 font-medium">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                    {app.appointmentDate}
                                                </span>
                                                <span className="flex items-center gap-1 font-medium">
                                                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                                                    {app.startTime.slice(0, 5)} – {app.endTime.slice(0, 5)}
                                                </span>
                                                {app.branch?.branchName && (
                                                    <span className="flex items-center gap-1 font-medium">
                                                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                        {app.branch.branchName}
                                                    </span>
                                                )}
                                            </div>
                                            {app.visitReason && (
                                                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 !px-3 !py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 inline-block !mt-2">
                                                    Reason: <span className="font-medium text-slate-700 dark:text-slate-300">{app.visitReason}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {canCancel && (
                                        <div className="shrink-0 flex items-center justify-end">
                                            <button
                                                onClick={() => handleCancel(app.id)}
                                                disabled={cancellingId === app.id}
                                                className="!px-4 !py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all cursor-pointer disabled:opacity-50"
                                            >
                                                {cancellingId === app.id ? "Cancelling…" : "Cancel Appointment"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
