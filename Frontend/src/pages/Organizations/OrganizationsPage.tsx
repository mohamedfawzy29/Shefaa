import PageContainer from "../../components/layout/PageContainer";

export default function OrganizationsPage() {
    return (
        <PageContainer title="Organizations" description="Manage clinic organizations and corporate accounts.">
            <div className="space-y-4">
                <p className="text-slate-600">List and configuration panel for all registered organizations under the medical system.</p>
            </div>
        </PageContainer>
    );
}
