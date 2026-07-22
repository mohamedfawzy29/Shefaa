import { forwardRef, type SelectHTMLAttributes } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";

interface Option {
    label: string;
    value: string | number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    hint?: string;
    options: Option[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, hint, options, placeholder, className = "", id, ...props }, ref) => {
        const selectId = id || label?.replace(/\s+/g, "-").toLowerCase() || undefined;

        return (
            <div className={`w-full ${className}`}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                        {label}
                        {props.required && (
                            <span className="!ml-0.5 text-rose-500">*</span>
                        )}
                    </label>
                )}
                <div className="relative">
                    <select
                        id={selectId}
                        ref={ref}
                        className={[
                            "w-full appearance-none rounded-xl border bg-white !px-4 !py-3 pr-10 text-sm text-slate-900 outline-none shadow-xs",
                            "transition-all duration-200 cursor-pointer",
                            "focus:ring-2 focus:ring-offset-0",
                            "disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-950",
                            "dark:bg-[#12141c] dark:text-slate-100",
                            error
                                ? "border-rose-450 focus:border-rose-450 focus:ring-rose-500/10 dark:border-rose-500"
                                : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/10 dark:border-slate-800 dark:focus:border-cyan-500",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        aria-invalid={error ? "true" : "false"}
                        aria-describedby={
                            error
                                ? `${selectId}-error`
                                : hint
                                    ? `${selectId}-hint`
                                    : undefined
                        }
                        {...props}
                    >
                        {placeholder && (
                            <option value="">{placeholder}</option>
                        )}
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {/* Custom chevron */}
                    <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                        <ChevronDown className="h-4 w-4" />
                    </div>
                </div>
                {error && (
                    <p
                        id={`${selectId}-error`}
                        className="!mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-450"
                        role="alert"
                    >
                        <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p id={`${selectId}-hint`} className="!mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";
