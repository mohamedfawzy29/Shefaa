import PageContainer from "../../components/layout/PageContainer";

export default function PatientsPage() {
    return (
        <PageContainer title="Patients" description="View and manage patient medical records.">
            <div className="space-y-4">
                <p className="text-slate-600">Register new patients, view history logs, and manage primary health documents.</p>
            </div>
        </PageContainer>
    );
}
