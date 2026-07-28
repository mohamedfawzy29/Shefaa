import { useRef } from "react";
import {
    X, Printer, FileText, Calendar, Stethoscope,
    CalendarClock, ClipboardList, Pill, BookOpen, User,
} from "lucide-react";
import type { MedicalRecordResponse } from "../types/patientMedical";

interface PrescriptionModalProps {
    record: MedicalRecordResponse | null;
    onClose: () => void;
}

export function PrescriptionModal({ record, onClose }: PrescriptionModalProps) {
    const printRef = useRef<HTMLDivElement>(null);

    if (!record) return null;

    const doctorUser = record.doctor?.user;
    const doctorName = doctorUser
        ? `Dr. ${doctorUser.firstName} ${doctorUser.lastName}`
        : "Attending Physician";

    function handlePrint() {
        const content = printRef.current;
        if (!content) return;

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Prescription – ${doctorName} – ${record.appointment.appointmentDate}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: "Segoe UI", Arial, sans-serif; color: #1e293b; background: #fff; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0891b2; padding-bottom: 16px; margin-bottom: 24px; }
    .clinic-name { font-size: 22px; font-weight: 800; color: #0891b2; }
    .clinic-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
    .rx-badge { background: #0891b2; color: #fff; font-size: 28px; font-weight: 900; padding: 4px 14px; border-radius: 8px; letter-spacing: 1px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; }
    .meta-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .meta-value { font-size: 14px; font-weight: 600; color: #1e293b; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 11px; font-weight: 800; color: #0891b2; text-transform: uppercase; letter-spacing: 0.08em; border-left: 3px solid #0891b2; padding-left: 8px; margin-bottom: 10px; }
    .section-content { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; font-size: 13px; line-height: 1.6; color: #334155; white-space: pre-wrap; }
    .treatment { background: #f0fdf4; border-color: #bbf7d0; }
    .followup-banner { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 10px 16px; display: flex; align-items: center; gap: 8px; margin-top: 20px; }
    .followup-text { font-size: 12px; font-weight: 700; color: #92400e; }
    .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
    .signature-line { border-top: 1px solid #334155; width: 180px; margin-top: 40px; padding-top: 6px; font-size: 11px; color: #64748b; text-align: center; }
    .disclaimer { font-size: 10px; color: #94a3b8; max-width: 300px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  ${content.innerHTML}
</body>
</html>`);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-2xl mx-4 bg-white dark:bg-[#12141c] rounded-3xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between !px-6 !py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-cyan-100 dark:bg-cyan-950/40 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">e-Prescription</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Visit on {record.appointment.appointmentDate}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="!px-4 !py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <Printer className="h-3.5 w-3.5" /> Print / Save PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="!p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Prescription Content (printable) */}
                <div className="overflow-y-auto flex-1 !p-6">
                    <div ref={printRef}>
                        {/* Letterhead */}
                        <div className="header flex items-start justify-between border-b-2 border-cyan-500 !pb-4 !mb-6">
                            <div>
                                <div className="clinic-name text-2xl font-extrabold text-cyan-600">Shefaa Medical</div>
                                <div className="clinic-sub text-xs text-slate-500">Electronic Medical Record & Prescription</div>
                            </div>
                            <div className="rx-badge bg-cyan-600 text-white text-2xl font-black !px-4 !py-1 rounded-xl tracking-widest">Rx</div>
                        </div>

                        {/* Meta info */}
                        <div className="grid grid-cols-2 gap-4 !mb-6">
                            <div className="meta-box !p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                <div className="meta-label text-[10px] font-bold uppercase tracking-wider text-slate-400 !mb-1 flex items-center gap-1">
                                    <User className="h-3 w-3" /> Physician
                                </div>
                                <div className="meta-value text-sm font-bold text-slate-800 dark:text-slate-100">{doctorName}</div>
                            </div>
                            <div className="meta-box !p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                <div className="meta-label text-[10px] font-bold uppercase tracking-wider text-slate-400 !mb-1 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> Visit Date
                                </div>
                                <div className="meta-value text-sm font-bold text-slate-800 dark:text-slate-100">
                                    {record.appointment.appointmentDate}
                                </div>
                            </div>
                            <div className="meta-box !p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                <div className="meta-label text-[10px] font-bold uppercase tracking-wider text-slate-400 !mb-1 flex items-center gap-1">
                                    <Stethoscope className="h-3 w-3" /> Appointment Time
                                </div>
                                <div className="meta-value text-sm font-bold text-slate-800 dark:text-slate-100">
                                    {record.appointment.startTime?.slice(0, 5)} – {record.appointment.endTime?.slice(0, 5)}
                                </div>
                            </div>
                            {record.appointment.visitReason && (
                                <div className="meta-box !p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                    <div className="meta-label text-[10px] font-bold uppercase tracking-wider text-slate-400 !mb-1 flex items-center gap-1">
                                        <ClipboardList className="h-3 w-3" /> Reason for Visit
                                    </div>
                                    <div className="meta-value text-sm font-bold text-slate-800 dark:text-slate-100">
                                        {record.appointment.visitReason}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chief Complaint */}
                        <div className="section !mb-5">
                            <div className="section-title text-[11px] font-extrabold uppercase tracking-wider text-cyan-600 border-l-4 border-cyan-500 !pl-3 !mb-3 flex items-center gap-1.5">
                                <BookOpen className="h-3.5 w-3.5" /> Chief Complaint
                            </div>
                            <div className="section-content text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl !p-4 leading-relaxed">
                                {record.chiefComplaint}
                            </div>
                        </div>

                        {/* Diagnosis */}
                        <div className="section !mb-5">
                            <div className="section-title text-[11px] font-extrabold uppercase tracking-wider text-cyan-600 border-l-4 border-cyan-500 !pl-3 !mb-3 flex items-center gap-1.5">
                                <Stethoscope className="h-3.5 w-3.5" /> Diagnosis
                            </div>
                            <div className="section-content text-sm font-semibold text-cyan-900 dark:text-cyan-200 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/40 rounded-2xl !p-4 leading-relaxed">
                                {record.diagnosis}
                            </div>
                        </div>

                        {/* Treatment Plan */}
                        <div className="section !mb-5">
                            <div className="section-title text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 border-l-4 border-emerald-500 !pl-3 !mb-3 flex items-center gap-1.5">
                                <Pill className="h-3.5 w-3.5" /> Treatment Plan & Prescription
                            </div>
                            <div className="treatment section-content text-sm font-semibold text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl !p-4 leading-relaxed whitespace-pre-line">
                                {record.treatmentPlan}
                            </div>
                        </div>

                        {/* Doctor Notes */}
                        {record.doctorNotes && (
                            <div className="section !mb-5">
                                <div className="section-title text-[11px] font-extrabold uppercase tracking-wider text-slate-500 border-l-4 border-slate-300 dark:border-slate-600 !pl-3 !mb-3 flex items-center gap-1.5">
                                    <ClipboardList className="h-3.5 w-3.5" /> Doctor's Notes
                                </div>
                                <div className="section-content text-sm text-slate-700 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl !p-4 leading-relaxed">
                                    {record.doctorNotes}
                                </div>
                            </div>
                        )}

                        {/* Follow-up */}
                        {record.followUpDate && (
                            <div className="followup-banner !p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex items-center gap-3 !mt-4">
                                <CalendarClock className="h-5 w-5 text-amber-500 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Follow-Up Required</p>
                                    <p className="text-sm font-bold text-amber-700 dark:text-amber-200 mt-0.5">
                                        {record.followUpDate}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Signature footer */}
                        <div className="footer flex items-end justify-between border-t border-slate-100 dark:border-slate-800 !mt-8 !pt-6">
                            <div>
                                <p className="text-xs text-slate-500">This is an official electronic prescription generated by Shefaa Medical.</p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Record ID: {record.id.slice(0, 8).toUpperCase()}…
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="signature-line border-t border-slate-400 w-40 !pt-2 text-xs text-slate-500">
                                    Physician Signature
                                </div>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">{doctorName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
