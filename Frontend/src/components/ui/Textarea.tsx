import { forwardRef, type TextareaHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, className = "", id, ...props }, ref) => {
        const textareaId = id || label?.replace(/\s+/g, "-").toLowerCase() || undefined;

        return (
            <div className={`w-full ${className}`}>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="!mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                        {label}
                        {props.required && (
                            <span className="!ml-0.5 text-rose-500">*</span>
                        )}
                    </label>
                )}
                <div className="relative">
                    <textarea
                        id={textareaId}
                        ref={ref}
                        className={[
                            "w-full rounded-xl border bg-white !px-4 !py-3 text-sm text-slate-900 outline-none placeholder:text-slate-450 min-h-[100px]",
                            "transition-all duration-200 shadow-xs resize-y",
                            "focus:ring-2 focus:ring-offset-0",
                            "disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-950",
                            "dark:bg-[#12141c] dark:text-slate-100 dark:placeholder:text-slate-600",
                            error
                                ? "border-rose-450 focus:border-rose-450 focus:ring-rose-500/10 dark:border-rose-500"
                                : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/10 dark:border-slate-800 dark:focus:border-cyan-500",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        aria-invalid={error ? "true" : "false"}
                        aria-describedby={
                            error
                                ? `${textareaId}-error`
                                : hint
                                    ? `${textareaId}-hint`
                                    : undefined
                        }
                        {...props}
                    />
                </div>
                {error && (
                    <p
                        id={`${textareaId}-error`}
                        className="!mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-450"
                        role="alert"
                    >
                        <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p id={`${textareaId}-hint`} className="!mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";
