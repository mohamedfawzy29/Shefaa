import type { Doctor } from "../types/doctor";
import type { DoctorActionType } from "../hooks/useDoctors";
import { Table, type Column } from "../../../components/ui/Table";
import { Check, X, Ban, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";

interface DoctorsTableProps {
    doctors: Doctor[];
    isLoading?: boolean;
    onAction?: (id: string, action: DoctorActionType) => void;
    actionLoadingId?: string | null;
}

const STATUS_MAP: Record<number, { label: string; bg: string; dot: string }> = {
    0: { label: "Pending", bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50", dot: "bg-amber-500" },
    1: { label: "Approved", bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50", dot: "bg-emerald-500" },
    2: { label: "Rejected", bg: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/50", dot: "bg-rose-500" },
    3: { label: "Suspended", bg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/50", dot: "bg-slate-400" },
};

function DoctorAvatar({ doctor }: { doctor: Doctor }) {
    const [imgError, setImgError] = useState(false);
    const initials = (doctor.firstName || "D").charAt(0).toUpperCase() + (doctor.lastName || "").charAt(0).toUpperCase();

    return (
        <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm">
            {doctor.profileImageUrl && !imgError ? (
                <img
                    src={doctor.profileImageUrl}
                    alt={doctor.firstName}
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                />
            ) : (
                <span className="text-white text-xs font-extrabold tracking-wider">
                    {initials || "DR"}
                </span>
            )}
        </div>
    );
}

export function DoctorsTable({ doctors, isLoading, onAction, actionLoadingId }: DoctorsTableProps) {
    const columns: Column<Doctor>[] = [
        {
            header: "Doctor",
            render: (doctor) => (
                <div className="flex items-center gap-3.5">
                    <DoctorAvatar doctor={doctor} />
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 leading-snug truncate">
                            Dr. {doctor.firstName} {doctor.lastName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5" title={doctor.email}>
                            {doctor.email || "No email"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            header: "Specialization",
            render: (doctor) => (
                <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
                        {doctor.specialization || "General"}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        Lic: {doctor.licenseNumber || "N/A"}
                    </span>
                </div>
            ),
        },
        {
            header: "Phone",
            render: (doctor) => (
                <span className="text-xs text-slate-600 dark:text-slate-300 font-mono truncate max-w-[130px] block" title={doctor.phoneNumbers?.join(", ")}>
                    {doctor.phoneNumbers?.join(", ") || "-"}
                </span>
            ),
        },
        {
            header: "Experience",
            render: (doctor) => (
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {doctor.yearsOfExperience} yrs
                </span>
            ),
        },
        {
            header: "Rating",
            render: (doctor) => {
                const hasRating = doctor.averageRating && doctor.averageRating > 0;
                return hasRating ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                        <span>{doctor.averageRating.toFixed(1)}</span>
                    </div>
                ) : (
                    <span className="text-xs text-slate-400 italic">No Reviews</span>
                );
            },
        },
        {
            header: "Status",
            render: (doctor) => {
                const s = STATUS_MAP[doctor.status] || { label: "Unknown", bg: "bg-slate-100 text-slate-700", dot: "bg-slate-400" };
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
            render: (doctor) => {
                const isExecuting = actionLoadingId === doctor.doctorId;
                return (
                    <div className="flex items-center justify-end gap-1.5">
                        {doctor.status === 0 && (
                            <>
                                <button
                                    type="button"
                                    disabled={isExecuting}
                                    onClick={() => onAction?.(doctor.doctorId, "approve")}
                                    className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                                    title="Approve doctor"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    Approve
                                </button>
                                <button
                                    type="button"
                                    disabled={isExecuting}
                                    onClick={() => onAction?.(doctor.doctorId, "reject")}
                                    className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 disabled:opacity-50 transition-all cursor-pointer"
                                    title="Reject doctor"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Reject
                                </button>
                            </>
                        )}
                        {doctor.status === 1 && (
                            <button
                                type="button"
                                disabled={isExecuting}
                                onClick={() => onAction?.(doctor.doctorId, "suspend")}
                                className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 disabled:opacity-50 transition-all cursor-pointer"
                                title="Suspend doctor"
                            >
                                <Ban className="h-3.5 w-3.5" />
                                Suspend
                            </button>
                        )}
                        {doctor.status === 3 && (
                            <button
                                type="button"
                                disabled={isExecuting}
                                onClick={() => onAction?.(doctor.doctorId, "activate")}
                                className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                                title="Activate doctor"
                            >
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Activate
                            </button>
                        )}
                        {doctor.status === 2 && (
                            <button
                                type="button"
                                disabled={isExecuting}
                                onClick={() => onAction?.(doctor.doctorId, "approve")}
                                className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                                title="Approve doctor"
                            >
                                <Check className="h-3.5 w-3.5" />
                                Approve
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <Table
            columns={columns}
            data={doctors}
            isLoading={isLoading}
            keyExtractor={(d) => d.doctorId}
        />
    );
}
