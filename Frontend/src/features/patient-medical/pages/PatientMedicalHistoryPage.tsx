import { useState } from "react";
import { usePatientMedicalHistory } from "../hooks/usePatientMedicalHistory";
import { PrescriptionModal } from "../components/PrescriptionModal";
import { Avatar } from "../../../components/ui/Avatar";
import { getProfileImageUrl } from "../../../utils/imageUrl";
import { FileText, Calendar, Stethoscope, CalendarClock, Activity, Printer } from "lucide-react";
import type { MedicalRecordResponse } from "../types/patientMedical";

export default function PatientMedicalHistoryPage() {
    const { data: records = [], isLoading, isError } = usePatientMedicalHistory();
    const [printRecord, setPrintRecord] = useState<MedicalRecordResponse | null>(null);

    return (
        <div className="max-w-5x2 mx-auto !p-6 space-y-8">
            {/* Prescription Print Modal */}
            <PrescriptionModal record={printRecord} onClose={() => setPrintRecord(null)} />

            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-3xl !p-8 text-white shadow-xl space-y-2 !mb-5">
                <div className="inline-flex items-center gap-2 !px-3 !py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-cyan-200">
                    <Activity className="h-3.5 w-3.5" />
                    Personal Health Record
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">My Medical History</h1>
                <p className="text-cyan-100 text-sm max-w-xl leading-relaxed">
                    View your diagnosis, prescriptions, and treatment plans from past doctor visits.
                </p>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
                    <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
                </div>
            ) : isError ? (
                <div className="!p-8 rounded-3xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 text-center space-y-2">
                    <p className="text-base font-bold text-rose-700 dark:text-rose-300">Unable to load medical records</p>
                    <p className="text-xs text-rose-600 dark:text-rose-400">Please try refreshing the page later.</p>
                </div>
            ) : records.length === 0 ? (
                <div className="!py-16 text-center space-y-3 bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800">
                    <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-base font-bold text-slate-700 dark:text-slate-300">No Medical Records Found</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">When your doctor completes a consultation and writes a prescription, it will appear here.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {records.map((rec) => {
                        const doctorUser = rec.doctor?.user;
                        const doctorName = doctorUser ? `Dr. ${doctorUser.firstName} ${doctorUser.lastName}` : "Doctor";
                        const doctorImg = getProfileImageUrl(doctorUser?.profileImg);

                        return (
                            <div
                                key={rec.id}
                                className="bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden !my-5"
                            >
                                <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600" />
                                <div className="!p-6 space-y-6">
                                    {/* Header info */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 !pb-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar src={doctorImg} name={doctorName} size="md" />
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{doctorName}</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Calendar className="h-3.5 w-3.5 text-cyan-500" />
                                                    Visit Date: <span className="font-semibold text-slate-700 dark:text-slate-300">{rec.appointment.appointmentDate}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            {rec.followUpDate && (
                                                <span className="inline-flex items-center gap-1.5 !px-3 !py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold">
                                                    <CalendarClock className="h-3.5 w-3.5 text-amber-600" />
                                                    Follow-Up: {rec.followUpDate}
                                                </span>
                                            )}
                                            <button
                                                onClick={() => setPrintRecord(rec)}
                                                className="inline-flex items-center gap-1.5 !px-3 !py-1.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-bold hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors cursor-pointer"
                                            >
                                                <Printer className="h-3.5 w-3.5" />
                                                View & Print
                                            </button>
                                        </div>
                                    </div>

                                    {/* Medical Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Chief Complaint</span>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 !p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                {rec.chiefComplaint}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Diagnosis</span>
                                            <p className="text-sm font-semibold text-cyan-900 dark:text-cyan-200 bg-cyan-50/60 dark:bg-cyan-950/30 !p-3 rounded-2xl border border-cyan-100 dark:border-cyan-900/40">
                                                {rec.diagnosis}
                                            </p>
                                        </div>

                                        <div className="space-y-1 md:col-span-1">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Treatment & Prescription</span>
                                            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/30 !p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 whitespace-pre-line">
                                                {rec.treatmentPlan}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Doctor Notes if present */}
                                    {rec.doctorNotes && (
                                        <div className="!pt-2">
                                            <div className="!p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                                                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                                    <Stethoscope className="h-3.5 w-3.5 text-blue-500" /> Doctor's Additional Notes
                                                </span>
                                                <p className="leading-relaxed">{rec.doctorNotes}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
