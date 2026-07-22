import { useState, useMemo } from "react";
import PageContainer from "../../../components/layout/PageContainer";
import { EmptyState, ErrorState, Button, StatsCard, Input, SectionHeader, Toolbar, Card } from "../../../components/ui";
import { useReceptionists, useChangeReceptionistStatus } from "../hooks/useReceptionists";
import { ReceptionistsTable } from "../components/ReceptionistsTable";
import { CreateReceptionistDialog } from "../components/dialogs/CreateReceptionistDialog";
import { Search, Contact, CheckCircle, Clock, Plus } from "lucide-react";

export default function ReceptionistsPage() {
    const { data: receptionists, isLoading, isError, error, refetch } = useReceptionists();
    const statusMutation = useChangeReceptionistStatus();

    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const filteredReceptionists = useMemo(() => {
        const list = receptionists ?? [];
        if (!searchQuery.trim()) return list;
        const q = searchQuery.toLowerCase();
        return list.filter(
            (r) =>
                (r.firstName + " " + r.lastName).toLowerCase().includes(q) ||
                (r.email ?? "").toLowerCase().includes(q) ||
                (r.branchName ?? "").toLowerCase().includes(q)
        );
    }, [receptionists, searchQuery]);

    const handleStatusChange = (id: string, action: "approve" | "reject" | "suspend" | "activate") => {
        statusMutation.mutate({ id, action }, {
            onError: (err) => alert(err instanceof Error ? err.message : "Failed to change status"),
        });
    };

    const total = receptionists?.length ?? 0;
    const pending = receptionists?.filter((r) => r.status === 0).length ?? 0;
    const approved = receptionists?.filter((r) => r.status === 1).length ?? 0;

    return (
        <PageContainer noCard={true}>
            <SectionHeader
                title="Receptionists"
                subtitle="Manage receptionists, their branches, and statuses."
                badge={
                    <span className="flex items-center gap-1">
                        <Contact className="h-3.5 w-3.5" />
                        Staff
                    </span>
                }
                actions={
                    <Button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        icon={<Plus className="h-4 w-4" />}
                        className="!m-2"
                    >
                        Add Receptionist
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 !mb-6">
                <StatsCard label="Total" value={total} color="indigo" icon={<Contact className="h-4.5 w-4.5" />} percentage={72} />
                <StatsCard label="Approved" value={approved} color="green" icon={<CheckCircle className="h-4.5 w-4.5" />} percentage={85} />
                <StatsCard label="Pending Review" value={pending} color="amber" icon={<Clock className="h-4.5 w-4.5" />} percentage={15} />
            </div>

            <Card variant="default" padding="lg">
                <Toolbar>
                    <Input
                        type="text"
                        placeholder="Search by name, email, or branch…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="h-4.5 w-4.5 text-slate-400" />}
                        className="sm:max-w-md"
                    />
                </Toolbar>

                {isError ? (
                    <ErrorState
                        title="Failed to load receptionists"
                        description={
                            error instanceof Error
                                ? error.message
                                : "An unexpected error occurred while fetching receptionists."
                        }
                        onRetry={() => refetch()}
                    />
                ) : receptionists?.length === 0 && !isLoading ? (
                    <EmptyState
                        title="No Receptionists Found"
                        description="No receptionists have been created yet. Add one to get started."
                        action={
                            <Button type="button" onClick={() => setIsCreateOpen(true)} icon={<Plus className="h-4 w-4" />}>
                                Add Receptionist
                            </Button>
                        }
                        icon={<Contact className="h-8 w-8 text-slate-400" />}
                    />
                ) : (
                    <ReceptionistsTable
                        receptionists={filteredReceptionists}
                        isLoading={isLoading || statusMutation.isPending}
                        onStatusChange={handleStatusChange}
                    />
                )}
            </Card>

            <CreateReceptionistDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
        </PageContainer>
    );
}
