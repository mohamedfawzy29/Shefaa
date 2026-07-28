import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
    CalendarDays, Clock, MapPin, Stethoscope,
    CheckCircle2, Loader2, X, ChevronRight, Star,
} from "lucide-react";
import type { PublicDoctorResponse, PublicScheduleResponse } from "../../doctors/types/doctor";
import { usePatientDoctorDetail } from "../hooks/usePatientDoctors";
import { useBookAppointment } from "../hooks/usePatientAppointments";
import type { BookAppointmentRequest, TimeSlot } from "../types/patientAppointment";

// ── Helpers ──────────────────────────────────────────────────────────────────

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Generate time slots for a given schedule */
function generateSlots(schedule: PublicScheduleResponse): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const [startH, startM] = schedule.startTime.split(":").map(Number);
    const [endH, endM] = schedule.endTime.split(":").map(Number);

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (currentMinutes + schedule.slotDurationMinutes <= endMinutes) {
        const slotStart = `${String(Math.floor(currentMinutes / 60)).padStart(2, "0")}:${String(currentMinutes % 60).padStart(2, "0")}`;
        const slotEndMin = currentMinutes + schedule.slotDurationMinutes;
        const slotEnd = `${String(Math.floor(slotEndMin / 60)).padStart(2, "0")}:${String(slotEndMin % 60).padStart(2, "0")}`;
        slots.push({ startTime: slotStart, endTime: slotEnd, schedule });
        currentMinutes += schedule.slotDurationMinutes;
    }
    return slots;
}

/** Get the next N dates that match the given JS dayOfWeek (0=Sun…6=Sat) */
function getNextDatesForDay(dayOfWeek: number, count = 4): string[] {
    const results: string[] = [];
    const today = new Date();
    const todayDay = today.getDay();
    let daysUntil = (dayOfWeek - todayDay + 7) % 7;
    if (daysUntil === 0) daysUntil = 7; // skip today, start from next occurrence

    for (let i = 0; i < count; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + daysUntil + i * 7);
        results.push(d.toISOString().slice(0, 10));
    }
    return results;
}

/** Format date string "YYYY-MM-DD" → "Mon, Jul 25" */
function formatDate(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// ── Zod schema ───────────────────────────────────────────────────────────────

const bookingSchema = z.object({
    visitReason: z.string().min(3, "Please describe your reason for the visit").max(500),
});
type BookingFormData = z.infer<typeof bookingSchema>;

// ── Types ─────────────────────────────────────────────────────────────────────

interface BookAppointmentModalProps {
    /** The doctor to book with (list-level data). Pass null to close. */
    doctor: PublicDoctorResponse | null;
    onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function BookAppointmentModal({ doctor, onClose }: BookAppointmentModalProps) {
    const isOpen = !!doctor;

    // Fetch full doctor details (with schedules) when a doctor is selected
    const { data: doctorDetail, isLoading: loadingDetail } = usePatientDoctorDetail(
        doctor?.doctorId ?? null
    );

    const bookMutation = useBookAppointment();

    // Step state: 1=pick day+slot, 2=enter reason, 3=confirm success
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedSchedule, setSelectedSchedule] = useState<PublicScheduleResponse | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
    });

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setSelectedSchedule(null);
            setSelectedDate(null);
            setSelectedSlot(null);
            setServerError(null);
            reset();
        }
    }, [isOpen, reset]);

    if (!isOpen || !doctor) return null;

    const activeSchedules = (doctorDetail?.doctorSchedules ?? []).filter((s) => s.isActive);

    const availableDates = selectedSchedule
        ? getNextDatesForDay(selectedSchedule.dayOfWeek, 4)
        : [];

    const slotsForDate = selectedSchedule && selectedDate
        ? generateSlots(selectedSchedule).filter((slot) => {
            if (!doctorDetail?.bookedSlots) return true;
            return !doctorDetail.bookedSlots.some(
                (booked) => booked.date === selectedDate && booked.startTime.startsWith(slot.startTime)
            );
        })
        : [];

    const onSubmitReason = handleSubmit(async (data: BookingFormData) => {
        if (!selectedSlot || !selectedDate) return;
        setServerError(null);

        const payload: BookAppointmentRequest = {
            doctorId: doctor.doctorId,
            branchId: selectedSlot.schedule.branchId,
            appointmentDate: selectedDate,
            startTime: selectedSlot.startTime + ":00",
            endTime: selectedSlot.endTime + ":00",
            visitReason: data.visitReason,
        };

        bookMutation.mutate(payload, {
            onSuccess: () => setStep(3),
            onError: (err: unknown) => {
                const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                    ?? (err instanceof Error ? err.message : "Booking failed. Please try again.");
                setServerError(msg);
            },
        });
    });

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-2xl mx-4 bg-white dark:bg-[#12141c] rounded-3xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden animate-fade-in-scale max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-600 to-blue-700 !px-6 !py-5 flex items-center justify-between shrink-0">
                    <div>
                        <p className="text-xs font-semibold text-cyan-200 uppercase tracking-wider">Book Appointment</p>
                        <h2 className="text-lg font-bold text-white mt-0.5">
                            Dr. {doctor.firstName} {doctor.lastName}
                        </h2>
                        <p className="text-cyan-100 text-xs flex items-center gap-1 mt-0.5">
                            <Stethoscope className="h-3 w-3" /> {doctor.specialization}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="!p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Step indicator */}
                {step !== 3 && (
                    <div className="flex items-center gap-2 !px-6 !py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                        {[
                            { n: 1, label: "Choose Slot" },
                            { n: 2, label: "Visit Reason" },
                        ].map(({ n, label }) => (
                            <div key={n} className="flex items-center gap-1">
                                <span className={[
                                    "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                    step === n
                                        ? "bg-cyan-600 text-white"
                                        : step > n
                                            ? "bg-emerald-500 text-white"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-400",
                                ].join(" ")}>{n}</span>
                                <span className={`text-xs font-semibold ${step === n ? "text-slate-800 dark:text-slate-100" : "text-slate-400"}`}>
                                    {label}
                                </span>
                                {n < 2 && <ChevronRight className="h-3 w-3 text-slate-300 ml-1" />}
                            </div>
                        ))}
                    </div>
                )}

                {/* Body */}
                <div className="overflow-y-auto flex-1 !p-6 space-y-5">
                    {/* ── Step 3: Success ── */}
                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center !py-12 space-y-4 text-center">
                            <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Appointment Booked!</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                                Your appointment with <strong>Dr. {doctor.firstName} {doctor.lastName}</strong> on{" "}
                                <strong>{selectedDate && formatDate(selectedDate)}</strong> at{" "}
                                <strong>{selectedSlot?.startTime}</strong> has been confirmed.
                            </p>
                            <div className="flex gap-3 !mt-4">
                                <button
                                    onClick={onClose}
                                    className="!px-6 !py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold transition-colors cursor-pointer"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 1: Pick day & slot ── */}
                    {step === 1 && (
                        <>
                            {loadingDetail ? (
                                <div className="space-y-3 animate-pulse">
                                    <div className="h-5 w-40 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                                    <div className="grid grid-cols-3 gap-3">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                                        ))}
                                    </div>
                                </div>
                            ) : activeSchedules.length === 0 ? (
                                <div className="!py-10 text-center text-slate-400 text-sm">
                                    This doctor has no active schedules yet. Please check back later.
                                </div>
                            ) : (
                                <>
                                    {/* Step 1a: Pick a day */}
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                            Available Days
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {activeSchedules.map((sch) => (
                                                <button
                                                    key={sch.id}
                                                    onClick={() => {
                                                        setSelectedSchedule(sch);
                                                        setSelectedDate(null);
                                                        setSelectedSlot(null);
                                                    }}
                                                    className={[
                                                        "!px-4 !py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer",
                                                        selectedSchedule?.id === sch.id
                                                            ? "bg-cyan-600 text-white border-cyan-600 shadow-md"
                                                            : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-400 dark:hover:border-cyan-600",
                                                    ].join(" ")}
                                                >
                                                    {DAY_NAMES[sch.dayOfWeek]}
                                                    <span className="ml-1.5 text-xs opacity-70">
                                                        {sch.startTime.slice(0, 5)}–{sch.endTime.slice(0, 5)}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Step 1b: Pick a specific date */}
                                    {selectedSchedule && (
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                                <CalendarDays className="inline h-3.5 w-3.5 mr-1 -mt-0.5 text-cyan-500" />
                                                Select Date
                                            </p>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                {availableDates.map((d) => (
                                                    <button
                                                        key={d}
                                                        onClick={() => {
                                                            setSelectedDate(d);
                                                            setSelectedSlot(null);
                                                        }}
                                                        className={[
                                                            "!py-2.5 !px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center",
                                                            selectedDate === d
                                                                ? "bg-cyan-600 text-white border-cyan-600"
                                                                : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-400",
                                                        ].join(" ")}
                                                    >
                                                        {formatDate(d)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 1c: Pick a time slot */}
                                    {selectedDate && slotsForDate.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                                <Clock className="inline h-3.5 w-3.5 mr-1 -mt-0.5 text-cyan-500" />
                                                Available Time Slots
                                            </p>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                {slotsForDate.map((slot) => (
                                                    <button
                                                        key={slot.startTime}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={[
                                                            "!py-2 !px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center",
                                                            selectedSlot?.startTime === slot.startTime
                                                                ? "bg-cyan-600 text-white border-cyan-600"
                                                                : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-400",
                                                        ].join(" ")}
                                                    >
                                                        {slot.startTime}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Summary of picked slot */}
                                    {selectedSlot && selectedDate && (
                                        <div className="!mt-2 !p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800 flex items-center justify-between">
                                            <div className="text-sm space-y-1">
                                                <p className="font-bold text-cyan-800 dark:text-cyan-200 flex items-center gap-1.5">
                                                    <CalendarDays className="h-4 w-4" /> {formatDate(selectedDate)}
                                                </p>
                                                <p className="font-semibold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
                                                    <Clock className="h-4 w-4" /> {selectedSlot.startTime} – {selectedSlot.endTime}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setStep(2)}
                                                className="!px-5 !py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                                            >
                                                Next <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {/* ── Step 2: Visit reason ── */}
                    {step === 2 && (
                        <form onSubmit={onSubmitReason} className="space-y-5" id="booking-reason-form">
                            {/* Recap of selected slot */}
                            <div className="!p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <CalendarDays className="h-3.5 w-3.5 text-cyan-500" />
                                    <span className="font-semibold">{selectedDate && formatDate(selectedDate)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <Clock className="h-3.5 w-3.5 text-cyan-500" />
                                    <span className="font-semibold">{selectedSlot?.startTime} – {selectedSlot?.endTime}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 col-span-2">
                                    <MapPin className="h-3.5 w-3.5 text-cyan-500" />
                                    <span className="font-semibold">Branch ID: {selectedSlot?.schedule.branchId.slice(0, 8)}…</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                                    Reason for Visit <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    {...register("visitReason")}
                                    rows={4}
                                    placeholder="e.g. Recurring headache and dizziness, follow-up on blood test results..."
                                    className={[
                                        "w-full rounded-2xl border text-sm !px-4 !py-3 resize-none outline-none transition-all",
                                        "bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder:text-slate-400",
                                        errors.visitReason
                                            ? "border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20"
                                            : "border-slate-200 dark:border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20",
                                    ].join(" ")}
                                />
                                {errors.visitReason && (
                                    <p className="text-xs text-rose-500 mt-1">{errors.visitReason.message}</p>
                                )}
                            </div>

                            {serverError && (
                                <div className="!p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-400 font-semibold">
                                    {serverError}
                                </div>
                            )}
                        </form>
                    )}
                </div>

                {/* Footer */}
                {step === 2 && (
                    <div className="border-t border-slate-100 dark:border-slate-800 !px-6 !py-4 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/10">
                        <button
                            onClick={() => setStep(1)}
                            className="!px-5 !py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            ← Back
                        </button>
                        <button
                            type="submit"
                            form="booking-reason-form"
                            disabled={bookMutation.isPending}
                            className="!px-6 !py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white text-sm font-bold transition-colors cursor-pointer flex items-center gap-2"
                        >
                            {bookMutation.isPending ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Booking…</>
                            ) : (
                                <><Star className="h-4 w-4" /> Confirm Booking</>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
