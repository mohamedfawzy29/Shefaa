type BadgeVariant =
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "purple"
    | "indigo"
    | "outline";

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: "sm" | "md";
    dot?: boolean;
    className?: string;
}

const variants: Record<BadgeVariant, string> = {
    default: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    primary: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/60 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-800",
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800",
    warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-800",
    danger: "bg-red-50 text-red-700 ring-1 ring-red-200/60 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-800",
    info: "bg-sky-50 text-sky-700 ring-1 ring-sky-200/60 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-800",
    purple: "bg-purple-50 text-purple-700 ring-1 ring-purple-200/60 dark:bg-purple-900/30 dark:text-purple-300 dark:ring-purple-800",
    indigo: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/60 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-800",
    outline: "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400",
};

const dotColors: Record<BadgeVariant, string> = {
    default: "bg-slate-400",
    primary: "bg-blue-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-sky-500",
    purple: "bg-purple-500",
    indigo: "bg-indigo-500",
    outline: "bg-slate-400",
};

const sizes = {
    sm: "!px-1.5 !py-0.5 text-[11px] gap-1",
    md: "!px-2 !py-0.5 text-xs gap-1.5",
};

export function Badge({
    children,
    variant = "default",
    size = "md",
    dot = false,
    className = "",
}: BadgeProps) {
    return (
        <span
            className={[
                "inline-flex items-center font-medium rounded-full",
                variants[variant],
                sizes[size],
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {dot && (
                <span
                    className={[
                        "inline-block rounded-full shrink-0",
                        size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
                        dotColors[variant],
                    ].join(" ")}
                />
            )}
            {children}
        </span>
    );
}

// ─── Preset role / status badges ─────────────────────────────────────────────

export function RoleBadge({ role }: { role: string }) {
    const map: Record<string, BadgeVariant> = {
        Admin: "danger",
        Doctor: "primary",
        Receptionist: "info",
        Patient: "success",
    };
    return (
        <Badge variant={map[role] ?? "default"} dot>
            {role}
        </Badge>
    );
}

export function StatusBadge({ status }: { status: string }) {
    const lower = status?.toLowerCase() ?? "";
    const map: Record<string, BadgeVariant> = {
        active: "success",
        inactive: "default",
        pending: "warning",
        completed: "primary",
        cancelled: "danger",
        confirmed: "info",
        rejected: "danger",
        approved: "success",
    };
    return (
        <Badge variant={map[lower] ?? "default"} dot>
            {status}
        </Badge>
    );
}
