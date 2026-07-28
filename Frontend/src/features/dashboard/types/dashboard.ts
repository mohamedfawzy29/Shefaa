export interface DbCounters {
    totalUsers: number;
    totalDoctors: number;
    totalAppointments: number;
    totalOrganizations: number;
}

export interface ChartDataItem {
    label: string;
    value: number;
}

export interface RecentActivity {
    appointmentId: string;
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    status: string;
}
