interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
    return (
        <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm animate-pulse">
            {/* Header */}
            <div className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/80 !px-6 !py-4 flex items-center gap-6">
                {Array.from({ length: columns }).map((_, i) => (
                    <div
                        key={i}
                        className={[
                            "h-3.5 rounded-full bg-slate-200 dark:bg-slate-700",
                            i === 0 ? "w-24" : i === columns - 1 ? "w-16 ml-auto" : "flex-1",
                        ].join(" ")}
                    />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 !px-6 !py-4.5 last:border-0"
                >
                    <div className="h-11 w-11 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0 ring-2 ring-slate-100 dark:ring-slate-800" />
                    {Array.from({ length: columns - 1 }).map((_, j) => (
                        <div
                            key={j}
                            className={[
                                "h-4 rounded-lg bg-slate-100 dark:bg-slate-800",
                                j === columns - 2 ? "w-24 ml-auto" : "flex-1",
                            ].join(" ")}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
