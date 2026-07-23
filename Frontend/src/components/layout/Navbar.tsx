import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useTheme } from "../../app/providers/ThemeProvider";
import { Avatar } from "../ui/Avatar";
import {
    Sun,
    Moon,
    Menu,
    LogOut,
    Bell,
    ChevronDown,
    User,
    Settings,
    Activity
} from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarProps {
    onToggleSidebar: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const roleColors: Record<string, string> = {
    Admin: "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30",
    Doctor: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30",
    Receptionist: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30",
    Patient: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30",
};

export default function Navbar({ onToggleSidebar }: NavbarProps) {
    const { currentUser, logout } = useAuth();
    const { theme, setTheme } = useTheme();

    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

    const profileRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    const isDark = theme === "dark";

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (
                profileRef.current &&
                !profileRef.current.contains(target)
            ) {
                setShowProfileDropdown(false);
            }

            if (
                notificationRef.current &&
                !notificationRef.current.contains(target)
            ) {
                setShowNotificationDropdown(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setShowProfileDropdown(false);
                setShowNotificationDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <header className="sticky top-0 z-[999] h-16 w-full rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-[#12141c]/80 backdrop-blur-md shadow-sm transition-all duration-300 overflow-visible relative">
            <div className="flex h-full items-center justify-between !px-6">

                {/* Left side: Mobile Toggle + Brand / Breadcrumb */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onToggleSidebar}
                        type="button"
                        aria-label="Toggle sidebar"
                        className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-all md:hidden focus:outline-none cursor-pointer"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-2 md:hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600">
                            <Activity className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">Shefaa</span>
                    </div>

                    <div className="hidden md:flex flex-col">
                        <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 tracking-wider uppercase">Workspace</span>
                        <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Clinic Management System</h1>
                    </div>
                </div>

                {/* Right side: Search, Theme, Notifications, Profile Dropdown */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        type="button"
                        aria-label="Toggle theme"
                        className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200 border border-slate-200/50 dark:border-slate-800/50 transition-all focus:outline-none cursor-pointer"
                    >
                        {isDark ? <Sun className="h-[18px] w-[18px] text-yellow-400" /> : <Moon className="h-[18px] w-[18px]" />}
                    </button>

                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            type="button"
                            aria-label="Notifications"
                            onClick={() => {
                                setShowNotificationDropdown((v) => !v);
                                setShowProfileDropdown(false);
                            }}
                            className="relative rounded-xl border border-slate-200/50 dark:border-slate-800/50 p-2.5 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200 cursor-pointer"
                        >
                            <Bell className="h-[18px] w-[18px]" />

                            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-cyan-500 ring-2 ring-white dark:ring-[#12141c]" />
                        </button>

                        {showNotificationDropdown && (
                            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12141c] shadow-2xl overflow-hidden z-[9999]">

                                <div className="border-b border-slate-100 dark:border-slate-800 !px-5 !py-4">
                                    <h3 className="font-semibold text-slate-800 dark:text-white">
                                        Notifications
                                    </h3>

                                    <p className="!mt-1 text-xs text-slate-500">
                                        You have 3 new notifications.
                                    </p>
                                </div>

                                <div className="max-h-80 overflow-y-auto">

                                    <button className="flex w-full items-start gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-500 shrink-0" />

                                        <div className="text-left">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                New appointment booked.
                                            </p>

                                            <span className="text-xs text-slate-500">
                                                2 minutes ago
                                            </span>
                                        </div>
                                    </button>

                                    <button className="flex w-full items-start gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />

                                        <div className="text-left">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                Doctor account approved.
                                            </p>

                                            <span className="text-xs text-slate-500">
                                                1 hour ago
                                            </span>
                                        </div>
                                    </button>

                                    <button className="flex w-full items-start gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />

                                        <div className="text-left">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                Patient cancelled appointment.
                                            </p>

                                            <span className="text-xs text-slate-500">
                                                Yesterday
                                            </span>
                                        </div>
                                    </button>

                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-800 p-3">
                                    <button className="w-full rounded-xl !py-2 text-sm font-semibold text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 transition">
                                        View all notifications
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>

                    {currentUser && (
                        <>
                            {/* Vertical divider */}
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

                            {/* Profile Dropdown Trigger */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => { setShowProfileDropdown((v) => !v); setShowNotificationDropdown(false); }}
                                    className="flex items-center gap-2.5 hover:opacity-90 transition-opacity focus:outline-none cursor-pointer"
                                >
                                    <Avatar name={currentUser.fullName} size="sm" />
                                    <div className="hidden lg:flex flex-col text-left leading-none">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                            {currentUser.fullName}
                                        </p>
                                        <span className={[
                                            "mt-1 text-[9px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full inline-block w-max",
                                            roleColors[currentUser.role ?? ""] ?? "bg-slate-100 text-slate-600"
                                        ].join(" ")}>
                                            {currentUser.role ?? "User"}
                                        </span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                </button>

                                {/* Dropdown Menu */}
                                {showProfileDropdown && (
                                    <div className="absolute right-0 !mt-3 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12141c] shadow-2xl overflow-hidden z-[9999] animate-fade-in-scale">
                                        <div className="!px-5 !py-4 border-b border-slate-100 dark:border-slate-800">
                                            <p className="text-xs text-slate-400 dark:text-slate-500">Signed in as</p>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">{currentUser.email}</p>
                                        </div>

                                        <div className="mt-2 space-y-0.5">
                                            <Link
                                                to="/profile"
                                                onClick={() => setShowProfileDropdown(false)}
                                                className="flex items-center gap-2.5 rounded-xl !px-5 !py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                                            >
                                                <User className="h-4.5 w-4.5 text-slate-400" />
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/settings"
                                                onClick={() => setShowProfileDropdown(false)}
                                                className="flex items-center gap-2.5 rounded-xl !px-5 !py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                                            >
                                                <Settings className="h-4.5 w-4.5 text-slate-400" />
                                                Settings
                                            </Link>
                                        </div>

                                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <button
                                                onClick={() => {
                                                    setShowProfileDropdown(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center gap-2.5 rounded-xl !px-5 !py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                                            >
                                                <LogOut className="h-4.5 w-4.5" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
