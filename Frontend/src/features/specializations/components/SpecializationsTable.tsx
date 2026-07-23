import { useState } from "react";
import type { SpecializationResponse } from "../types/specialization";
import { Table, type Column } from "../../../components/ui/Table";
import { Pencil, Trash2, Stethoscope } from "lucide-react";

interface SpecializationsTableProps {
    specializations: SpecializationResponse[];
    isLoading?: boolean;
    onEdit: (s: SpecializationResponse) => void;
    onDelete: (s: SpecializationResponse) => void;
}

/** Avatar-style icon cell with onError → placeholder fallback */
function SpecializationIcon({ iconImg, name }: { iconImg?: string; name: string }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-slate-100 dark:ring-slate-800 shadow-xs">
            {iconImg && !imgError ? (
                <img
                    src={iconImg}
                    alt={name}
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                />
            ) : (
                <Stethoscope className="h-5 w-5 text-indigo-500" />
            )}
        </div>
    );
}

export function SpecializationsTable({
    specializations,
    isLoading,
    onEdit,
    onDelete,
}: SpecializationsTableProps) {
    const columns: Column<SpecializationResponse>[] = [
        {
            header: "Specialization",
            render: (s) => (
                <div className="flex items-center gap-3.5">
                    <SpecializationIcon iconImg={s.iconImg} name={s.name} />
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 leading-snug truncate">
                            {s.name ?? "Unnamed"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            header: "Description",
            render: (s) => (
                <span
                    className="text-xs text-slate-500 dark:text-slate-400 max-w-[320px] line-clamp-2 block"
                    title={s.description || ""}
                >
                    {s.description || <span className="italic text-slate-400 dark:text-slate-600">No description</span>}
                </span>
            ),
        },
        {
            header: "Actions",
            align: "right",
            render: (s) => (
                <div className="flex items-center justify-end gap-1.5">
                    <button
                        type="button"
                        onClick={() => onEdit(s)}
                        className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all cursor-pointer"
                        title="Edit specialization"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(s)}
                        className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all cursor-pointer"
                        title="Delete specialization"
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
            data={specializations}
            isLoading={isLoading}
            keyExtractor={(s) => s.id}
        />
    );
}
