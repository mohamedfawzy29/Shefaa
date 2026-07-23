import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl";

interface ModalProps {
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    open: boolean;
    onClose: () => void;
    maxWidth?: MaxWidth;
}

const maxWidthMap: Record<MaxWidth, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
};

export function Modal({
    title,
    description,
    children,
    footer,
    open,
    onClose,
    maxWidth = "lg",
}: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [open]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        const rect = dialogRef.current?.getBoundingClientRect();
        if (rect) {
            const outsideX = e.clientX < rect.left || e.clientX > rect.right;
            const outsideY = e.clientY < rect.top || e.clientY > rect.bottom;
            if (outsideX || outsideY) onClose();
        }
    };

    return (
        <dialog
            ref={dialogRef}
            onClick={handleBackdropClick}
            onCancel={(e) => {
                e.preventDefault();
                onClose();
            }}
            className={[
                "!m-auto max-h-[90vh] w-[90%] md:w-full rounded-[28px] border-0 !p-4 overflow-hidden",
                "bg-white dark:bg-[#12141c]",
                "text-slate-900 dark:text-slate-100",
                "shadow-2xl shadow-slate-950/20 dark:shadow-slate-950/70",
                "ring-1 ring-slate-100 dark:ring-slate-800",
                "backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm",
                "open:animate-fade-in-scale",
                maxWidthMap[maxWidth],
            ]
                .join(" ")}
        >
            <div className="flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 !px-4 !py-3 shrink-0">
                    <div>
                        <h2 className="text-base font-semibold leading-tight text-slate-800 dark:text-slate-150">{title}</h2>
                        {description && (
                            <p className="!mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="shrink-0 rounded-xl !p-1.5 text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-650 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-350 focus:outline-none cursor-pointer"
                    >
                        <X className="h-4.5 w-4.5" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto !px-3 !py-6.5 text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 border-t border-slate-150/40 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 !px-6.5 !py-4.5 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </dialog>
    );
}
