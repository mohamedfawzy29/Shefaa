import PageContainer from "../../components/layout/PageContainer";

export default function BranchesPage() {
    return (
        <PageContainer title="Branches" description="View and manage branch locations.">
            <div className="space-y-4">
                <p className="text-slate-600">Configure medical branches, view contact information, and assign staff members.</p>
            </div>
        </PageContainer>
    );
}
