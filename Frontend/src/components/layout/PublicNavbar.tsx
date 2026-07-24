import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../app/providers/ThemeProvider";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { roleMenus } from "../../config/roleMenus";
import { Avatar } from "../ui/Avatar";
import { Activity, Sun, Moon, Menu, X, LogIn, LogOut } from "lucide-react";

const BASE_NAV_LINKS = [
    { label: "Home", to: "/" },
    { label: "Doctors", to: "/doctors" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
];

export default function PublicNavbar() {
    const { theme, setTheme } = useTheme();
    const { isAuthenticated, currentUser, logout } = useAuth();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const isDark = theme === "dark";

    const isPatient = isAuthenticated && currentUser?.role === "Patient";

    // Build nav links: if patient, inject Notifications & Profile
    const navLinks = isPatient
        ? [
            { label: "Home", to: "/" },
            { label: "Doctors", to: "/doctors" },
            { label: "My Appointments", to: "/patient/appointments" },
            { label: "Medical History", to: "/patient/medical-history" },
            { label: "Profile", to: "/profile" },
            { label: "About", to: "/about" },
            { label: "Contact", to: "/contact" },
        ]
        : BASE_NAV_LINKS;

    return (
        <header className="sticky top-0 z-[999] w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md shadow-sm transition-all duration-300">
            <div className="max-w-7x2 mx-auto flex h-16 items-center justify-between !px-6">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-2.5 shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20">
                        <Activity className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                        Shefaa
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.to;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={[
                                    "!px-4 !py-2 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
                                ].join(" ")}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Theme toggle */}
                    <button
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        type="button"
                        aria-label="Toggle theme"
                        className="rounded-xl !p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 transition-all focus:outline-none cursor-pointer"
                    >
                        {isDark ? <Sun className="h-4.5 w-4.5 text-yellow-400" /> : <Moon className="h-4.5 w-4.5" />}
                    </button>

                    {isAuthenticated ? (
                        isPatient ? (
                            <div className="hidden md:flex items-center gap-3">
                                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <Avatar name={currentUser?.fullName || "Patient"} size="sm" />
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                                        {currentUser?.fullName}
                                    </span>
                                </Link>
                                <button
                                    onClick={logout}
                                    title="Logout"
                                    className="!px-3 !py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all flex items-center gap-1 cursor-pointer"
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/dashboard"
                                className="hidden md:inline-flex items-center gap-1.5 !px-4 !py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-sm hover:shadow-cyan-500/30 hover:shadow-md transition-all"
                            >
                                Dashboard
                            </Link>
                        )
                    ) : (
                        <Link
                            to="/login"
                            className="hidden md:inline-flex items-center gap-1.5 !px-4 !py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-sm hover:shadow-cyan-500/30 hover:shadow-md transition-all"
                        >
                            <LogIn className="h-4 w-4" />
                            Login
                        </Link>
                    )}

                    {/* Mobile burger */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        className="md:hidden rounded-xl !p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-all focus:outline-none cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] !px-6 !py-4 space-y-1">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.to;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className={[
                                    "block !px-4 !py-2.5 rounded-xl text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                                ].join(" ")}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                    <div className="!pt-2 border-t border-slate-100 dark:border-slate-800">
                        {isAuthenticated ? (
                            isPatient ? (
                                <div className="space-y-2 !pt-1">
                                    <div className="flex items-center gap-2 !px-4 !py-1">
                                        <Avatar name={currentUser?.fullName || "Patient"} size="sm" />
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                            {currentUser?.fullName}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => { setMenuOpen(false); logout(); }}
                                        className="w-full text-left block !px-4 !py-2 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/dashboard"
                                    onClick={() => setMenuOpen(false)}
                                    className="block !px-4 !py-2.5 rounded-xl text-sm font-semibold text-cyan-600 dark:text-cyan-400"
                                >
                                    Dashboard
                                </Link>
                            )
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="block !px-4 !py-2.5 rounded-xl text-sm font-semibold text-cyan-600 dark:text-cyan-400"
                            >
                                Login / Register
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

