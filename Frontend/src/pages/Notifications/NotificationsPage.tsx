import PageContainer from "../../components/layout/PageContainer";

export default function NotificationsPage() {
    return (
        <PageContainer title="Notifications" description="View system and patient alerts.">
            <div className="space-y-4">
                <p className="text-slate-600">Review message history, alert triggers, and communication reminders.</p>
            </div>
        </PageContainer>
    );
}
