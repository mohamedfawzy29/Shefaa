import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
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

                {/* ── Protected admin / app routes ── */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/admin/doctors" element={<DoctorsPage />} />
                        <Route path="/organizations" element={<OrganizationsPage />} />
                        <Route path="/branches" element={<BranchesPage />} />
                        <Route path="/patients" element={<PatientsPage />} />
                        <Route path="/receptionists" element={<ReceptionistsPage />} />
                        <Route path="/appointments" element={<AppointmentsPage />} />
                        <Route path="/reviews" element={<ReviewsPage />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/users" element={<UserManagementPage />} />
                        <Route path="/specializations" element={<SpecializationsPage />} />
                    </Route>
                </Route>

                {/* ── Fallback catch-all route ── */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
