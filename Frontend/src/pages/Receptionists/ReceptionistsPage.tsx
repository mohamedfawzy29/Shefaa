import PageContainer from "../../components/layout/PageContainer";

export default function ReceptionistsPage() {
    return (
        <PageContainer title="Receptionists" description="Manage front-desk staff directory.">
            <div className="space-y-4">
                <p className="text-slate-600">Register new receptionists, configure shift details, and assign branch access rights.</p>
            </div>
        </PageContainer>
    );
}
