import { useMySchedules } from "../hooks/useDoctorClinic";
import { Calendar, Building2, Clock, Users, ArrowRight, CalendarDays, Watch } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import type { EnrichedDoctorSchedule } from "../types/doctorClinic";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DoctorSchedulesPage() {
    const { data: schedules = [], isLoading } = useMySchedules();

    // Group schedules by Branch
    const groupedByBranch = useMemo(() => {
        const groups: Record<string, EnrichedDoctorSchedule[]> = {};
        schedules.forEach((schedule) => {
            if (!groups[schedule.branchName]) {
                groups[schedule.branchName] = [];
            }
            groups[schedule.branchName].push(schedule);
        });

        // Sort schedules within each branch by day of week
        Object.keys(groups).forEach(branch => {
            groups[branch].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
        });
        return groups;
    }, [schedules]);

    return (
        <div className="max-w-7x2 mx-auto !p-6 space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl !p-8 text-white shadow-xl relative overflow-hidden !mb-5">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 !px-3 !py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-cyan-200">
                            <CalendarDays className="h-3.5 w-3.5" />
                            My Schedules
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Working Hours Overview</h1>
                        <p className="text-blue-100 text-sm max-w-xl leading-relaxed">
                            A complete view of your weekly clinic schedules across all your active practice locations.
                        </p>
                    </div>
                    <Link
                        to="/doctor/clinic"
                        className="inline-flex items-center gap-2 !px-5 !py-2.5 rounded-2xl bg-white text-indigo-700 font-bold text-sm shadow-md hover:shadow-lg transition-all"
                    >
                        <PlusIcon className="h-4 w-4" /> Add New Schedule <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
                    ))}
                </div>
            ) : schedules.length === 0 ? (
                <div className="!py-16 text-center space-y-3 bg-white dark:bg-[#12141c] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
                    <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-base font-bold text-slate-700 dark:text-slate-300">No Schedules Added Yet</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Head over to the Clinic Settings page to add your working hours.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedByBranch).map(([branchName, branchSchedules]) => (
                        <div key={branchName} className="bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden !mb-5">
                            <div className="bg-slate-50 dark:bg-slate-900/50 !px-6 !py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{branchName}</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{branchSchedules.length} active shifts scheduled</p>
                                </div>
                            </div>

                            <div className="!p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {branchSchedules.map((schedule) => (
                                        <div key={schedule.id} className="group !p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#12141c] hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md cursor-default relative overflow-hidden">

                                            {/* Status Indicator */}
                                            <div className={`absolute top-0 left-0 w-1 h-full ${schedule.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />

                                            <div className="flex items-center justify-between !mb-4">
                                                <div className="inline-flex items-center gap-1.5 !px-2.5 !py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                                                    {DAYS_OF_WEEK[schedule.dayOfWeek]}
                                                </div>
                                                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${schedule.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                                    {schedule.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                                        <Clock className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Shift Timing</p>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                                                            {schedule.startTime.slice(0, 5)} - {schedule.endTime.slice(0, 5)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                                        <Watch className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Slot Duration</p>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                            {schedule.slotDurationMinutes} Minutes
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                                                        <Users className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Patient Capacity</p>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                            Max {schedule.maxPatients} Patients
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
