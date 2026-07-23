import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageContainerProps {
    children: ReactNode;
    title?: string;
    description?: string;
    action?: ReactNode;
    /** When true, renders children directly without wrapping in a white card */
    noCard?: boolean;
}

export default function PageContainer({
    children,
    title,
    description,
    action,
    noCard = false,
}: PageContainerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-full !px-2 sm:px-2 !py-6"
        >
            {/* Legacy title/description header — used only when noCard=false */}
            {!noCard && (title || description || action) && (
                <div className="!mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        {title && (
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="!mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                {description}
                            </p>
                        )}
                    </div>
                    {action && <div className="shrink-0 self-start sm:self-center">{action}</div>}
                </div>
            )}

            {/* Content */}
            {noCard ? (
                /* noCard mode: children manage their own Cards */
                <div className="space-y-8">{children}</div>
            ) : (
                /* Card mode: single white rounded card wrapping all children */
                <div className="rounded-2xl bg-white dark:bg-[#12141c] border border-slate-200 dark:border-slate-800 shadow-sm !p-5 overflow-hidden">
                    {children}
                </div>
            )}
        </motion.div>
    );
}
