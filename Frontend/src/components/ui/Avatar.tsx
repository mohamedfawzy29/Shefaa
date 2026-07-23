type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
    name?: string;
    src?: string | null;
    size?: AvatarSize;
    className?: string;
}

const sizes: Record<AvatarSize, string> = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-xl",
};

function getInitials(name?: string): string {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

// Deterministic colour from name
const colours = [
    "from-blue-400 to-blue-600",
    "from-violet-400 to-violet-600",
    "from-emerald-400 to-emerald-600",
    "from-amber-400 to-amber-600",
    "from-rose-400 to-rose-600",
    "from-sky-400 to-sky-600",
    "from-indigo-400 to-indigo-600",
    "from-teal-400 to-teal-600",
];

function pickColour(name?: string) {
    if (!name) return colours[0];
    const sum = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return colours[sum % colours.length];
}

export function Avatar({ name, src, size = "md", className = "" }: AvatarProps) {
    const gradient = pickColour(name);

    if (src) {
        return (
            <img
                src={src}
                alt={name ?? "Avatar"}
                className={[
                    "rounded-full object-cover ring-2 ring-white dark:ring-slate-900 shrink-0",
                    sizes[size],
                    className,
                ].join(" ")}
            />
        );
    }

    return (
        <div
            className={[
                `bg-gradient-to-br ${gradient}`,
                "flex items-center justify-center rounded-full text-white font-semibold ring-2 ring-white dark:ring-slate-900 shrink-0 select-none",
                sizes[size],
                className,
            ].join(" ")}
            aria-label={name ?? "Avatar"}
        >
            {getInitials(name)}
        </div>
    );
}
