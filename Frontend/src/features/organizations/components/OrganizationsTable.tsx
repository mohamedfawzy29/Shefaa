import { useState } from "react";
import type { OrganizationResponse } from "../types/organization";
import { Table, type Column } from "../../../components/ui/Table";
import { Pencil, Trash2, Building2 } from "lucide-react";

interface OrganizationsTableProps {
    organizations: OrganizationResponse[];
    isLoading?: boolean;
    onEdit: (o: OrganizationResponse) => void;
    onDelete: (o: OrganizationResponse) => void;
}

function OrganizationLogo({ logoImg, name }: { logoImg?: string; name: string }) {
    const [imgError, setImgError] = useState(false);
    const initial = (name || "O").charAt(0).toUpperCase();

    return (
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-slate-100 dark:ring-slate-800 shadow-xs">
            {logoImg && !imgError ? (
                <img
                    src={logoImg}
                    alt={name}
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                />
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <Building2 className="h-5 w-5 text-indigo-500" />
                </div>
            )}
        </div>
    );
}

export function OrganizationsTable({
    organizations,
    isLoading,
    onEdit,
    onDelete,
}: OrganizationsTableProps) {
    const columns: Column<OrganizationResponse>[] = [
        {
            header: "Organization",
            render: (o) => (
                <div className="flex items-center gap-3.5">
                    <OrganizationLogo logoImg={o.logoImg} name={o.legalName} />
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 leading-snug truncate">
                            {o.legalName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5" title={o.mainEmail}>
                            {o.mainEmail || "No email"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            header: "Tax Number",
            render: (o) => (
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                    {o.taxNumber || "-"}
                </span>
            ),
        },
        {
            header: "Phone",
            render: (o) => (
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate max-w-[130px] block" title={o.mainPhone}>
                    {o.mainPhone || "-"}
                </span>
            ),
        },
        {
            header: "Status",
            render: (o) => {
                const isActive = o.status === "Active";
                return (
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full !px-2.5 !py-1 text-xs font-bold ${isActive
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/50"
                            }`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {o.status || "Unknown"}
                    </span>
                );
            },
        },
        {
            header: "Actions",
            align: "right",
            render: (o) => (
                <div className="flex items-center justify-end gap-1.5">
                    <button
                        type="button"
                        onClick={() => onEdit(o)}
                        className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all cursor-pointer"
                        title="Edit organization"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(o)}
                        className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all cursor-pointer"
                        title="Delete organization"
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
            data={organizations}
            isLoading={isLoading}
            keyExtractor={(o) => o.id}
        />
    );
}
