import type { ReactNode } from "react";
import { Button } from "./Button";

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    action?: ReactNode;
}

export function EmptyState({
    title,
    description,
    icon,
    actionLabel,
    onAction,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in !my-4">
            {icon && (
                <div className="!mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100/80 text-slate-400 dark:bg-slate-800/80 dark:text-slate-500 ring-8 ring-slate-50 dark:ring-slate-900/50 shadow-xs">
                    {icon}
                </div>
            )}
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {title}
            </h3>
            <p className="!mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {description}
            </p>
            {(action || (actionLabel && onAction)) && (
                <div className="!mt-5">
                    {action ?? (
                        <Button onClick={onAction} size="sm">{actionLabel}</Button>
                    )}
                </div>
            )}
        </div>
    );
}
