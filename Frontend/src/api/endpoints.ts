/**
 * Central registry of all backend API endpoints grouped by Area and Controller.
 *
 * All endpoints match backend [Area] and [Route] attributes verbatim.
 */
export const API_ENDPOINTS = {
    // ── Auth / Identity ────────────────────────────────────────────────────────
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

    // ── Profile ────────────────────────────────────────────────────────────────
    PROFILE: {
        BASE: "/Identity/Profile",
        PASSWORD: "/Identity/Profile/Password",
        IMAGE: "/Identity/Profile/ProfileImage",
    },

    // ── Admin Area Controllers ───────────────────────────────────────────────
    ADMIN: {
        USER_MANAGEMENT: {
            BASE: "/Admin/UserManagement",
            ASSIGN_ROLES: "/Admin/UserManagement/AssignRoles",
            LOCK_USER: (id: string) => `/Admin/UserManagement/LockUser/${id}`,
            UNLOCK_USER: (id: string) => `/Admin/UserManagement/UnlockUser/${id}`,
        },
        SPECIALIZATIONS: {
            BASE: "/Admin/Specializations",
            FALLBACK: "/Specializations",
        },
        BRANCHES: {
            BASE: "/Admin/Branches",
            FALLBACK: "/Branches",
        },
        ORGANIZATIONS: {
            BASE: "/Admin/Organizations",
            FALLBACK: "/Organizations",
        },
        DOCTORS: {
            BASE: "/Admin/Doctor",
            FALLBACK: "/Doctor",
        },
        PATIENTS: {
            BASE: "/Admin/Patient",
            FALLBACK: "/Patient",
        },
        RECEPTIONISTS: {
            BASE: "/Admin/Receptionist",
            FALLBACK: "/Receptionist",
        },
        APPOINTMENTS: {
            BASE: "/Admin/Appointment",
            FALLBACK: "/Appointment",
        },
        REVIEWS: {
            BASE: "/Admin/Review",
            FALLBACK: "/Review",
        },
        DASHBOARD: {
            BASE: "/Admin/Dashboard",
            COUNTERS: "/Admin/Dashboard/counters",
            APPOINTMENT_CHART: "/Admin/Dashboard/appointment-chart",
            TOP_SPECIALIZATIONS_CHART: "/Admin/Dashboard/top-specializations-chart",
            RECENT_ACTIVITIES: "/Admin/Dashboard/recent-activities",
        },
    },

    // ── DoctorArea Area Controllers ───────────────────────────────────────────
    DOCTOR_CLINIC: {
        BASE: "/Doctor/DoctorClinic",
        MY_BRANCHES: "/Doctor/DoctorClinic/MyBranches",
        JOIN_BRANCH: "/Doctor/DoctorClinic/JoinBranch",
        ADD_SCHEDULE: "/Doctor/DoctorClinic/AddSchedule",
        MY_SCHEDULES: "/Doctor/DoctorClinic/MySchedules",
        TODAY_APPOINTMENTS: "/Doctor/DoctorClinic/TodayAppointments",
    },
    DOCTOR_MEDICAL: {
        BASE: "/Doctor/DoctorMedical",
        CREATE_PRESCRIPTION: "/Doctor/DoctorMedical/CreatePrescription",
        BY_APPOINTMENT: (id: string) => `/Doctor/DoctorMedical/ByAppointment/${id}`,
    },

    // ── Patient Area Controllers ─────────────────────────────────────────────
    PATIENT_APPOINTMENTS: {
        BASE: "/Patient/Appointment",
        BOOK: "/Patient/Appointment/book",
        MY_APPOINTMENTS: "/Patient/Appointment/my-appointments",
        CANCEL_APPOINTMENT: (id: string) => `/Patient/Appointment/cancel/${id}`,
        RESCHEDULE_APPOINTMENT: (id: string) => `/Patient/Appointment/reschedule/${id}`,
    },
    PATIENT_DOCTORS: {
        BASE: "/Patient/Doctor",
    },
    PATIENT_MEDICAL: {
        BASE: "/Patient/MedicalRecord",
        MY_HISTORY: "/Patient/MedicalRecord/myhistory",
        BY_APPOINTMENT: (id: string) => `/Patient/MedicalRecord/byappointment/${id}`,
    },
    PATIENT_REVIEWS: {
        BASE: "/Patient/Reviews",
        ADD: "/Patient/Reviews/add",
        MY_REVIEWS: "/Patient/Reviews/myreviews",
        UPDATE: (id: string) => `/Patient/Reviews/update/${id}`,
        DELETE: (id: string) => `/Patient/Reviews/delete/${id}`,
        BY_DOCTOR: (id: string) => `/Patient/Reviews/doctor/${id}`,
    },

    // ── Receptionist Area Controllers ─────────────────────────────────────────
    RECEPTIONIST_APPOINTMENTS: {
        BASE: "/Receptionist/Appointment",
        TODAY: "/Receptionist/Appointment/Today",
        CHECK_IN: (id: string) => `/Receptionist/Appointment/${id}/CheckIn`,
        NO_SHOW: (id: string) => `/Receptionist/Appointment/${id}/NoShow`,
    },

    // Legacy fallbacks for compatibility
    USER_MANAGEMENT: { BASE: "/Admin/UserManagement" },
    SPECIALIZATIONS: { BASE: "/Admin/Specializations" },
    BRANCHES: { BASE: "/Admin/Branches" },
    DASHBOARD: { BASE: "/Admin/Dashboard", COUNTERS: "/Admin/Dashboard/counters", APPOINTMENT_CHART: "/Admin/Dashboard/appointment-chart", TOP_SPECIALIZATIONS_CHART: "/Admin/Dashboard/top-specializations-chart" },
    ORGANIZATIONS: { BASE: "/Admin/Organizations" },
    DOCTORS: { BASE: "/Doctor" },
    PATIENTS: { BASE: "/Patient" },
    RECEPTIONISTS: { BASE: "/Receptionist" },
    REVIEWS: { BASE: "/Review" },
    APPOINTMENTS: { BASE: "/Appointment" },
} as const;

export type UserRole = "Admin" | "Doctor" | "Patient" | "Receptionist";
