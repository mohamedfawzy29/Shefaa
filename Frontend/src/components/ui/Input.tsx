import { forwardRef, type InputHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;

    /** Classes for wrapper */
    wrapperClassName?: string;

    /** Classes for the input itself */
    inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            hint,
            leftIcon,
            rightIcon,
            wrapperClassName = "",
            inputClassName = "",
            id,
            ...props
        },
        ref
    ) => {
        const inputId =
            id || label?.replace(/\s+/g, "-").toLowerCase() || undefined;

        return (
            <div className={`w-full ${wrapperClassName}`}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                        {label}
                        {props.required && (
                            <span className="ml-0.5 text-rose-500">*</span>
                        )}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                            {leftIcon}
                        </span>
                    )}

                    <input
                        id={inputId}
                        ref={ref}
                        {...props}
                        aria-invalid={error ? "true" : "false"}
                        aria-describedby={
                            error
                                ? `${inputId}-error`
                                : hint
                                    ? `${inputId}-hint`
                                    : undefined
                        }
                        className={[
                            "w-full",
                            "h-11",
                            "rounded-xl",
                            "border",
                            "bg-white dark:bg-[#12141c]",
                            "text-sm text-slate-900 dark:text-slate-100",
                            "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                            "outline-none",
                            "transition-all duration-200",
                            "shadow-sm",
                            "focus:ring-2 focus:ring-cyan-500/10",
                            "disabled:opacity-60 disabled:cursor-not-allowed",

                            error
                                ? "border-rose-500 focus:border-rose-500"
                                : "border-slate-200 dark:border-slate-700 focus:border-cyan-500",

                            leftIcon ? "!pl-11" : "!pl-4",
                            rightIcon ? "!r-11" : "!pr-4",

                            inputClassName,
                        ].join(" ")}
                    />

                    {rightIcon && (
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                            {rightIcon}
                        </span>
                    )}
                </div>

                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400"
                        role="alert"
                    >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                    </p>
                )}

                {hint && !error && (
                    <p
                        id={`${inputId}-hint`}
                        className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500"
                    >
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";