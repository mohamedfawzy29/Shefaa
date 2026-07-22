import type { ReactNode } from "react";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    badge?: ReactNode;
    actions?: ReactNode;
}

export function SectionHeader({
    title,
    subtitle,
    badge,
    actions,
}: SectionHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-6 w-full min-w-0">
            <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                        {title}
                    </h2>
                    {badge && (
                        <div className="inline-flex items-center gap-1.5 !px-3 !py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400 border border-cyan-100/30 shrink-0">
                            {badge}
                        </div>
                    )}
                </div>
                {subtitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        {subtitle}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-3 shrink-0 self-start">
                    {actions}
                </div>
            )}
        </div>
    );
}
