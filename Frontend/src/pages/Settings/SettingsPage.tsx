import PageContainer from "../../components/layout/PageContainer";

export default function SettingsPage() {
    return (
        <PageContainer title="Settings" description="System configuration and general setup.">
            <div className="space-y-4">
                <p className="text-slate-600">Configure application defaults, notification channels, and security settings.</p>
            </div>
        </PageContainer>
    );
}
