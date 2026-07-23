import type { ReactNode } from "react";
import { TableSkeleton } from "./TableSkeleton";

export interface Column<T> {
    header: string;
    key?: keyof T;
    render?: (item: T) => ReactNode;
    align?: "left" | "center" | "right";
    width?: string;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    emptyState?: ReactNode;
    keyExtractor: (item: T) => string | number;
    onRowClick?: (item: T) => void;
}

const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

export function Table<T,>({
    columns,
    data,
    isLoading,
    emptyState,
    keyExtractor,
    onRowClick,
}: TableProps<T>) {
    if (isLoading) {
        return <TableSkeleton columns={columns.length} rows={5} />;
    }

    const safeData = data || [];

    if (safeData.length === 0 && emptyState) {
        return <>{emptyState}</>;
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm transition-all duration-200 ">
            <table className="min-w-full border-collapse text-sm">
                <thead>
                    <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-10">
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                style={col.width ? { width: col.width } : undefined}
                                className={[
                                    "!px-5 !py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none",
                                    alignClass[col.align ?? "left"],
                                    "first:pl-6 last:pr-6",
                                ].join(" ")}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {safeData.map((item, index) => (
                        <tr
                            key={keyExtractor(item)}
                            onClick={() => onRowClick?.(item)}
                            className={[
                                "group transition-colors duration-150 hover:bg-slate-50/80 dark:hover:bg-slate-800/50",
                                index % 2 === 1 ? "bg-slate-50/40 dark:bg-slate-900/20" : "",
                                onRowClick ? "cursor-pointer" : "",
                            ].join(" ")}
                        >
                            {columns.map((col, idx) => (
                                <td
                                    key={idx}
                                    className={[
                                        "!px-5 !py-4 text-slate-700 dark:text-slate-300 align-middle text-sm font-medium",
                                        alignClass[col.align ?? "left"],
                                        "first:pl-6 last:pr-6",
                                    ].join(" ")}
                                >
                                    {col.render
                                        ? col.render(item)
                                        : col.key
                                            ? (item[col.key] as ReactNode)
                                            : null}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
