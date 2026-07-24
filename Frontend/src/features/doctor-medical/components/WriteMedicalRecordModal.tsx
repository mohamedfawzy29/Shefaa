import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
    Stethoscope, Plus, Trash2, ShieldAlert, CheckCircle2,
    Pill, FileText, CalendarClock, User, History, BookOpen,
} from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { useCreatePrescription } from "../hooks/useDoctorMedical";
import { patientMedicalService } from "../../patient-medical/services/patientMedicalService";
import type { MedicalRecordResponse } from "../../patient-medical/types/patientMedical";

// ── Zod Validation Schema ─────────────────────────────────────────────────────

const medicationSchema = z.object({
    name: z.string().min(2, "Medication name is required"),
    dosage: z.string().min(1, "Dosage is required"),
    frequency: z.string().min(1, "Frequency is required"),
    duration: z.string().min(1, "Duration is required"),
    instructions: z.string().optional(),
});

const medicalRecordSchema = z.object({
    chiefComplaint: z.string().min(3, "Chief complaint must be at least 3 characters"),
    diagnosis: z.string().min(3, "Clinical diagnosis must be at least 3 characters"),
    treatmentPlan: z.string().min(3, "Treatment plan & prescription must be at least 3 characters"),
    doctorNotes: z.string().optional(),
    followUpDate: z.string().optional(),
    medications: z.array(medicationSchema).optional(),
});

type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;

interface WriteMedicalRecordModalProps {
    appointmentId: string | null;
    patientName: string;
    isOpen: boolean;
    onClose: () => void;
}

export function WriteMedicalRecordModal({
    appointmentId,
    patientName,
    isOpen,
    onClose,
}: WriteMedicalRecordModalProps) {
    const createMutation = useCreatePrescription();
    const [activeTab, setActiveTab] = useState<"writer" | "history">("writer");
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [existingRecord, setExistingRecord] = useState<MedicalRecordResponse | null>(null);
    const [loadingRecord, setLoadingRecord] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm<MedicalRecordFormData>({
        resolver: zodResolver(medicalRecordSchema),
        defaultValues: {
            chiefComplaint: "",
            diagnosis: "",
            treatmentPlan: "",
            doctorNotes: "",
            followUpDate: "",
            medications: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "medications",
    });

    const medications = watch("medications") ?? [];

    // Auto-build treatmentPlan from structured medications
    const syncTreatmentPlanFromMedications = (items: typeof medications) => {
        if (!items || items.length === 0) return;
        const formatted = items
            .filter((m) => m.name && m.dosage)
            .map(
                (m, idx) =>
                    `${idx + 1}. ${m.name} (${m.dosage}) - ${m.frequency} for ${m.duration}${
                        m.instructions ? ` [Instructions: ${m.instructions}]` : ""
                    }`
            )
            .join("\n");

        if (formatted) {
            setValue("treatmentPlan", formatted, { shouldValidate: true });
        }
    };

    // Reset or fetch existing record when modal opens
    useEffect(() => {
        if (isOpen && appointmentId) {
            reset({
                chiefComplaint: "",
                diagnosis: "",
                treatmentPlan: "",
                doctorNotes: "",
                followUpDate: "",
                medications: [],
            });
            setServerError(null);
            setSuccessMsg(null);
            setActiveTab("writer");

            // Attempt to check if record already exists
            setLoadingRecord(true);
            patientMedicalService
                .getRecordByAppointment(appointmentId)
                .then((rec) => {
                    setExistingRecord(rec);
                })
                .catch(() => {
                    setExistingRecord(null);
                })
                .finally(() => setLoadingRecord(false));
        }
    }, [isOpen, appointmentId, reset]);

    const handleClose = () => {
        setServerError(null);
        setSuccessMsg(null);
        onClose();
    };

    const onSubmit = (data: MedicalRecordFormData) => {
        if (!appointmentId) return;
        setServerError(null);
        setSuccessMsg(null);

        createMutation.mutate(
            {
                appointmentId,
                chiefComplaint: data.chiefComplaint,
                diagnosis: data.diagnosis,
                treatmentPlan: data.treatmentPlan,
                doctorNotes: data.doctorNotes || undefined,
                followUpDate: data.followUpDate || undefined,
            },
            {
                onSuccess: () => {
                    setSuccessMsg("Medical record saved & appointment completed successfully!");
                    setTimeout(() => {
                        handleClose();
                    }, 1200);
                },
                onError: (err: { response?: { data?: { message?: string } }; message?: string }) => {
                    setServerError(
                        err?.response?.data?.message || err?.message || "Failed to save medical record."
                    );
                },
            }
        );
    };

    const addMedicationRow = () => {
        append({ name: "", dosage: "", frequency: "Once daily", duration: "7 days", instructions: "" });
    };

    const footer = (
        <div className="flex items-center justify-between w-full">
            <Button type="button" variant="ghost" onClick={handleClose}>
                Cancel
            </Button>

            {activeTab === "writer" && (
                <Button
                    type="submit"
                    form="write-medical-record-form"
                    loading={createMutation.isPending}
                    icon={<Stethoscope className="h-4 w-4" />}
                >
                    Save & Complete Consultation
                </Button>
            )}
        </div>
    );

    return (
        <Modal
            title={`Consultation & E-Prescription Writer`}
            description={`Patient: ${patientName}`}
            open={isOpen}
            onClose={handleClose}
            footer={footer}
            maxWidth="xl"
        >
            <div className="space-y-4">
                {/* Top Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800 !mb-4">
                    <button
                        type="button"
                        onClick={() => setActiveTab("writer")}
                        className={[
                            "!pb-3 !px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5",
                            activeTab === "writer"
                                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                                : "border-transparent text-slate-400 hover:text-slate-600",
                        ].join(" ")}
                    >
                        <FileText className="h-3.5 w-3.5" /> Examination & Prescription
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("history")}
                        className={[
                            "!pb-3 !px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5",
                            activeTab === "history"
                                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                                : "border-transparent text-slate-400 hover:text-slate-600",
                        ].join(" ")}
                    >
                        <History className="h-3.5 w-3.5" /> Appointment History & Details
                    </button>
                </div>

                {serverError && (
                    <div className="!p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 shrink-0" />
                        {serverError}
                    </div>
                )}

                {successMsg && (
                    <div className="!p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        {successMsg}
                    </div>
                )}

                {/* ── TAB 1: Writer ── */}
                {activeTab === "writer" && (
                    <form
                        id="write-medical-record-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {/* Chief Complaint & Diagnosis */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                    <BookOpen className="h-3.5 w-3.5 text-cyan-500" /> Chief Complaint <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Primary symptoms reported by patient (e.g. High fever, persistent cough for 3 days)"
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !p-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20"
                                    {...register("chiefComplaint")}
                                />
                                {errors.chiefComplaint && (
                                    <p className="text-xs text-rose-500">{errors.chiefComplaint.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                    <Stethoscope className="h-3.5 w-3.5 text-blue-500" /> Clinical Diagnosis <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Doctor's clinical diagnosis (e.g. Acute Bronchitis, Mild Dehydration)"
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !p-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20"
                                    {...register("diagnosis")}
                                />
                                {errors.diagnosis && (
                                    <p className="text-xs text-rose-500">{errors.diagnosis.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Dynamic Prescription / Medication Builder */}
                        <div className="space-y-3 !p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Pill className="h-4 w-4 text-emerald-500" />
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                        E-Prescription Medication Builder
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={addMedicationRow}
                                    className="!px-3 !py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                    <Plus className="h-3.5 w-3.5" /> Add Medication
                                </button>
                            </div>

                            {fields.length === 0 ? (
                                <p className="text-xs text-slate-400 italic !py-2 text-center">
                                    No structured medications added yet. Click "+ Add Medication" above or type directly into Treatment Plan below.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {fields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="grid grid-cols-12 gap-2 items-center bg-white dark:bg-[#12141c] !p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"
                                        >
                                            <div className="col-span-3">
                                                <input
                                                    type="text"
                                                    placeholder="Medication Name"
                                                    {...register(`medications.${index}.name` as const)}
                                                    onChange={() => syncTreatmentPlanFromMedications(watch("medications") ?? [])}
                                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 !px-2.5 !py-1.5 text-xs outline-none"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    placeholder="Dosage (e.g. 500mg)"
                                                    {...register(`medications.${index}.dosage` as const)}
                                                    onChange={() => syncTreatmentPlanFromMedications(watch("medications") ?? [])}
                                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 !px-2.5 !py-1.5 text-xs outline-none"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    placeholder="Frequency"
                                                    {...register(`medications.${index}.frequency` as const)}
                                                    onChange={() => syncTreatmentPlanFromMedications(watch("medications") ?? [])}
                                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 !px-2.5 !py-1.5 text-xs outline-none"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    placeholder="Duration"
                                                    {...register(`medications.${index}.duration` as const)}
                                                    onChange={() => syncTreatmentPlanFromMedications(watch("medications") ?? [])}
                                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 !px-2.5 !py-1.5 text-xs outline-none"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    placeholder="Instructions"
                                                    {...register(`medications.${index}.instructions` as const)}
                                                    onChange={() => syncTreatmentPlanFromMedications(watch("medications") ?? [])}
                                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 !px-2.5 !py-1.5 text-xs outline-none"
                                                />
                                            </div>
                                            <div className="col-span-1 flex justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        remove(index);
                                                        syncTreatmentPlanFromMedications(
                                                            (watch("medications") ?? []).filter((_, i) => i !== index)
                                                        );
                                                    }}
                                                    className="!p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Formatted Treatment Plan & Prescription Textarea */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Treatment Plan & Final Prescription <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Summary treatment plan, dosage guidelines, and patient advice..."
                                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !p-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-xs leading-relaxed"
                                {...register("treatmentPlan")}
                            />
                            {errors.treatmentPlan && (
                                <p className="text-xs text-rose-500">{errors.treatmentPlan.message}</p>
                            )}
                        </div>

                        {/* Doctor Notes & Follow-Up Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Internal Doctor Notes (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Observations, lab tests ordered, or referral notes"
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !px-4 !py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20"
                                    {...register("doctorNotes")}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                    <CalendarClock className="h-3.5 w-3.5 text-amber-500" /> Recommended Follow-Up Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !px-4 !py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20"
                                    {...register("followUpDate")}
                                />
                            </div>
                        </div>
                    </form>
                )}

                {/* ── TAB 2: History & Details ── */}
                {activeTab === "history" && (
                    <div className="space-y-4 !py-2">
                        {loadingRecord ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                                <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                            </div>
                        ) : existingRecord ? (
                            <div className="!p-5 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800 space-y-4">
                                <div className="flex items-center justify-between border-b border-cyan-200/60 dark:border-cyan-800 !pb-3">
                                    <span className="font-bold text-cyan-900 dark:text-cyan-200 text-sm flex items-center gap-1.5">
                                        <CheckCircle2 className="h-4 w-4 text-cyan-600" /> Recorded Prescription Exists
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">
                                        Date: {existingRecord.appointment?.appointmentDate}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <span className="font-bold text-slate-500 uppercase">Chief Complaint</span>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{existingRecord.chiefComplaint}</p>
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-500 uppercase">Diagnosis</span>
                                        <p className="font-semibold text-cyan-800 dark:text-cyan-300 mt-1">{existingRecord.diagnosis}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="font-bold text-slate-500 uppercase">Treatment Plan</span>
                                        <p className="font-semibold text-emerald-800 dark:text-emerald-300 mt-1 whitespace-pre-line">{existingRecord.treatmentPlan}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="!py-12 text-center space-y-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                <User className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Existing Record for This Appointment</p>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    Use the "Examination & Prescription" tab to fill out and submit this consultation record.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}
