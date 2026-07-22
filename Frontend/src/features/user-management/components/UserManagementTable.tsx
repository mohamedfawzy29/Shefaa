import type { UserResponse } from "../types/userManagement";
import { Table, type Column } from "../../../components/ui/Table";
import { UserCheck, Lock, Unlock } from "lucide-react";
import { useState } from "react";

interface UserManagementTableProps {
    users: UserResponse[];
    isLoading?: boolean;
    onAssignRoles: (user: UserResponse) => void;
    onLock: (user: UserResponse) => void;
    onUnlock: (user: UserResponse) => void;
    lockingId: string | null;
    unlockingId: string | null;
}

/** Renders a user avatar: 48px image with initials fallback on error. */
function UserAvatar({ user }: { user: UserResponse }) {
    const [imgError, setImgError] = useState(false);
    const initials = (user.firstName ?? "U").charAt(0).toUpperCase() + (user.lastName ?? "").charAt(0).toUpperCase();

    return (
        <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm">
            {user.profileImageUrl && !imgError ? (
                <img
                    src={user.profileImageUrl}
                    alt={`${user.firstName ?? ""} ${user.lastName ?? ""}`}
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                />
            ) : (
                <span className="text-white text-xs font-extrabold tracking-wider">
                    {initials || "U"}
                </span>
            )}
        </div>
    );
}

export function UserManagementTable({
    users,
    isLoading,
    onAssignRoles,
    onLock,
    onUnlock,
    lockingId,
    unlockingId,
}: UserManagementTableProps) {
    const columns: Column<UserResponse>[] = [
        {
            header: "User",
            render: (user) => (
                <div className="flex items-center gap-3.5">
                    <UserAvatar user={user} />
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 leading-snug truncate">
                            {user.firstName ?? ""} {user.lastName ?? ""}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate !mt-0.5" title={user.email ?? ""}>
                            {user.email ?? "No email"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            header: "Role",
            render: (user) => (
                <span className="inline-flex rounded-lg !px-2.5 !py-1 text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">
                    {user.role || "—"}
                </span>
            ),
        },
        {
            header: "Status",
            render: (user) => {
                if (user.isLockedOut) {
                    return (
                        <span className="inline-flex items-center gap-1.5 rounded-full !px-2.5 !py-1 text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            Locked
                        </span>
                    );
                }
                if (!user.isActive) {
                    return (
                        <span className="inline-flex items-center gap-1.5 rounded-full !px-2.5 !py-1 text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            Inactive
                        </span>
                    );
                }
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full !px-2.5 !py-1 text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                    </span>
                );
            },
        },
        {
            header: "Actions",
            align: "right",
            render: (user) => (
                <div className="flex items-center justify-end gap-1.5">
                    <button
                        type="button"
                        onClick={() => onAssignRoles(user)}
                        className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all cursor-pointer"
                        title="Assign Role"
                    >
                        <UserCheck className="h-3.5 w-3.5" />
                        Assign Role
                    </button>

                    {user.isLockedOut ? (
                        <button
                            type="button"
                            disabled={unlockingId === user.id}
                            onClick={() => onUnlock(user)}
                            className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                            title="Unlock account"
                        >
                            <Unlock className="h-3.5 w-3.5" />
                            Unlock
                        </button>
                    ) : (
                        <button
                            type="button"
                            disabled={lockingId === user.id}
                            onClick={() => onLock(user)}
                            className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 disabled:opacity-50 transition-all cursor-pointer"
                            title="Lock account"
                        >
                            <Lock className="h-3.5 w-3.5" />
                            Lock
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={users}
            isLoading={isLoading}
            keyExtractor={(u) => u.id}
        />
    );
}
