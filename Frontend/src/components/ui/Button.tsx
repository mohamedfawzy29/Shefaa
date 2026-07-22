import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "style"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: ReactNode;
    iconRight?: ReactNode;
    fullWidth?: boolean;
}

const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

const variants: Record<ButtonVariant, string> = {
    primary:
        "bg-cyan-600 text-white shadow-sm hover:bg-cyan-500 active:bg-cyan-700 focus-visible:ring-cyan-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:focus-visible:ring-cyan-400",
    secondary:
        "bg-slate-100 text-slate-700 hover:bg-slate-200/80 active:bg-slate-250 focus-visible:ring-slate-400 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/85 dark:active:bg-slate-600",
    outline:
        "border border-slate-200 dark:border-slate-800 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-850 dark:hover:border-slate-700",
    ghost:
        "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100",
    danger:
        "bg-rose-600 text-white shadow-sm hover:bg-rose-500 active:bg-rose-700 focus-visible:ring-rose-500 dark:bg-rose-600 dark:hover:bg-rose-500",
};

const sizes: Record<ButtonSize, string> = {
    xs: "h-8 !px-3 text-xs gap-1.5",
    sm: "h-9 !px-4 text-sm gap-1.5",
    md: "h-11 !px-5 text-sm gap-2",
    lg: "h-12 !px-6 text-sm gap-2",
};

export function Button({
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    iconRight,
    fullWidth = false,
    className = "",
    disabled,
    children,
    ...props
}: ButtonProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            className={[
                base,
                variants[variant],
                sizes[size],
                fullWidth ? "w-full" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            disabled={disabled || loading}
            aria-busy={loading}
            {...(props as any)}
        >
            {loading ? (
                <Loader2 className="animate-spin h-4 w-4 shrink-0" />
            ) : icon ? (
                <span className="shrink-0">{icon}</span>
            ) : null}
            {children && <span>{children}</span>}
            {!loading && iconRight && (
                <span className="shrink-0">{iconRight}</span>
            )}
        </motion.button>
    );
}
