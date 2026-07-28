import { useAuth } from "../../features/auth/hooks/useAuth";
import PublicLayout from "./PublicLayout";
import MainLayout from "./MainLayout";

/**
 * Layout switcher that renders:
 * - PublicLayout (with PublicNavbar & PublicFooter) for Patients
 * - MainLayout (with Sidebar & App Navbar) for Admin, Doctor, and Receptionist
 */
export default function RoleBasedLayout() {
    const { currentUser } = useAuth();

    if (currentUser?.role === "Patient") {
        return <PublicLayout />;
    }

    return <MainLayout />;
}
