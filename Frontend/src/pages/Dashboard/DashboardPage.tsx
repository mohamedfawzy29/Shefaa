import PageContainer from "../../components/layout/PageContainer";
import {
    useDashboardCounters,
    useAppointmentChart,
    useTopSpecializationsChart,
} from "../../features/dashboard/hooks/useDashboard";
import { ErrorState, StatsCard, SkeletonList, Card } from "../../components/ui";
import { Users, Stethoscope, Calendar, Building2, TrendingUp, HelpCircle, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
    const {
        data: counters,
        isLoading: isLoadingCounters,
        isError: isErrorCounters,
        error: errorCounters,
        refetch: refetchCounters,
    } = useDashboardCounters();

    const {
        data: appointmentChart,
        isLoading: isLoadingAppointments,
        isError: isErrorAppointments,
        error: errorAppointments,
        refetch: refetchAppointments,
    } = useAppointmentChart();

    const {
        data: specializationsChart,
        isLoading: isLoadingSpecializations,
        isError: isErrorSpecializations,
        error: errorSpecializations,
        refetch: refetchSpecializations,
    } = useTopSpecializationsChart();

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
    const maxAppointmentValue = appointmentChart
        ? Math.max(...appointmentChart.map((d) => d.value), 1)
        : 1;
    const maxSpecializationValue = specializationsChart
        ? Math.max(...specializationsChart.map((d) => d.value), 1)
        : 1;

    return (
        <PageContainer
            title="Dashboard"
            description="Overview of your clinic statistics and activities."
            noCard={true}
        >
            <div className="space-y-8 md:space-y-12">

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
                            ) : appointmentChart && appointmentChart.length > 0 ? (
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

                        {/* Top Specializations list */}
                        <Card variant="default" padding="lg">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-6">
                                Top Specializations
                            </h3>
                            {isLoadingSpecializations ? (
                                <SkeletonList rows={5} />
                            ) : specializationsChart && specializationsChart.length > 0 ? (
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
            </div>
        </PageContainer>
    );
}
