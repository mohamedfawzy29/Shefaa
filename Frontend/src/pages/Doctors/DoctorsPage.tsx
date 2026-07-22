import PageContainer from "../../components/layout/PageContainer";

export default function DoctorsPage() {
    return (
        <PageContainer title="Doctors" description="Manage doctors registry and schedules.">
            <div className="space-y-4">
                <p className="text-slate-600">List of registered medical practitioners, active specializations, and availability profiles.</p>
            </div>
        </PageContainer>
    );
}
