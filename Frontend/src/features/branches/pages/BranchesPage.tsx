import { useState, useMemo } from "react";
import PageContainer from "../../../components/layout/PageContainer";
import { EmptyState, ErrorState, Button, StatsCard, Input, SectionHeader, Toolbar, Card } from "../../../components/ui";
import { useBranches } from "../hooks/useBranches";
import { BranchesTable } from "../components/BranchesTable";
import { CreateBranchDialog } from "../components/dialogs/CreateBranchDialog";
import { EditBranchDialog } from "../components/dialogs/EditBranchDialog";
import { DeleteBranchDialog } from "../components/dialogs/DeleteBranchDialog";
import type { BranchResponse } from "../types/branch";
import { Search, GitBranch, CheckCircle2, MinusCircle, Plus } from "lucide-react";

export default function BranchesPage() {
    const { data: branches, isLoading, isError, error, refetch } = useBranches();

    const [searchQuery, setSearchQuery] = useState("");

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [branchToEdit, setBranchToEdit] = useState<BranchResponse | null>(null);
    const [branchToDelete, setBranchToDelete] = useState<BranchResponse | null>(null);

    const filteredBranches = useMemo(() => {
        const list = branches ?? [];
        if (!searchQuery.trim()) return list;
        const q = searchQuery.toLowerCase();
        return list.filter(
            (b) =>
                (b.branchName ?? "").toLowerCase().includes(q) ||
                (b.organizationName ?? "").toLowerCase().includes(q) ||
                (b.branchEmail ?? "").toLowerCase().includes(q) ||
                (b.city ?? "").toLowerCase().includes(q)
        );
    }, [branches, searchQuery]);

    const total = branches?.length ?? 0;
    const active = branches?.filter((b) => b.isActive).length ?? 0;
    const inactive = total - active;

    return (
        <PageContainer noCard={true}>
            <SectionHeader
                title="Branches"
                subtitle="Manage organization branches and locations across regions."
                badge={
                    <span className="flex items-center gap-1">
                        <GitBranch className="h-3.5 w-3.5" />
                        Locations
                    </span>
                }
                actions={
                    <Button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        icon={<Plus className="h-4 w-4" />}
                        className="!m-2"
                    >
                        Add Branch
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 !mb-6">
                <StatsCard label="Total Branches" value={total} color="indigo" icon={<GitBranch className="h-4.5 w-4.5" />} percentage={70} />
                <StatsCard label="Active" value={active} color="green" icon={<CheckCircle2 className="h-4.5 w-4.5" />} percentage={82} />
                <StatsCard label="Inactive" value={inactive} color="slate" icon={<MinusCircle className="h-4.5 w-4.5" />} percentage={18} />
            </div>

            <Card variant="default" padding="lg">
                <Toolbar>
                    <Input
                        type="text"
                        placeholder="Search by name, organization, or city…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="h-4.5 w-4.5 text-slate-400" />}
                        className="sm:max-w-md"
                    />
                </Toolbar>

                {isError ? (
                    <ErrorState
                        title="Failed to load branches"
                        description={
                            error instanceof Error
                                ? error.message
                                : "An unexpected error occurred while fetching branches."
                        }
                        onRetry={() => refetch()}
                    />
                ) : branches?.length === 0 && !isLoading ? (
                    <EmptyState
                        title="No Branches Found"
                        description="No branches have been created yet. Add one to get started."
                        action={
                            <Button type="button" onClick={() => setIsCreateOpen(true)} icon={<Plus className="h-4 w-4" />}>
                                Add Branch
                            </Button>
                        }
                        icon={<GitBranch className="h-8 w-8 text-slate-400" />}
                    />
                ) : (
                    <BranchesTable
                        branches={filteredBranches}
                        isLoading={isLoading}
                        onEdit={(b) => setBranchToEdit(b)}
                        onDelete={(b) => setBranchToDelete(b)}
                    />
                )}
            </Card>

            <CreateBranchDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
            <EditBranchDialog
                branch={branchToEdit}
                isOpen={!!branchToEdit}
                onClose={() => setBranchToEdit(null)}
            />
            <DeleteBranchDialog
                branch={branchToDelete}
                isOpen={!!branchToDelete}
                onClose={() => setBranchToDelete(null)}
            />
        </PageContainer>
    );
}
