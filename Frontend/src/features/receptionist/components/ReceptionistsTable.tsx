import type { ReceptionistResponse } from "../types/receptionist";
import { Table, type Column } from "../../../components/ui/Table";
import { Check, X, Ban, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface ReceptionistsTableProps {
    receptionists: ReceptionistResponse[];
    isLoading?: boolean;
    onStatusChange: (id: string, action: "approve" | "reject" | "suspend" | "activate") => void;
}

const STATUS_MAP: Record<number, { label: string; bg: string; dot: string }> = {
    0: { label: "Pending", bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50", dot: "bg-amber-500" },
    1: { label: "Approved", bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50", dot: "bg-emerald-500" },
    2: { label: "Rejected", bg: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/50", dot: "bg-rose-500" },
    3: { label: "Suspended", bg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/50", dot: "bg-slate-400" },
};

function ReceptionistAvatar({ receptionist }: { receptionist: ReceptionistResponse }) {
    const [imgError, setImgError] = useState(false);
    const initials = (receptionist.firstName?.charAt(0) || "R") + (receptionist.lastName?.charAt(0) || "");

    return (
        <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm">
            {receptionist.profileImageUrl && !imgError ? (
                <img
                    src={receptionist.profileImageUrl}
                    alt={`${receptionist.firstName} ${receptionist.lastName}`}
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                />
            ) : (
                <span className="text-white text-xs font-extrabold tracking-wider">
                    {initials.toUpperCase()}
                </span>
            )}
        </div>
    );
}

export function ReceptionistsTable({
    receptionists,
    isLoading,
    onStatusChange,
}: ReceptionistsTableProps) {
    const columns: Column<ReceptionistResponse>[] = [
        {
            header: "Receptionist",
            render: (r) => (
                <div className="flex items-center gap-3.5">
                    <ReceptionistAvatar receptionist={r} />
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 leading-snug truncate">
                            {r.firstName} {r.lastName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate !mt-0.5" title={r.email}>
                            {r.email || "No email"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            header: "Branch",
            render: (r) => (
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {r.branchName || "-"}
                </span>
            ),
        },
        {
            header: "Phone",
            render: (r) => (
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate max-w-[130px] block" title={r.phoneNumbers?.[0]}>
                    {r.phoneNumbers?.[0] || "-"}
                </span>
            ),
        },
        {
            header: "Status",
            render: (r) => {
                const s = STATUS_MAP[r.status] || { label: "Unknown", bg: "bg-slate-100 text-slate-700", dot: "bg-slate-400" };
                return (
                    <span className={`inline-flex items-center gap-1.5 rounded-full !px-2.5 !py-1 text-xs font-bold ${s.bg}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                    </span>
                );
            },
        },
        {
            header: "Actions",
            align: "right",
            render: (r) => (
                <div className="flex items-center justify-end gap-1.5">
                    {r.status === 0 && (
                        <>
                            <button
                                type="button"
                                onClick={() => onStatusChange(r.receptionistId, "approve")}
                                className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-xs cursor-pointer"
                                title="Approve"
                            >
                                <Check className="h-3.5 w-3.5" />
                                Approve
                            </button>
                            <button
                                type="button"
                                onClick={() => onStatusChange(r.receptionistId, "reject")}
                                className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all cursor-pointer"
                                title="Reject"
                            >
                                <X className="h-3.5 w-3.5" />
                                Reject
                            </button>
                        </>
                    )}
                    {r.status === 1 && (
                        <button
                            type="button"
                            onClick={() => onStatusChange(r.receptionistId, "suspend")}
                            className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all cursor-pointer"
                            title="Suspend"
                        >
                            <Ban className="h-3.5 w-3.5" />
                            Suspend
                        </button>
                    )}
                    {(r.status === 2 || r.status === 3) && (
                        <button
                            type="button"
                            onClick={() => onStatusChange(r.receptionistId, "activate")}
                            className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-xs cursor-pointer"
                            title="Activate"
                        >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Activate
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={receptionists}
            isLoading={isLoading}
            keyExtractor={(r) => r.receptionistId}
        />
    );
}
