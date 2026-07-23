import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { roleMenus, type MenuItem } from "../../config/roleMenus";
import { Avatar } from "../ui/Avatar";
import {
    LayoutDashboard,
    Building2,
    GitBranch,
    Activity,
    Stethoscope,
    Users,
    Contact,
    UserCog,
    Calendar,
    Star,
    Bell,
    Settings,
    User,
    ChevronLeft,
    ChevronRight,
    HeartPulse,
    LogOut
} from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onClose: () => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
    dashboard: LayoutDashboard,
    organizations: Building2,
    branches: GitBranch,
    specializations: Activity,
    doctors: Stethoscope,
    patients: Users,
    receptionists: Contact,
    users: UserCog,
    appointments: Calendar,
    reviews: Star,
    notifications: Bell,
    settings: Settings,
    profile: User,
};

export default function Sidebar({ isOpen, isCollapsed, onToggleCollapse, onClose }: SidebarProps) {
    const { currentUser, logout } = useAuth();
    const role = currentUser?.role || "Patient";
    const menuItems = roleMenus[role] || roleMenus.Patient;

    return (
        <>
            {/* Mobile backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container — Dark in Light mode, Light in Dark mode */}
            <motion.aside
                animate={{ width: isCollapsed ? 72 : 268 }}
                transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
                className={[
                    "fixed md:sticky top-4 bottom-4 left-4 z-50",
                    "flex flex-col h-[calc(100vh-32px)] overflow-hidden",
                    "bg-[#0F172A] dark:bg-white text-slate-100 dark:text-slate-800 rounded-[28px]",
                    "border border-slate-800/80 dark:border-slate-200 shadow-2xl shrink-0",
                    "transition-transform transition-colors duration-300 md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-[120%] md:translate-x-0",
                ].join(" ")}
            >
                {/* ── Logo / Header ──────────────────────────────────── */}
                <div className={[
                    "flex items-center gap-3 border-b border-slate-800/80 dark:border-slate-100 shrink-0",
                    isCollapsed ? "!px-0 !py-5 justify-center" : "!px-5 !py-5",
                ].join(" ")}>
                    {/* Logo icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/25 shrink-0">
                        <HeartPulse className="h-5 w-5 text-white" />
                    </div>

                    {/* Brand text — only when expanded */}
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col min-w-0"
                        >
                            <span className="font-bold text-sm leading-none tracking-tight text-white dark:text-slate-900">Shefaa</span>
                            <span className="text-[10px] text-cyan-400 dark:text-cyan-600 font-semibold tracking-wider uppercase mt-1">Medical Portal</span>
                        </motion.div>
                    )}
                </div>

                {/* ── Nav items ──────────────────────────────────────── */}
                <nav className={[
                    "flex-1 overflow-y-auto overflow-x-hidden !py-4 space-y-1 w-full",
                    isCollapsed ? "!px-2" : "!px-3",
                ].join(" ")}>
                    {menuItems.map((item: MenuItem) => {
                        const IconComponent = iconMap[item.iconName] || Activity;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                end={item.path === "/"}
                                className={({ isActive }) =>
                                    [
                                        "relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 group",
                                        isCollapsed
                                            ? "justify-center !p-1.75"
                                            : "gap-3 !px-3 !py-2.5",
                                        isActive
                                            ? "bg-slate-800/90 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-700/60 dark:border-slate-200 shadow-xs"
                                            : "text-slate-400 dark:text-slate-500 hover:bg-slate-800/50 dark:hover:bg-slate-50 hover:text-slate-100 dark:hover:text-slate-900",
                                    ].join(" ")
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Active left accent bar */}
                                        {isActive && !isCollapsed && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="absolute left-0 w-1 h-5 bg-cyan-500 dark:bg-cyan-600 rounded-r-full"
                                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                            />
                                        )}

                                        {/* Icon */}
                                        <IconComponent
                                            className={[
                                                "h-[18px] w-[18px] shrink-0 transition-colors duration-200",
                                                isActive
                                                    ? "text-cyan-400 dark:text-cyan-600"
                                                    : "text-slate-400 dark:text-slate-400 group-hover:text-slate-200 dark:group-hover:text-slate-700",
                                            ].join(" ")}
                                        />

                                        {/* Label — only when expanded */}
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.15 }}
                                                className="truncate text-[13px] font-semibold"
                                            >
                                                {item.title}
                                            </motion.span>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* ── Collapse Toggle (Desktop only) ────────────────── */}
                <div className="hidden md:flex px-3 py-3 border-t border-slate-800/80 dark:border-slate-100 justify-center shrink-0">
                    <button
                        onClick={onToggleCollapse}
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white hover:bg-blue-500 active:scale-95 transition-all duration-150 cursor-pointer shadow-md shadow-blue-900/40 dark:shadow-blue-200"
                    >
                        {isCollapsed
                            ? <ChevronRight className="h-4 w-4" />
                            : <ChevronLeft className="h-4 w-4" />
                        }
                    </button>
                </div>

                {/* ── User Profile Footer ───────────────────────────── */}
                {currentUser && (
                    <div className={[
                        "shrink-0 border-t border-slate-800/80 dark:border-slate-100 rounded-b-[28px] w-full overflow-hidden bg-slate-900/50 dark:bg-slate-50/50",
                        isCollapsed ? "!p-2 flex flex-col items-center gap-2" : "!p-4",
                    ].join(" ")}>
                        {isCollapsed ? (
                            /* Collapsed: avatar + red logout stacked */
                            <>
                                <Avatar name={currentUser.fullName} size="sm" />
                                <button
                                    onClick={logout}
                                    title="Logout"
                                    className="flex items-center justify-center w-8 h-8 rounded-xl bg-rose-950/50 text-rose-400 border border-rose-800/50 hover:bg-rose-900/60 dark:bg-red-50 dark:text-red-500 dark:border-red-200 dark:hover:bg-red-100 active:scale-95 transition-all duration-150 cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </>
                        ) : (
                            /* Expanded: avatar + name/role + red logout button */
                            <div className="flex items-center gap-2.5 w-full min-w-0">
                                <div className="shrink-0">
                                    <Avatar name={currentUser.fullName} size="sm" />
                                </div>
                                <div className="flex-1 min-w-0 overflow-hidden">
                                    <p className="text-[13px] font-semibold text-slate-100 dark:text-slate-800 truncate leading-tight">
                                        {currentUser.fullName}
                                    </p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5 font-medium">
                                        {currentUser.role}
                                    </p>
                                </div>
                                <button
                                    onClick={logout}
                                    title="Logout"
                                    className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-rose-950/50 text-rose-400 border border-rose-800/50 hover:bg-rose-900/60 dark:bg-red-50 dark:text-red-500 dark:border-red-200 dark:hover:bg-red-100 active:scale-95 transition-all duration-150 cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </motion.aside>
        </>
    );
}
