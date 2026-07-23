import type { ReactNode } from "react";

interface ToolbarProps {
    children: ReactNode;
    className?: string;
}

export function Toolbar({ children, className = "" }: ToolbarProps) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 !mb-5 w-full overflow-x-hidden ${className}`}>
            {children}
        </div>
    );
}
