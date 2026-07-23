import type { ReactNode } from "react";
import { motion } from "framer-motion";

type CardVariant = "default" | "flat" | "elevated";

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: CardVariant;
    hoverable?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
    animate?: boolean;
}

const variants: Record<CardVariant, string> = {
    default: "bg-white dark:bg-[#12141c] border border-slate-200/80 dark:border-slate-800 shadow-sm",
    flat: "bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-850",
    elevated: "bg-white dark:bg-[#12141c] shadow-lg shadow-slate-100/50 dark:shadow-slate-950/50 border border-slate-100/80 dark:border-slate-800/50",
};

const paddings = {
    none: "",
    sm: "!p-4",
    md: "!p-5",
    lg: "!p-5 sm:p-6",
};

export function Card({
    children,
    className = "",
    variant = "default",
    hoverable = false,
    padding = "md",
    animate = true,
}: CardProps) {
    return (
        <motion.div
            initial={animate ? { opacity: 0, y: 12 } : undefined}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
            whileHover={hoverable ? { y: -4, transition: { duration: 0.2 } } : undefined}
            className={[
                "rounded-[28px] transition-all duration-200 overflow-hidden",
                variants[variant],
                paddings[padding],
                hoverable ? "cursor-pointer hover:shadow-md" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </motion.div>
    );
}

// ─── Card sub-components ──────────────────────────────────────────────────────

interface CardHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
    icon?: ReactNode;
    iconColor?: string;
}

export function CardHeader({
    title,
    description,
    action,
    icon,
    iconColor = "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400 border border-cyan-100/30",
}: CardHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-4 !mb-5">
            <div className="flex items-start gap-3.5">
                {icon && (
                    <div
                        className={[
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                            iconColor,
                        ].join(" ")}
                    >
                        {icon}
                    </div>
                )}
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-none">
                        {title}
                    </h3>
                    {description && (
                        <p className="!mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

export function CardDivider() {
    return (
        <hr className="!my-5 border-slate-100 dark:border-slate-800" />
    );
}
