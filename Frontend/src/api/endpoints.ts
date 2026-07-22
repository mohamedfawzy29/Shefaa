/**
 * Central registry of all backend API endpoints.
 *
 * Lives in src/api/ because endpoints are a concern of the API layer —
 * they describe the backend surface, not generic application constants.
 *
 * Rules:
 *  - Group by feature area (AUTH, PATIENT, DOCTOR, …).
 *  - Never construct dynamic path segments here — do that at the call site.
 *  - The baseURL prefix (/api) is handled by the Axios instance.
 *
 * IMPORTANT — path derivation from actual backend [Route] attributes:
 *
 *  Controllers with [Route("api/[area]/[controller]")]
 *    → path = /Admin/{ControllerName}
 *    → UserManagement, Specializations, Branches
 *
 *  Controllers with [Route("api/[controller]")]
 *    → path = /{ControllerName}   (no /Admin prefix)
 *    → Organizations, Doctor, Patient, Receptionist, Review, Appointment
 */
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/Identity/Account/Login",
        REGISTER_PATIENT: "/Identity/Account/RegisterPatient",
        REGISTER_DOCTOR: "/Identity/Account/RegisterDoctor",
        REGISTER_RECEPTIONIST: "/Identity/Account/RegisterReceptionist",
        CONFIRM_EMAIL: "/Identity/Account/ConfirmEmail",
        RESEND_EMAIL_CONFIRMATION: "/Identity/Account/ResendEmailConfirmation",
        FORGOT_PASSWORD: "/Identity/Account/ForgetPassword",
        VERIFY_OTP: "/Identity/Account/VerifyOTP",
        RESET_PASSWORD: "/Identity/Account/ResetPassword",
    },

    /* ── [Route("api/[area]/[controller]")] controllers ── */
    USER_MANAGEMENT: {
        BASE: "/Admin/UserManagement",
        ASSIGN_ROLES: "/Admin/UserManagement/AssignRoles",
    },
    SPECIALIZATIONS: {
        BASE: "/Admin/Specializations",
    },
    BRANCHES: {
        BASE: "/Admin/Branches",
    },
    DASHBOARD: {
        BASE: "/ Admin/Dashboard",
        COUNTERS: "/ Admin/Dashboard/counters",
        APPOINTMENT_CHART: "/ Admin/Dashboard/appointment chart",
        TOP_SPECIALIZATIONS_CHART: "/ Admin/Dashboard/top-specializations-chart",
    },
    PROFILE: {
        BASE: "/Identity/Profile",
        PASSWORD: "/Identity/Profile/Password",
        IMAGE: "/Identity/Profile/ProfileImage",
    },

    /* ── [Route("api/[controller]")] controllers ── */
    ORGANIZATIONS: {
        BASE: "/Organizations",
    },
    DOCTORS: {
        BASE: "/Doctor",
    },
    PATIENTS: {
        BASE: "/Patient",
    },
    RECEPTIONISTS: {
        BASE: "/Receptionist",
    },
    REVIEWS: {
        BASE: "/Review",
    },
    APPOINTMENTS: {
        BASE: "/Appointment",
    },
} as const;
