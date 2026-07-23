import type { AppointmentResponse } from "../types/appointment";
import { Table, type Column } from "../../../components/ui/Table";
import { Calendar, Clock, User, Stethoscope } from "lucide-react";

interface AppointmentsTableProps {
    appointments: AppointmentResponse[];
    isLoading?: boolean;
}

const STATUS_MAP: Record<number, { label: string; bg: string; dot: string }> = {
    0: { label: "Scheduled", bg: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50", dot: "bg-blue-500" },
    1: { label: "Completed", bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50", dot: "bg-emerald-500" },
    2: { label: "Cancelled", bg: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/50", dot: "bg-rose-500" },
    3: { label: "No Show", bg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/50", dot: "bg-slate-400" },
};

export function AppointmentsTable({ appointments, isLoading }: AppointmentsTableProps) {
    const columns: Column<AppointmentResponse>[] = [
        {
            header: "Patient",
            render: (a) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 ring-2 ring-slate-100 dark:ring-slate-800">
                        <User className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{a.patientName}</span>
                </div>
            ),
        },
        {
            header: "Doctor & Branch",
            render: (a) => (
                <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                        <Stethoscope className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        Dr. {a.doctorName}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 !mt-0.5 truncate max-w-[160px]" title={a.branchName}>
                        {a.branchName}
                    </p>
                </div>
            ),
        },
        {
            header: "Schedule",
            render: (a) => (
                <div className="text-xs">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {a.appointmentDate}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                        {a.startTime} - {a.endTime}
                    </p>
                </div>
            ),
        },
        {
            header: "Reason",
            render: (a) => (
                <span
                    className="text-xs text-slate-600 dark:text-slate-400 italic max-w-[200px] truncate block"
                    title={a.visitReason || "Routine visit"}
                >
                    {a.visitReason || "-"}
                </span>
            ),
        },
        {
            header: "Status",
            render: (a) => {
                const s = STATUS_MAP[a.status] || { label: "Unknown", bg: "bg-slate-100 text-slate-700", dot: "bg-slate-400" };
                return (
                    <span className={`inline-flex items-center gap-1.5 rounded-full !px-2.5 !py-1 text-xs font-bold ${s.bg}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                    </span>
                );
            },
        },
    ];

    return (
        <Table
            columns={columns}
            data={appointments}
            isLoading={isLoading}
            keyExtractor={(a) => a.appointmentId}
        />
    );
}
