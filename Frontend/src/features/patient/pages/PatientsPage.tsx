import { useState, useMemo } from "react";
import PageContainer from "../../../components/layout/PageContainer";
import { EmptyState, ErrorState, StatsCard, Input, SectionHeader, Toolbar, Card } from "../../../components/ui";
import { usePatients } from "../hooks/usePatients";
import { PatientsTable } from "../components/PatientsTable";
import { Search, Users, UserCheck, ShieldAlert } from "lucide-react";

export default function PatientsPage() {
    const { data: patients, isLoading, isError, error, refetch } = usePatients();

    const [searchQuery, setSearchQuery] = useState("");

    const filteredPatients = useMemo(() => {
        const list = patients ?? [];
        if (!searchQuery.trim()) return list;
        const q = searchQuery.toLowerCase();
        return list.filter(
            (p) =>
                (p.firstName + " " + p.lastName).toLowerCase().includes(q) ||
                (p.email ?? "").toLowerCase().includes(q) ||
                (p.nationalId ?? "").toLowerCase().includes(q)
        );
    }, [patients, searchQuery]);

    const total = patients?.length ?? 0;
    const active = patients?.filter((p) => p.isActive).length ?? 0;
    const locked = patients?.filter((p) => p.isLockedOut).length ?? 0;

    return (
        <PageContainer noCard={true}>
            <SectionHeader
                title="Patients"
                subtitle="View and manage patient records and account status."
                badge={
                    <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        Records
                    </span>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 !mb-6">
                <StatsCard label="Total Patients" value={total} color="indigo" icon={<Users className="h-4.5 w-4.5" />} percentage={70} />
                <StatsCard label="Active" value={active} color="green" icon={<UserCheck className="h-4.5 w-4.5" />} percentage={88} />
                <StatsCard label="Locked" value={locked} color="red" icon={<ShieldAlert className="h-4.5 w-4.5" />} percentage={12} />
            </div>

            <Card variant="default" padding="lg">
                <Toolbar>
                    <Input
                        type="text"
                        placeholder="Search by name, email, or national ID…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="h-4.5 w-4.5 text-slate-400" />}
                        className="sm:max-w-md"
                    />
                </Toolbar>

                {isError ? (
                    <ErrorState
                        title="Failed to load patients"
                        description={
                            error instanceof Error
                                ? error.message
                                : "An unexpected error occurred while fetching patients."
                        }
                        onRetry={() => refetch()}
                    />
                ) : patients?.length === 0 && !isLoading ? (
                    <EmptyState
                        title="No Patients Found"
                        description="No patient records found in the system."
                        icon={<Users className="h-8 w-8 text-slate-400" />}
                    />
                ) : (
                    <PatientsTable patients={filteredPatients} isLoading={isLoading} />
                )}
            </Card>
        </PageContainer>
    );
}
