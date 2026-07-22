import { useState, useMemo } from "react";
import PageContainer from "../../../components/layout/PageContainer";
import { EmptyState, ErrorState, Button, StatsCard, Input, SectionHeader, Toolbar, Card } from "../../../components/ui";
import { useOrganizations } from "../hooks/useOrganizations";
import { OrganizationsTable } from "../components/OrganizationsTable";
import { CreateOrganizationDialog } from "../components/dialogs/CreateOrganizationDialog";
import { EditOrganizationDialog } from "../components/dialogs/EditOrganizationDialog";
import { DeleteOrganizationDialog } from "../components/dialogs/DeleteOrganizationDialog";
import type { OrganizationResponse } from "../types/organization";
import { Search, Building2, CheckCircle2, MinusCircle, Plus } from "lucide-react";

export default function OrganizationsPage() {
    const { data: organizations, isLoading, isError, error, refetch } = useOrganizations();

    const [searchQuery, setSearchQuery] = useState("");

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [organizationToEdit, setOrganizationToEdit] = useState<OrganizationResponse | null>(null);
    const [organizationToDelete, setOrganizationToDelete] = useState<OrganizationResponse | null>(null);

    const filteredOrganizations = useMemo(() => {
        const list = organizations ?? [];
        if (!searchQuery.trim()) return list;
        const q = searchQuery.toLowerCase();
        return list.filter(
            (o) =>
                (o.legalName ?? "").toLowerCase().includes(q) ||
                (o.taxNumber ?? "").toLowerCase().includes(q) ||
                (o.mainEmail ?? "").toLowerCase().includes(q)
        );
    }, [organizations, searchQuery]);

    const total = organizations?.length ?? 0;
    const active = organizations?.filter((o) => o.status === 'Active').length ?? 0;
    const inactive = total - active;

    return (
        <PageContainer noCard={true}>
            <SectionHeader
                title="Organizations"
                subtitle="Manage medical organizations, legal information, and contacts."
                badge={
                    <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        Registry
                    </span>
                }
                actions={
                    <Button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        icon={<Plus className="h-4 w-4" />}
                        className="!m-2"
                    >
                        Add Organization
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 !mb-6">
                <StatsCard label="Total Organizations" value={total} color="indigo" icon={<Building2 className="h-4.5 w-4.5" />} percentage={60} />
                <StatsCard label="Active" value={active} color="green" icon={<CheckCircle2 className="h-4.5 w-4.5" />} percentage={78} />
                <StatsCard label="Inactive" value={inactive} color="slate" icon={<MinusCircle className="h-4.5 w-4.5" />} percentage={22} />
            </div>

            <Card variant="default" padding="lg">
                <Toolbar>
                    <Input
                        type="text"
                        placeholder="Search by name, email, or tax number…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="h-4.5 w-4.5 text-slate-400" />}
                        className="sm:max-w-md"
                    />
                </Toolbar>

                {isError ? (
                    <ErrorState
                        title="Failed to load organizations"
                        description={
                            error instanceof Error
                                ? error.message
                                : "An unexpected error occurred while fetching organizations."
                        }
                        onRetry={() => refetch()}
                    />
                ) : organizations?.length === 0 && !isLoading ? (
                    <EmptyState
                        title="No Organizations Found"
                        description="No organizations have been created yet. Add one to get started."
                        action={
                            <Button type="button" onClick={() => setIsCreateOpen(true)} icon={<Plus className="h-4 w-4" />}>
                                Add Organization
                            </Button>
                        }
                        icon={<Building2 className="h-8 w-8 text-slate-400" />}
                    />
                ) : (
                    <OrganizationsTable
                        organizations={filteredOrganizations}
                        isLoading={isLoading}
                        onEdit={(o) => setOrganizationToEdit(o)}
                        onDelete={(o) => setOrganizationToDelete(o)}
                    />
                )}
            </Card>

            <CreateOrganizationDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
            <EditOrganizationDialog
                organization={organizationToEdit}
                isOpen={!!organizationToEdit}
                onClose={() => setOrganizationToEdit(null)}
            />
            <DeleteOrganizationDialog
                organization={organizationToDelete}
                isOpen={!!organizationToDelete}
                onClose={() => setOrganizationToDelete(null)}
            />
        </PageContainer>
    );
}
