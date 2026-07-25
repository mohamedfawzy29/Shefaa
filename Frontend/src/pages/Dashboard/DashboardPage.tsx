import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import {
    useDashboardCounters,
    useAppointmentChart,
    useTopSpecializationsChart,
    useRecentActivities
} from "../../features/dashboard/hooks/useDashboard";
import { useDoctors, useDoctorAction, type DoctorActionType } from "../../features/doctors/hooks/useDoctors";
import { ErrorState, StatsCard, SkeletonList, Card } from "../../components/ui";
import { Users, Stethoscope, Calendar, Building2, TrendingUp, HelpCircle, ArrowUpRight, AlertTriangle, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useMyBranches } from "../../features/doctor-clinic/hooks/useDoctorClinic";
import { useState } from "react";

export default function DashboardPage() {
    const { currentUser } = useAuth();
    const { data: myBranches = [] } = useMyBranches({ enabled: currentUser?.role === "Doctor" });

    const {
        data: counters,
        isLoading: isLoadingCounters,
        isError: isErrorCounters,
        error: errorCounters,
        refetch: refetchCounters,
    } = useDashboardCounters({ enabled: currentUser?.role === "Admin" });

    const { data: recentActivities, isLoading: isLoadingRecent } = useRecentActivities({ enabled: currentUser?.role === "Admin" });
    const { data: pendingDoctors, isLoading: isLoadingPending } = useDoctors("pending", { enabled: currentUser?.role === "Admin" });
    const actionMutation = useDoctorAction();
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    const handleDoctorAction = async (id: string, action: DoctorActionType) => {
        setActionLoadingId(id);
        try {
            await actionMutation.mutateAsync({ id, action });
        } catch (err) {
            console.error("Failed to execute action", err);
        } finally {
            setActionLoadingId(null);
        }
    };


    const {
        data: appointmentChart,
        isLoading: isLoadingAppointments,
        isError: isErrorAppointments,
        error: errorAppointments,
        refetch: refetchAppointments,
    } = useAppointmentChart({ enabled: currentUser?.role === "Admin" });

    const {
        data: specializationsChart,
        isLoading: isLoadingSpecializations,
        isError: isErrorSpecializations,
        error: errorSpecializations,
        refetch: refetchSpecializations,
    } = useTopSpecializationsChart({ enabled: currentUser?.role === "Admin" });

    const isError = isErrorCounters || isErrorAppointments || isErrorSpecializations;

    const handleRetry = () => {
        refetchCounters();
        refetchAppointments();
        refetchSpecializations();
    };

    if (isError) {
        const errorMsg =
            errorCounters?.message ||
            errorAppointments?.message ||
            errorSpecializations?.message ||
            "Failed to load dashboard data.";
        return (
            <PageContainer title="Dashboard" description="Overview of your clinic statistics and activities." noCard>
                <ErrorState description={errorMsg} onRetry={handleRetry} />
            </PageContainer>
        );
    }

    // Calculate maximum value for charts to compute percentage heights/widths
    const maxAppointmentValue = Array.isArray(appointmentChart) && appointmentChart.length > 0
        ? Math.max(...appointmentChart.map((d) => d.value), 1)
        : 1;
    const maxSpecializationValue = Array.isArray(specializationsChart) && specializationsChart.length > 0
        ? Math.max(...specializationsChart.map((d) => d.value), 1)
        : 1;

    return (
        <PageContainer
            title="Dashboard"
            description="Overview of your clinic statistics and activities."
            noCard={true}
        >
            <div className="space-y-8 md:space-y-12">

                {/* Soft Nudge Banner for Doctor Role without Joined Branches */}
                {currentUser?.role === "Doctor" && myBranches.length === 0 && (
                    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-3xl !p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-900 dark:text-amber-200 text-sm">Clinic Setup Required</h3>
                                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                                    You haven't joined a clinic branch yet. Join a branch to set your consultation fees and working hours.
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/doctor/clinic"
                            className="shrink-0 !px-5 !py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md"
                        >
                            Set Up My Clinic →
                        </Link>
                    </div>
                )}

                {/* Custom Inline Badge Title in Page Layout (like design reference) */}

                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Managing
                    </span>
                    <span className="inline-flex items-center gap-1.5 !px-3 !py-1.5 rounded-full text-xs font-bold bg-[#e2f952] text-slate-900 border border-[#d4ee3b]/30">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Operational
                    </span>
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Workflows and Metrics
                    </span>
                </div>

                {/* 1. Stats Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 !mt-2">
                    <StatsCard
                        label="Total Users"
                        value={counters?.totalUsers}
                        isLoading={isLoadingCounters}
                        color="blue"
                        icon={<Users className="h-4.5 w-4.5" />}
                        percentage={82}
                        maxLabel="/ 1000"
                    />
                    <StatsCard
                        label="Total Doctors"
                        value={counters?.totalDoctors}
                        isLoading={isLoadingCounters}
                        color="indigo"
                        icon={<Stethoscope className="h-4.5 w-4.5" />}
                        percentage={68}
                        maxLabel="/ 500"
                    />
                    <StatsCard
                        label="Total Appointments"
                        value={counters?.totalAppointments}
                        isLoading={isLoadingCounters}
                        color="lime"
                        icon={<Calendar className="h-4.5 w-4.5" />}
                        percentage={90}
                        maxLabel="/ 2000"
                    />
                    <StatsCard
                        label="Total Organizations"
                        value={counters?.totalOrganizations}
                        isLoading={isLoadingCounters}
                        color="slate"
                        icon={<Building2 className="h-4.5 w-4.5" />}
                        percentage={45}
                        maxLabel="/ 100"
                    />
                </div>

                {/* 2. Charts / Statistics & Side Cards Grid (matching reference) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left & Middle: Combined stats chart panel (spanning 2 columns) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Appointment Status chart */}
                        <Card variant="default" padding="lg" className="!my-5">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                        Appointment Statistics
                                    </h3>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Real-time status breakdown</p>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold !px-2.5 !py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 border border-slate-200/40 dark:border-slate-800">
                                    Active 2026
                                </span>
                            </div>

                            {isLoadingAppointments ? (
                                <SkeletonList rows={4} />
                            ) : Array.isArray(appointmentChart) && appointmentChart.length > 0 ? (
                                /* Render modern vertical pill bars exactly like the design reference chart */
                                <div className="flex items-end justify-between gap-4 h-64 !pt-6 !px-4">
                                    {appointmentChart.map((item, idx) => {
                                        const percent = (item.value / maxAppointmentValue) * 100;
                                        return (
                                            <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
                                                {/* Bar column */}
                                                <div className="relative w-9 md:w-12 bg-slate-100 dark:bg-slate-800/60 rounded-full h-full flex flex-col justify-end overflow-hidden border border-slate-200/10">
                                                    <div
                                                        className="w-full bg-[#0e1014] dark:bg-slate-900 rounded-full transition-all duration-700 ease-out flex flex-col justify-end"
                                                        style={{ height: `${Math.max(percent, 8)}%` }}
                                                    >
                                                        {/* Lime filled portion at the bottom of the pill like the image */}
                                                        <div className="w-full h-1/2 bg-[#e2f952] rounded-b-full shrink-0" />
                                                    </div>

                                                    {/* Tooltip on hover */}
                                                    <div className="absolute inset-x-0 bottom-2 text-center text-[10px] font-extrabold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {item.value}
                                                    </div>
                                                </div>

                                                {/* Labels */}
                                                <span className="text-[10px] md:text-xs font-semibold text-slate-500 dark:text-slate-400 !mt-3 truncate max-w-full text-center">
                                                    {item.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400 text-center !py-8">No appointment status data available.</p>
                            )}
                        </Card>
                    </div>

                    {/* Right side: Helpful utility widgets & links list matching reference visual design */}
                    <div className="space-y-6 md:space-y-8">

                        {/* Help / Docs widget card */}
                        <Card
                            variant="elevated"
                            padding="md"
                            className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white border-0 !mt-6 h-[46vh]"
                        >
                            <div className="flex justify-between items-start !mb-6">
                                <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <HelpCircle className="h-5 w-5 text-white" />
                                </div>
                                <ArrowUpRight className="h-5 w-5 text-white/60" />
                            </div>
                            <h4 className="text-lg font-extrabold tracking-tight">Help Center</h4>
                            <p className="text-sm text-white/90 mt-2 leading-relaxed">
                                Explore detailed clinic setup guides, user roles configurations, and operational workflows.
                            </p>
                            <button className="!mt-27 w-full !py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm transition-transform hover:scale-[1.02] cursor-pointer">
                                Open Knowledge Base
                            </button>
                        </Card>
                    </div>
                </div>

                {/* Top Specializations list */}
                <Card variant="default" padding="lg" className="!mb-5">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider !mb-6">
                        Top Specializations
                    </h3>
                    {isLoadingSpecializations ? (
                        <SkeletonList rows={5} />
                    ) : Array.isArray(specializationsChart) && specializationsChart.length > 0 ? (
                        <div className="space-y-4">
                            {specializationsChart.map((item, idx) => {
                                const percent = (item.value / maxSpecializationValue) * 100;
                                return (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
                                            <span className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                                {item.label}
                                            </span>
                                            <span>{item.value} doctors</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center !py-8">No specialization data available.</p>
                    )}
                </Card>

                {/* 3. Pending Approvals & Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pending Approvals Widget */}
                    <Card variant="default" padding="lg">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                Pending Doctor Approvals
                            </h3>
                            <Link to="/admin/doctors" className="text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
                                View All
                            </Link>
                        </div>
                        {isLoadingPending ? (
                            <SkeletonList rows={3} />
                        ) : pendingDoctors && pendingDoctors.length > 0 ? (
                            <div className="space-y-4">
                                {pendingDoctors.slice(0, 5).map((doc) => (
                                    <div key={doc.doctorId} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center shrink-0 overflow-hidden">
                                                {doc.profileImageUrl ? (
                                                    <img src={doc.profileImageUrl} alt="profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Stethoscope className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Dr. {doc.firstName} {doc.lastName}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{doc.specialization}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDoctorAction(doc.doctorId, "approve")}
                                                disabled={actionLoadingId === doc.doctorId}
                                                className="!p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-50 cursor-pointer"
                                                title="Approve"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDoctorAction(doc.doctorId, "reject")}
                                                disabled={actionLoadingId === doc.doctorId}
                                                className="!p-2 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors disabled:opacity-50 cursor-pointer"
                                                title="Reject"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                    <CheckCircle2 className="h-6 w-6 text-slate-400" />
                                </div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">All caught up!</p>
                                <p className="text-xs text-slate-500 mt-1">No pending doctors to approve.</p>
                            </div>
                        )}
                    </Card>

                    {/* Recent Activities Widget */}
                    <Card variant="default" padding="lg">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-6">
                            Recent Clinic Appointments
                        </h3>
                        {isLoadingRecent ? (
                            <SkeletonList rows={3} />
                        ) : recentActivities && recentActivities.length > 0 ? (
                            <div className="space-y-4">
                                {recentActivities.map((act) => (
                                    <div key={act.appointmentId} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 gap-3">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{act.patientName}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                                <Stethoscope className="h-3 w-3" /> Dr. {act.doctorName}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0 text-xs">
                                            <div className="flex flex-col items-end">
                                                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-cyan-500" /> {act.date}
                                                </span>
                                                <span className="text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Clock className="h-3 w-3 text-cyan-500" /> {act.time}
                                                </span>
                                            </div>
                                            <span className={`inline-flex items-center justify-center !px-2.5 !py-1 rounded-full font-bold text-[10px] uppercase tracking-wider border ${act.status === "Completed"
                                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
                                                : act.status === "Cancelled" || act.status === "NoShow"
                                                    ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50"
                                                    : "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/50"
                                                }`}>
                                                {act.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">No recent activities found.</p>
                        )}
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
