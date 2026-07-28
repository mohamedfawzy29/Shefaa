import { useState, useEffect } from "react";
import {
    CalendarDays, Clock,
    CheckCircle2, Loader2, X, Star,
} from "lucide-react";
import type { PublicScheduleResponse } from "../../doctors/types/doctor";
import { usePatientDoctorDetail } from "../hooks/usePatientDoctors";
import { useReschedulePatientAppointment } from "../hooks/usePatientAppointments";
import type { PatientAppointment, RescheduleAppointmentRequest, TimeSlot } from "../types/patientAppointment";

// ── Helpers ──────────────────────────────────────────────────────────────────

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

function getNextDatesForDay(dayOfWeek: number, count = 4): string[] {
    const results: string[] = [];
    const today = new Date();
    const todayDay = today.getDay();
    let daysUntil = (dayOfWeek - todayDay + 7) % 7;
    if (daysUntil === 0) daysUntil = 7; 

    for (let i = 0; i < count; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + daysUntil + i * 7);
        results.push(d.toISOString().slice(0, 10));
    }
    return results;
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface RescheduleAppointmentModalProps {
    appointment: PatientAppointment | null;
    onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RescheduleAppointmentModal({ appointment, onClose }: RescheduleAppointmentModalProps) {
    const isOpen = !!appointment;

    // Fetch full doctor details to get the schedules
    const { data: doctorDetail, isLoading: loadingDetail } = usePatientDoctorDetail(
        appointment?.doctor?.doctorId ?? null
    );

    const rescheduleMutation = useReschedulePatientAppointment();

    // Step 1: Pick day+slot, Step 2: Confirm success
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedSchedule, setSelectedSchedule] = useState<PublicScheduleResponse | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setSelectedSchedule(null);
            setSelectedDate(null);
            setSelectedSlot(null);
            setServerError(null);
        }
    }, [isOpen]);

    if (!isOpen || !appointment) return null;

    const activeSchedules = (doctorDetail?.doctorSchedules ?? []).filter((s) => s.isActive);

    const availableDates = selectedSchedule
        ? getNextDatesForDay(selectedSchedule.dayOfWeek, 4)
        : [];

    const slotsForDate = selectedSchedule && selectedDate
        ? generateSlots(selectedSchedule)
        : [];

    const handleConfirmReschedule = () => {
        if (!selectedSlot || !selectedDate) return;
        setServerError(null);

        const payload: RescheduleAppointmentRequest = {
            newAppointmentDate: selectedDate,
            newStartTime: selectedSlot.startTime + ":00",
            newEndTime: selectedSlot.endTime + ":00",
        };

        rescheduleMutation.mutate({ id: appointment.id, request: payload }, {
            onSuccess: () => setStep(2),
            onError: (err: unknown) => {
                const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                    ?? (err instanceof Error ? err.message : "Reschedule failed. Please try again.");
                setServerError(msg);
            },
        });
    };

    const doctorName = appointment.doctor?.user 
        ? `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}` 
        : "Doctor";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-2xl mx-4 bg-white dark:bg-[#12141c] rounded-3xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden animate-fade-in-scale max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 !px-6 !py-5 flex items-center justify-between shrink-0">
                    <div>
                        <p className="text-xs font-semibold text-amber-100 uppercase tracking-wider">Reschedule Appointment</p>
                        <h2 className="text-lg font-bold text-white mt-0.5">
                            {doctorName}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="!p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 !p-6 space-y-5">
                    {/* ── Step 2: Success ── */}
                    {step === 2 && (
                        <div className="flex flex-col items-center justify-center !py-12 space-y-4 text-center">
                            <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Appointment Rescheduled!</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                                Your appointment with <strong>{doctorName}</strong> is now scheduled for{" "}
                                <strong>{selectedDate && formatDate(selectedDate)}</strong> at{" "}
                                <strong>{selectedSlot?.startTime}</strong>.
                            </p>
                            <div className="flex gap-3 !mt-4">
                                <button
                                    onClick={onClose}
                                    className="!px-6 !py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold transition-colors cursor-pointer"
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
                                    This doctor has no active schedules available.
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
                                                            ? "bg-amber-600 text-white border-amber-600 shadow-md"
                                                            : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400 dark:hover:border-amber-600",
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
                                                <CalendarDays className="inline h-3.5 w-3.5 mr-1 -mt-0.5 text-amber-500" />
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
                                                                ? "bg-amber-600 text-white border-amber-600"
                                                                : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400",
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
                                                <Clock className="inline h-3.5 w-3.5 mr-1 -mt-0.5 text-amber-500" />
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
                                                                ? "bg-amber-600 text-white border-amber-600"
                                                                : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400",
                                                        ].join(" ")}
                                                    >
                                                        {slot.startTime}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {serverError && (
                                        <div className="!p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-400 font-semibold">
                                            {serverError}
                                        </div>
                                    )}

                                    {/* Summary of picked slot & Confirm button */}
                                    {selectedSlot && selectedDate && (
                                        <div className="!mt-2 !p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                                            <div className="text-sm space-y-1">
                                                <p className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                                                    <CalendarDays className="h-4 w-4" /> {formatDate(selectedDate)}
                                                </p>
                                                <p className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                                                    <Clock className="h-4 w-4" /> {selectedSlot.startTime} – {selectedSlot.endTime}
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleConfirmReschedule}
                                                disabled={rescheduleMutation.isPending}
                                                className="!px-5 !py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                                            >
                                                {rescheduleMutation.isPending ? (
                                                    <><Loader2 className="h-4 w-4 animate-spin" /> Updating…</>
                                                ) : (
                                                    <><Star className="h-4 w-4" /> Confirm Reschedule</>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
