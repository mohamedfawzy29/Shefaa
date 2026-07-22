import PageContainer from "../../components/layout/PageContainer";

export default function AppointmentsPage() {
    return (
        <PageContainer title="Appointments" description="Schedule and coordinate clinical visits.">
            <div className="space-y-4">
                <p className="text-slate-600">Track upcoming bookings, update consultation status, and reschedule patient appointments.</p>
            </div>
        </PageContainer>
    );
}
