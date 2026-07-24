export interface MenuItem {
    title: string;
    path: string;
    iconName: string;
}

export const roleMenus: Record<string, MenuItem[]> = {
    Admin: [
        { title: "Dashboard", path: "/dashboard", iconName: "dashboard" },
        { title: "Organizations", path: "/organizations", iconName: "organizations" },
        { title: "Branches", path: "/branches", iconName: "branches" },
        { title: "Specializations", path: "/specializations", iconName: "specializations" },
        { title: "Doctors", path: "/admin/doctors", iconName: "doctors" },
        { title: "Patients", path: "/patients", iconName: "patients" },
        { title: "Receptionists", path: "/receptionists", iconName: "receptionists" },
        { title: "User Management", path: "/users", iconName: "users" },
        { title: "Appointments", path: "/appointments", iconName: "appointments" },
        { title: "Reviews", path: "/reviews", iconName: "reviews" },
        { title: "Notifications", path: "/notifications", iconName: "notifications" },
        { title: "Settings", path: "/settings", iconName: "settings" },
        { title: "Profile", path: "/profile", iconName: "profile" },
    ],
    Doctor: [
        { title: "Dashboard", path: "/dashboard", iconName: "dashboard" },
        { title: "My Clinic", path: "/doctor/clinic", iconName: "branches" },
        { title: "Appointments", path: "/appointments", iconName: "appointments" },
        { title: "Patients", path: "/patients", iconName: "patients" },
        { title: "Notifications", path: "/notifications", iconName: "notifications" },
        { title: "Settings", path: "/settings", iconName: "settings" },
        { title: "Profile", path: "/profile", iconName: "profile" },
    ],
    Receptionist: [
        { title: "Desk & Queue", path: "/receptionist/desk", iconName: "appointments" },
        { title: "Notifications", path: "/notifications", iconName: "notifications" },
        { title: "Settings", path: "/settings", iconName: "settings" },
        { title: "Profile", path: "/profile", iconName: "profile" },
    ],
    Patient: [
        { title: "Find Doctors", path: "/patient/doctors", iconName: "doctors" },
        { title: "My Appointments", path: "/patient/appointments", iconName: "appointments" },
        { title: "Medical History", path: "/patient/medical-history", iconName: "specializations" },
        { title: "Profile", path: "/profile", iconName: "profile" },
    ],
};

