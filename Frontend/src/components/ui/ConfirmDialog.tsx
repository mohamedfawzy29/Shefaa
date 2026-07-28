import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: "primary" | "danger";
    loading?: boolean;
}

export function ConfirmDialog({
    title,
    description,
    isOpen,
    onClose,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "primary",
    loading = false,
}: ConfirmDialogProps) {
    return (
        <Modal
            title={title}
            open={isOpen}
            onClose={onClose}
            maxWidth="sm"
            footer={
                <div className="flex items-center justify-end gap-2.5 w-full">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={variant === "danger" ? "danger" : "primary"}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmText}
                    </Button>
                </div>
            }
        >
            <div className="flex items-start gap-4">
                {variant === "danger" && (
                    <div className="shrink-0 p-3 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-450 border border-rose-100/50 dark:border-rose-900/30">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                )}
                <div className="space-y-1">
                    <p className="text-slate-600 dark:text-slate-350 leading-relaxed text-sm">
                        {description}
                    </p>
                </div>
            </div>
        </Modal>
    );
}
