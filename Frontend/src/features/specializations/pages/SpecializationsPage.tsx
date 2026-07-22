import { useState, useMemo } from "react";
import PageContainer from "../../../components/layout/PageContainer";
import { EmptyState, ErrorState, Button, StatsCard, Input, SectionHeader, Toolbar, Card } from "../../../components/ui";
import { useSpecializations } from "../hooks/useSpecializations";
import { SpecializationsTable } from "../components/SpecializationsTable";
import { CreateSpecializationDialog } from "../components/dialogs/CreateSpecializationDialog";
import { EditSpecializationDialog } from "../components/dialogs/EditSpecializationDialog";
import { DeleteSpecializationDialog } from "../components/dialogs/DeleteSpecializationDialog";
import type { SpecializationResponse } from "../types/specialization";
import { Search, Activity, ImageIcon, FileText, Plus } from "lucide-react";

export default function SpecializationsPage() {
    const { data: specializations, isLoading, isError, error, refetch } = useSpecializations();

    const [searchQuery, setSearchQuery] = useState("");

    // Dialog targets
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [specializationToEdit, setSpecializationToEdit] = useState<SpecializationResponse | null>(null);
    const [specializationToDelete, setSpecializationToDelete] = useState<SpecializationResponse | null>(null);

    const filteredSpecializations = useMemo(() => {
        const list = specializations ?? [];
        if (!searchQuery.trim()) return list;
        const q = searchQuery.toLowerCase();
        return list.filter(
            (s) =>
                (s.name ?? "").toLowerCase().includes(q) ||
                (s.description ?? "").toLowerCase().includes(q)
        );
    }, [specializations, searchQuery]);

    const total = specializations?.length ?? 0;
    const withIcon = specializations?.filter((s) => !!s.iconImg).length ?? 0;
    const withDescription = specializations?.filter((s) => !!s.description).length ?? 0;

    return (
        <PageContainer noCard={true}>
            <SectionHeader
                title="Specializations"
                subtitle="Manage medical specializations, icons, and descriptions."
                badge={
                    <span className="flex items-center gap-1">
                        <Activity className="h-3.5 w-3.5" />
                        Catalog
                    </span>
                }
                actions={
                    <Button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        icon={<Plus className="h-4 w-4" />}
                        className="!m-2"
                    >
                        Add Specialization
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 !mb-6">
                <StatsCard label="Total" value={total} color="indigo" icon={<Activity className="h-4.5 w-4.5" />} percentage={75} />
                <StatsCard label="With Icon" value={withIcon} color="blue" icon={<ImageIcon className="h-4.5 w-4.5" />} percentage={60} />
                <StatsCard label="With Description" value={withDescription} color="green" icon={<FileText className="h-4.5 w-4.5" />} percentage={80} />
            </div>

            <Card variant="default" padding="lg">
                <Toolbar>
                    <Input
                        type="text"
                        id="specialization-search"
                        placeholder="Search by name or description…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="h-4.5 w-4.5 text-slate-400" />}
                        className="sm:max-w-md"
                    />
                </Toolbar>

                {isError ? (
                    <ErrorState
                        title="Failed to load specializations"
                        description={
                            error instanceof Error
                                ? error.message
                                : "An unexpected error occurred while fetching specializations."
                        }
                        onRetry={() => refetch()}
                    />
                ) : specializations?.length === 0 && !isLoading ? (
                    <EmptyState
                        title="No Specializations Found"
                        description="No specializations have been created yet. Add one to get started."
                        action={
                            <Button type="button" onClick={() => setIsCreateOpen(true)} icon={<Plus className="h-4 w-4" />}>
                                Add Specialization
                            </Button>
                        }
                        icon={<Activity className="h-8 w-8 text-slate-400" />}
                    />
                ) : (
                    <SpecializationsTable
                        specializations={filteredSpecializations}
                        isLoading={isLoading}
                        onEdit={(s) => setSpecializationToEdit(s)}
                        onDelete={(s) => setSpecializationToDelete(s)}
                    />
                )}
            </Card>

            <CreateSpecializationDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
            <EditSpecializationDialog
                specialization={specializationToEdit}
                isOpen={!!specializationToEdit}
                onClose={() => setSpecializationToEdit(null)}
            />
            <DeleteSpecializationDialog
                specialization={specializationToDelete}
                isOpen={!!specializationToDelete}
                onClose={() => setSpecializationToDelete(null)}
            />
        </PageContainer>
    );
}
