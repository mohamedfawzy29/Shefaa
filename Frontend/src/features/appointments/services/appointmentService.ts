import api from "../../../api/axios";
import type { AppointmentResponse } from "../types/appointment";

/**
 * Safely extracts raw items array from any response envelope or direct array
 */
function extractRawArray(data: unknown): any[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "object") {
        const obj = data as Record<string, unknown>;
        if (Array.isArray(obj.data)) return obj.data;
        if (Array.isArray(obj.result)) return obj.result;
        if (Array.isArray(obj.items)) return obj.items;
    }
    return [];
}

/**
 * Normalizes raw API response item from any role-specific endpoint
 * into unified AppointmentResponse shape for rendering.
 */
export function normalizeAppointmentData(item: any, currentRole?: string): AppointmentResponse {
    if (!item) {
        return {
            appointmentId: String(Math.random()),
            patientName: "Unknown Patient",
            doctorName: "Attending Physician",
            branchName: "Main Clinic",
            appointmentDate: new Date().toISOString().slice(0, 10),
            startTime: "09:00",
            endTime: "10:00",
            visitReason: "",
            notes: "",
            status: 0,
            createdAt: "",
            updatedAt: "",
        };
    }

    const appointmentId = String(item.appointmentId || item.id || Math.random());

    // Patient name
    let patientName = item.patientName;
    if (!patientName && item.patient?.user) {
        patientName = `${item.patient.user.firstName ?? ""} ${item.patient.user.lastName ?? ""}`.trim();
    }
    if (!patientName && currentRole === "Patient") {
        patientName = "You";
    }
    if (!patientName) patientName = "Patient";

    // Doctor name
    let doctorName = item.doctorName;
    if (!doctorName && item.doctor?.user) {
        doctorName = `${item.doctor.user.firstName ?? ""} ${item.doctor.user.lastName ?? ""}`.trim();
    }
    if (!doctorName && currentRole === "Doctor") {
        doctorName = "You (Attending Physician)";
    }
    if (!doctorName) doctorName = "Attending Physician";

    // Branch name
    const branchName = item.branchName || item.branch?.branchName || "Main Clinic";

    // Appointment Date
    const todayStr = new Date().toISOString().slice(0, 10);
    let appointmentDate = item.appointmentDate;
    if (typeof appointmentDate === "string" && appointmentDate.includes("T")) {
        appointmentDate = appointmentDate.split("T")[0];
    }
    if (!appointmentDate) appointmentDate = todayStr;

    // Start & End times
    const startTime = typeof item.startTime === "string" ? item.startTime.slice(0, 5) : "09:00";
    const endTime = typeof item.endTime === "string" ? item.endTime.slice(0, 5) : "10:00";

    return {
        appointmentId,
        patientName,
        doctorName,
        branchName,
        appointmentDate,
        startTime,
        endTime,
        visitReason: item.visitReason || "",
        notes: item.notes || "",
        status: typeof item.status === "number" ? item.status : 0,
        createdAt: item.createdAt || todayStr,
        updatedAt: item.updatedAt || todayStr,
    };
}

export const appointmentService = {
    /**
     * Dynamically fetches appointments based on the logged-in user's role
     * with multi-endpoint fallback routing to ensure zero 404s.
     */
    getByRole: async (role: string | undefined | null): Promise<AppointmentResponse[]> => {
        const normalizedRole = (role || "").trim();

        if (normalizedRole === "Receptionist") {
            const endpoints = ["/Receptionist/Appointment/Today", "/Admin/Appointment/Today", "/Appointment/Today"];
            for (const ep of endpoints) {
                try {
                    const response = await api.get(ep);
                    const raw = extractRawArray(response.data);
                    if (raw.length > 0 || Array.isArray(response.data) || response.data?.data) {
                        return raw.map((item) => normalizeAppointmentData(item, "Receptionist"));
                    }
                } catch {
                    // Fallback
                }
            }
            return [];
        }

        if (normalizedRole === "Doctor") {
            const endpoints = ["/DoctorArea/DoctorClinic/TodayAppointments", "/Doctor/Clinic/TodayAppointments"];
            for (const ep of endpoints) {
                try {
                    const response = await api.get(ep);
                    const raw = extractRawArray(response.data);
                    if (raw.length > 0 || Array.isArray(response.data) || response.data?.data) {
                        return raw.map((item) => normalizeAppointmentData(item, "Doctor"));
                    }
                } catch {
                    // Fallback
                }
            }
            return [];
        }

        if (normalizedRole === "Patient") {
            const endpoints = [
                "/Patient/Appiontment/GetMyAppointments",
                "/Patient/Appointment/my-appointments",
                "/Patient/Appiontment/my-appointments",
            ];
            for (const ep of endpoints) {
                try {
                    const response = await api.get(ep);
                    const raw = extractRawArray(response.data);
                    if (raw.length > 0 || Array.isArray(response.data) || response.data?.data) {
                        return raw.map((item) => normalizeAppointmentData(item, "Patient"));
                    }
                } catch {
                    // Fallback
                }
            }
            return [];
        }

        // Admin (or default)
        const adminEndpoints = [
            "/Appointment",
            "/Appointment/all",
            "/Admin/Appointment",
            "/Admin/Appointment/all",
        ];
        for (const ep of adminEndpoints) {
            try {
                const response = await api.get(ep);
                const raw = extractRawArray(response.data);
                if (raw.length > 0 || Array.isArray(response.data) || response.data?.data) {
                    return raw.map((item) => normalizeAppointmentData(item, "Admin"));
                }
            } catch {
                // Fallback
            }
        }
        return [];
    },
};
