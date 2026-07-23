import type { ReactNode } from "react";
import { Skeleton } from "./Skeleton";

export type StatsCardColor =
    | "blue" | "indigo" | "green" | "purple"
    | "red" | "orange" | "amber" | "sky" | "slate" | "lime";

interface StatsCardProps {
    label: string;
    value?: number | string;
    isLoading?: boolean;
    color?: StatsCardColor;
    icon?: ReactNode;
    description?: string;
    percentage?: number;
    maxLabel?: string;
}

const colors: Record<StatsCardColor, {
    card: string;
    border: string;
    iconWrap: string;
    iconColor: string;
    valueText: string;
    pill: string;
    pillFilled: string;
    pillEmpty: string;
    label: string;
}> = {
    blue: {
        card: "bg-blue-50 dark:bg-blue-950/30",
        border: "border-blue-100 dark:border-blue-900/40",
        iconWrap: "bg-blue-100 dark:bg-blue-900/50",
        iconColor: "text-blue-600 dark:text-blue-400",
        valueText: "text-blue-700 dark:text-blue-300",
        pill: "bg-white/80 dark:bg-slate-900/60 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50",
        pillFilled: "bg-blue-500 dark:bg-blue-400",
        pillEmpty: "bg-blue-200/40 dark:bg-blue-900/30",
        label: "text-blue-600/80 dark:text-blue-400/70",
    },
    indigo: {
        card: "bg-indigo-50 dark:bg-indigo-950/30",
        border: "border-indigo-100 dark:border-indigo-900/40",
        iconWrap: "bg-indigo-100 dark:bg-indigo-900/50",
        iconColor: "text-indigo-600 dark:text-indigo-400",
        valueText: "text-indigo-700 dark:text-indigo-300",
        pill: "bg-white/80 dark:bg-slate-900/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-800/50",
        pillFilled: "bg-indigo-500 dark:bg-indigo-400",
        pillEmpty: "bg-indigo-200/40 dark:bg-indigo-900/30",
        label: "text-indigo-600/80 dark:text-indigo-400/70",
    },
    green: {
        card: "bg-emerald-50 dark:bg-emerald-950/30",
        border: "border-emerald-100 dark:border-emerald-900/40",
        iconWrap: "bg-emerald-100 dark:bg-emerald-900/50",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        valueText: "text-emerald-700 dark:text-emerald-300",
        pill: "bg-white/80 dark:bg-slate-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50",
        pillFilled: "bg-emerald-500 dark:bg-emerald-400",
        pillEmpty: "bg-emerald-200/40 dark:bg-emerald-900/30",
        label: "text-emerald-600/80 dark:text-emerald-400/70",
    },
    purple: {
        card: "bg-purple-50 dark:bg-purple-950/30",
        border: "border-purple-100 dark:border-purple-900/40",
        iconWrap: "bg-purple-100 dark:bg-purple-900/50",
        iconColor: "text-purple-600 dark:text-purple-400",
        valueText: "text-purple-700 dark:text-purple-300",
        pill: "bg-white/80 dark:bg-slate-900/60 text-purple-700 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/50",
        pillFilled: "bg-purple-500 dark:bg-purple-400",
        pillEmpty: "bg-purple-200/40 dark:bg-purple-900/30",
        label: "text-purple-600/80 dark:text-purple-400/70",
    },
    red: {
        card: "bg-red-50 dark:bg-red-950/30",
        border: "border-red-100 dark:border-red-900/40",
        iconWrap: "bg-red-100 dark:bg-red-900/50",
        iconColor: "text-red-600 dark:text-red-400",
        valueText: "text-red-700 dark:text-red-300",
        pill: "bg-white/80 dark:bg-slate-900/60 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-800/50",
        pillFilled: "bg-red-500 dark:bg-red-400",
        pillEmpty: "bg-red-200/40 dark:bg-red-900/30",
        label: "text-red-600/80 dark:text-red-400/70",
    },
    orange: {
        card: "bg-orange-50 dark:bg-orange-950/30",
        border: "border-orange-100 dark:border-orange-900/40",
        iconWrap: "bg-orange-100 dark:bg-orange-900/50",
        iconColor: "text-orange-600 dark:text-orange-400",
        valueText: "text-orange-700 dark:text-orange-300",
        pill: "bg-white/80 dark:bg-slate-900/60 text-orange-700 dark:text-orange-300 border-orange-200/50 dark:border-orange-800/50",
        pillFilled: "bg-orange-500 dark:bg-orange-400",
        pillEmpty: "bg-orange-200/40 dark:bg-orange-900/30",
        label: "text-orange-600/80 dark:text-orange-400/70",
    },
    amber: {
        card: "bg-amber-50 dark:bg-amber-950/30",
        border: "border-amber-100 dark:border-amber-900/40",
        iconWrap: "bg-amber-100 dark:bg-amber-900/50",
        iconColor: "text-amber-600 dark:text-amber-400",
        valueText: "text-amber-700 dark:text-amber-300",
        pill: "bg-white/80 dark:bg-slate-900/60 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/50",
        pillFilled: "bg-amber-500 dark:bg-amber-400",
        pillEmpty: "bg-amber-200/40 dark:bg-amber-900/30",
        label: "text-amber-600/80 dark:text-amber-400/70",
    },
    sky: {
        card: "bg-sky-50 dark:bg-sky-950/30",
        border: "border-sky-100 dark:border-sky-900/40",
        iconWrap: "bg-sky-100 dark:bg-sky-900/50",
        iconColor: "text-sky-600 dark:text-sky-400",
        valueText: "text-sky-700 dark:text-sky-300",
        pill: "bg-white/80 dark:bg-slate-900/60 text-sky-700 dark:text-sky-300 border-sky-200/50 dark:border-sky-800/50",
        pillFilled: "bg-sky-500 dark:bg-sky-400",
        pillEmpty: "bg-sky-200/40 dark:bg-sky-900/30",
        label: "text-sky-600/80 dark:text-sky-400/70",
    },
    slate: {
        card: "bg-white dark:bg-[#16181d]",
        border: "border-slate-200 dark:border-slate-800",
        iconWrap: "bg-slate-100 dark:bg-slate-800",
        iconColor: "text-slate-600 dark:text-slate-300",
        valueText: "text-slate-800 dark:text-slate-100",
        pill: "bg-slate-100/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-slate-700/50",
        pillFilled: "bg-slate-500 dark:bg-slate-400",
        pillEmpty: "bg-slate-200 dark:bg-slate-800",
        label: "text-slate-500 dark:text-slate-400",
    },
    lime: {
        card: "bg-[#eafb72] dark:bg-[#bfdb38]/15",
        border: "border-[#d4ee3b]/60 dark:border-lime-900/40",
        iconWrap: "bg-white/60 dark:bg-lime-950/40",
        iconColor: "text-slate-800 dark:text-lime-300",
        valueText: "text-slate-900 dark:text-lime-300",
        pill: "bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-lime-300 border-lime-300/40 dark:border-lime-800/50",
        pillFilled: "bg-slate-800 dark:bg-lime-400",
        pillEmpty: "bg-slate-300/40 dark:bg-lime-900/40",
        label: "text-slate-700/80 dark:text-lime-400/70",
    },
};

export function StatsCard({
    label,
    value,
    isLoading = false,
    color = "slate",
    icon,
    description,
    percentage = 70,
    maxLabel,
}: StatsCardProps) {
    const p = colors[color] || colors.slate;
    const filledCount = Math.min(Math.round((percentage / 100) * 6), 6);

    if (isLoading) {
        return (
            <div className={[
                "rounded-2xl border !p-5 flex flex-col gap-5",
                p.card, p.border,
            ].join(" ")}>
                <div className="flex items-start justify-between gap-3">
                    <div className="h-4 w-20 rounded-full bg-current opacity-10 animate-pulse" />
                    <div className="h-10 w-10 rounded-xl bg-current opacity-10 animate-pulse shrink-0" />
                </div>
                <div className="h-9 w-16 rounded-lg bg-current opacity-10 animate-pulse" />
                <div className="flex gap-1.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-2.5 flex-1 rounded-full bg-current opacity-10 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={[
            "rounded-2xl border !p-5 flex flex-col gap-5 transition-all duration-200",
            "hover:shadow-md hover:-translate-y-0.5 cursor-default",
            p.card, p.border,
        ].join(" ")}>

            {/* Row 1: Icon (centered) + label + percentage pill */}
            <div className="flex items-start justify-between gap-3">
                {/* Icon */}
                <div className={[
                    "flex items-center justify-center rounded-xl shrink-0",
                    "h-10 w-10",
                    p.iconWrap, p.iconColor,
                ].join(" ")}>
                    {icon}
                </div>

                {/* Label */}
                <span className={[
                    "flex-1 text-xs md:text-sm font-bold uppercase tracking-wider leading-snug break-words !mt-1",
                    p.label,
                ].join(" ")}>
                    {label}
                </span>

                {/* Percentage pill */}
                <span className={[
                    "shrink-0 text-xs font-bold !px-2.5 !py-0.5 rounded-full border !mt-1",
                    p.pill,
                ].join(" ")}>
                    {percentage}%
                </span>
            </div>

            {/* Row 2: Value + optional suffix */}
            <div className="flex items-baseline gap-1.5">
                <span className={[
                    "text-3xl md:text-4xl font-extrabold tracking-tight leading-none",
                    p.valueText,
                ].join(" ")}>
                    {value ?? 0}
                </span>
                {maxLabel && (
                    <span className="text-xs md:text-sm font-semibold text-slate-400 dark:text-slate-500">
                        {maxLabel}
                    </span>
                )}
            </div>

            {/* Row 3: Capsule indicators */}
            <div className="flex items-center gap-1.5">
                {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                        key={idx}
                        className={[
                            "h-2.5 flex-1 rounded-full transition-all duration-300",
                            idx < filledCount ? p.pillFilled : p.pillEmpty,
                        ].join(" ")}
                    />
                ))}
            </div>

            {description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed -mt-1">
                    {description}
                </p>
            )}
        </div>
    );
}
