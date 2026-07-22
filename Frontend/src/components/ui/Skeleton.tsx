import type { ReactNode } from "react";

// ─── Skeleton primitive ────────────────────────────────────────────────────────

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <div
            className={[
                "animate-skeleton rounded-md bg-slate-100 dark:bg-slate-800",
                className,
            ].join(" ")}
        />
    );
}

// ─── Skeleton Text (multiple lines) ──────────────────────────────────────────

export function SkeletonText({ lines = 3 }: { lines?: number }) {
    const widths = ["w-full", "w-5/6", "w-4/6", "w-3/6"];
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={["h-3.5", widths[i % widths.length]].join(" ")}
                />
            ))}
        </div>
    );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

export function SkeletonCard() {
    return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 !p-5 space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
            </div>
            <SkeletonText lines={3} />
        </div>
    );
}

// ─── Skeleton Stat Card ───────────────────────────────────────────────────────

export function SkeletonStatCard() {
    return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 !p-5 space-y-3">
            <div className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32" />
        </div>
    );
}

// ─── Generic List Skeleton ────────────────────────────────────────────────────

export function SkeletonList({ rows = 4 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 !p-3">
                    <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-3.5 w-1/3" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
            ))}
        </div>
    );
}

// ─── Page Skeleton ────────────────────────────────────────────────────────────

export function SkeletonPage({ children }: { children?: ReactNode }) {
    return (
        <div className="animate-fade-in space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-72" />
            </div>
            {children ?? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonStatCard key={i} />
                    ))}
                </div>
            )}
        </div>
    );
}
