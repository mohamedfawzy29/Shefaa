import type { BranchResponse } from "../types/branch";
import { Table, type Column } from "../../../components/ui/Table";
import { MapPin, Pencil, Trash2, GitBranch } from "lucide-react";

interface BranchesTableProps {
    branches: BranchResponse[];
    isLoading?: boolean;
    onEdit: (b: BranchResponse) => void;
    onDelete: (b: BranchResponse) => void;
}

export function BranchesTable({
    branches,
    isLoading,
    onEdit,
    onDelete,
}: BranchesTableProps) {
    const columns: Column<BranchResponse>[] = [
        {
            header: "Branch",
            render: (b) => (
                <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 ring-2 ring-slate-100 dark:ring-slate-800 shadow-xs">
                        <GitBranch className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 leading-snug truncate">
                            {b.branchName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate !mt-0.5" title={b.organizationName}>
                            {b.organizationName || "Independent"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            header: "Location",
            render: (b) => (
                <div className="text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {b.city}, {b.governorate}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 !mt-0.5">{b.country}</p>
                </div>
            ),
        },
        {
            header: "Contact Email",
            render: (b) => (
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate max-w-[160px] block" title={b.branchEmail}>
                    {b.branchEmail || "-"}
                </span>
            ),
        },
        {
            header: "Status",
            render: (b) => (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full !px-2.5 !py-1 text-xs font-bold ${b.isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/50"
                        }`}
                >
                    <span className={`h-1.5 w-1.5 rounded-full ${b.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {b.isActive ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            header: "Actions",
            align: "right",
            render: (b) => (
                <div className="flex items-center justify-end gap-1.5">
                    <button
                        type="button"
                        onClick={() => onEdit(b)}
                        className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all cursor-pointer"
                        title="Edit branch"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(b)}
                        className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all cursor-pointer"
                        title="Delete branch"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={branches}
            isLoading={isLoading}
            keyExtractor={(b) => b.id}
        />
    );
}
