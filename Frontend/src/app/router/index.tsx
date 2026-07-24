import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RoleBasedLayout from "../../components/layout/RoleBasedLayout";
import PublicLayout from "../../components/layout/PublicLayout";
import ProtectedRoute from "../../components/common/ProtectedRoute";

// Auth pages
import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage";
import VerifyOTPPage from "../../features/auth/pages/VerifyOTPPage";
import ResetPasswordPage from "../../features/auth/pages/ResetPasswordPage";
import ConfirmEmailPage from "../../features/auth/pages/ConfirmEmailPage";
import ResendEmailConfirmationPage from "../../features/auth/pages/ResendEmailConfirmationPage";

// Public pages
import HomePage from "../../pages/public/HomePage";
import PublicDoctorsPage from "../../pages/public/PublicDoctorsPage";
import PublicDoctorDetailPage from "../../pages/public/PublicDoctorDetailPage";
import AboutPage from "../../pages/public/AboutPage";
import ContactPage from "../../pages/public/ContactPage";

// Admin / app pages
import DashboardPage from "../../pages/Dashboard/DashboardPage";
import OrganizationsPage from "../../features/organizations/pages/OrganizationsPage";
import BranchesPage from "../../features/branches/pages/BranchesPage";
import DoctorsPage from "../../features/doctors/pages/DoctorsPage";
import PatientsPage from "../../features/patient/pages/PatientsPage";
import ReceptionistsPage from "../../features/receptionist/pages/ReceptionistsPage";
import AppointmentsPage from "../../features/appointments/pages/AppointmentsPage";
import ReviewsPage from "../../features/reviews/pages/ReviewsPage";
import NotificationsPage from "../../pages/Notifications/NotificationsPage";
import SettingsPage from "../../pages/Settings/SettingsPage";
import ProfilePage from "../../pages/Profile/ProfilePage";
import UserManagementPage from "../../features/user-management/pages/UserManagementPage";
import SpecializationsPage from "../../features/specializations/pages/SpecializationsPage";
import DoctorClinicPage from "../../features/doctor-clinic/pages/DoctorClinicPage";
import DoctorPracticePage from "../../features/doctor-clinic/pages/DoctorPracticePage";
import ReceptionistDeskPage from "../../features/receptionist/pages/ReceptionistDeskPage";
import PatientAppointmentsPage from "../../features/patient-appointments/pages/PatientAppointmentsPage";
import PatientDoctorsPage from "../../features/patient-appointments/pages/PatientDoctorsPage";
import PatientMedicalHistoryPage from "../../features/patient-medical/pages/PatientMedicalHistoryPage";
import { useAuth } from "../../features/auth/hooks/useAuth";

function DashboardRoute() {
    const { currentUser } = useAuth();
    if (currentUser?.role === "Doctor") {
        return <DoctorPracticePage />;
    }
    if (currentUser?.role === "Receptionist") {
        return <ReceptionistDeskPage />;
    }
    return <DashboardPage />;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ── Public patient area ── */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/doctors" element={<PublicDoctorsPage />} />
                    <Route path="/doctors/:id" element={<PublicDoctorDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Route>

                {/* ── Public auth routes ── */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-otp" element={<VerifyOTPPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/confirm-email" element={<ConfirmEmailPage />} />
                <Route path="/resend-email-confirmation" element={<ResendEmailConfirmationPage />} />

                {/* ── Protected routes ── */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<RoleBasedLayout />}>
                        {/* Admin only */}
                        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                            <Route path="/organizations" element={<OrganizationsPage />} />
                            <Route path="/branches" element={<BranchesPage />} />
                            <Route path="/specializations" element={<SpecializationsPage />} />
                            <Route path="/receptionists" element={<ReceptionistsPage />} />
                            <Route path="/users" element={<UserManagementPage />} />
                            <Route path="/reviews" element={<ReviewsPage />} />
                            <Route path="/admin/doctors" element={<DoctorsPage />} />
                        </Route>

                        {/* Doctor only */}
                        <Route element={<ProtectedRoute allowedRoles={["Doctor"]} />}>
                            <Route path="/doctor/clinic" element={<DoctorClinicPage />} />
                        </Route>

                        {/* Patient only */}
                        <Route element={<ProtectedRoute allowedRoles={["Patient"]} />}>
                            <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />
                            <Route path="/patient/doctors" element={<PatientDoctorsPage />} />
                            <Route path="/patient/medical-history" element={<PatientMedicalHistoryPage />} />
                        </Route>

                        {/* Staff dashboard & settings (Admin, Doctor, Receptionist) */}
                        <Route element={<ProtectedRoute allowedRoles={["Admin", "Doctor", "Receptionist"]} />}>
                            <Route path="/dashboard" element={<DashboardRoute />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Route>

                        {/* Admin & Doctor */}
                        <Route element={<ProtectedRoute allowedRoles={["Admin", "Doctor"]} />}>
                            <Route path="/appointments" element={<AppointmentsPage />} />
                            <Route path="/patients" element={<PatientsPage />} />
                        </Route>

                        {/* Receptionist specific */}
                        <Route element={<ProtectedRoute allowedRoles={["Receptionist"]} />}>
                            <Route path="/receptionist/desk" element={<ReceptionistDeskPage />} />
                        </Route>

                        {/* All authenticated roles (Admin, Doctor, Receptionist, Patient) */}
                        <Route element={<ProtectedRoute allowedRoles={["Admin", "Doctor", "Receptionist", "Patient"]} />}>
                            <Route path="/notifications" element={<NotificationsPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                        </Route>
                    </Route>
                </Route>

                {/* ── Fallback catch-all route ── */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

