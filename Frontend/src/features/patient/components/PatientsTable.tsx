import type { PatientResponse } from "../types/patient";
import { Table, type Column } from "../../../components/ui/Table";
import { useState } from "react";

interface PatientsTableProps {
    patients: PatientResponse[];
    isLoading?: boolean;
}

function PatientAvatar({ patient }: { patient: PatientResponse }) {
    const [imgError, setImgError] = useState(false);
    const initials = (patient.firstName?.charAt(0) || "P") + (patient.lastName?.charAt(0) || "");

    return (
        <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm">
            {patient.profileImageUrl && !imgError ? (
                <img
                    src={patient.profileImageUrl}
                    alt={`${patient.firstName} ${patient.lastName}`}
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

export function PatientsTable({ patients, isLoading }: PatientsTableProps) {
    const columns: Column<PatientResponse>[] = [
        {
            header: "Patient",
            render: (p) => (
                <div className="flex items-center gap-3.5">
                    <PatientAvatar patient={p} />
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 leading-snug truncate">
                            {p.firstName} {p.lastName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5" title={p.email}>
                            {p.email || "No email"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            header: "Phone",
            render: (p) => (
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate max-w-[140px] block" title={p.phoneNumbers[0]}>
                    {p.phoneNumbers[0] || "-"}
                </span>
            ),
        },
        {
            header: "Blood Type",
            render: (p) => (
                <span className="inline-flex items-center !px-2.5 !py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50">
                    {p.bloodType || "-"}
                </span>
            ),
        },
        {
            header: "Emergency Contact",
            render: (p) => (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-[140px] block" title={p.emergencyContact}>
                    {p.emergencyContact || "-"}
                </span>
            ),
        },
        {
            header: "Status",
            render: (p) => (
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full !px-2.5 !py-1 text-xs font-bold ${p.isActive
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/50"
                            }`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${p.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {p.isActive ? "Active" : "Inactive"}
                    </span>
                    {p.isLockedOut && (
                        <span className="inline-flex items-center gap-1.5 rounded-full !px-2.5 !py-1 text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            Locked
                        </span>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={patients}
            isLoading={isLoading}
            keyExtractor={(p) => p.patientId}
        />
    );
}
