import { useState, useMemo } from "react";
import PageContainer from "../../../components/layout/PageContainer";
import { EmptyState, ErrorState, StatsCard, Input, SectionHeader, Toolbar, Card } from "../../../components/ui";
import { useUsers, useLockUser, useUnlockUser } from "../hooks/useUserManagement";
import { UserManagementTable } from "../components/UserManagementTable";
import { AssignRolesDialog } from "../components/dialogs/AssignRolesDialog";
import { LockUserDialog } from "../components/dialogs/LockUserDialog";
import { UnlockUserDialog } from "../components/dialogs/UnlockUserDialog";
import type { UserResponse } from "../types/userManagement";
import { Search, Users, UserCheck, ShieldAlert } from "lucide-react";

export default function UserManagementPage() {
    const { data: users, isLoading, isError, error, refetch } = useUsers();
    const lockMutation = useLockUser();
    const unlockMutation = useUnlockUser();

    const [searchQuery, setSearchQuery] = useState("");

    // Dialog targets
    const [userToAssign, setUserToAssign] = useState<UserResponse | null>(null);
    const [userToLock, setUserToLock] = useState<UserResponse | null>(null);
    const [userToUnlock, setUserToUnlock] = useState<UserResponse | null>(null);

    const filteredUsers = useMemo(() => {
        const list = users ?? [];
        if (!searchQuery.trim()) return list;
        const q = searchQuery.toLowerCase();
        return list.filter(
            (u) =>
                (u.firstName ?? "").toLowerCase().includes(q) ||
                (u.lastName ?? "").toLowerCase().includes(q) ||
                (u.email ?? "").toLowerCase().includes(q) ||
                (u.role ?? "").toLowerCase().includes(q)
        );
    }, [users, searchQuery]);

    // Summary counts
    const totalUsers = users?.length ?? 0;
    const lockedUsers = users?.filter((u) => u.isLockedOut).length ?? 0;
    const activeUsers = users?.filter((u) => u.isActive && !u.isLockedOut).length ?? 0;

    return (
        <PageContainer noCard={true}>
            <SectionHeader
                title="User Management"
                subtitle="Manage system users, assign roles, and control account access."
                badge={
                    <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        Directory
                    </span>
                }
            />

            {/* Stats strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 !mb-6">
                <StatsCard
                    label="Total Users"
                    value={totalUsers}
                    color="indigo"
                    icon={<Users className="h-4.5 w-4.5" />}
                    percentage={85}
                />
                <StatsCard
                    label="Active Accounts"
                    value={activeUsers}
                    color="green"
                    icon={<UserCheck className="h-4.5 w-4.5" />}
                    percentage={92}
                />
                <StatsCard
                    label="Locked Accounts"
                    value={lockedUsers}
                    color="red"
                    icon={<ShieldAlert className="h-4.5 w-4.5" />}
                    percentage={8}
                />
            </div>

            {/* Main Content Card enclosing Toolbar and Table */}
            <Card variant="default" padding="lg">
                {/* Toolbar containing search input */}
                <Toolbar>
                    <Input
                        type="text"
                        id="user-search"
                        placeholder="Search by name, email or role…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="h-4.5 w-4.5 text-slate-400" />}
                        className="sm:max-w-md"
                    />
                </Toolbar>

                {/* Content table */}
                {isError ? (
                    <ErrorState
                        title="Failed to load users"
                        description={
                            error instanceof Error
                                ? error.message
                                : "An unexpected error occurred while fetching users."
                        }
                        onRetry={() => refetch()}
                    />
                ) : users?.length === 0 && !isLoading ? (
                    <EmptyState
                        title="No Users Found"
                        description="No users are registered in the system yet."
                        icon={<Users className="h-8 w-8 text-slate-400" />}
                    />
                ) : (
                    <UserManagementTable
                        users={filteredUsers}
                        isLoading={isLoading}
                        onAssignRoles={(u) => setUserToAssign(u)}
                        onLock={(u) => setUserToLock(u)}
                        onUnlock={(u) => setUserToUnlock(u)}
                        lockingId={lockMutation.isPending ? lockMutation.variables ?? null : null}
                        unlockingId={unlockMutation.isPending ? unlockMutation.variables ?? null : null}
                    />
                )}
            </Card>

            {/* Dialogs */}
            <AssignRolesDialog
                user={userToAssign}
                isOpen={!!userToAssign}
                onClose={() => setUserToAssign(null)}
            />
            <LockUserDialog
                user={userToLock}
                isOpen={!!userToLock}
                onClose={() => setUserToLock(null)}
            />
            <UnlockUserDialog
                user={userToUnlock}
                isOpen={!!userToUnlock}
                onClose={() => setUserToUnlock(null)}
            />
        </PageContainer>
    );
}
