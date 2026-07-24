import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
    Building2, Calendar, Plus, CheckCircle2, DollarSign,
    Clock, Users, Sparkles, ShieldAlert, Check,
} from "lucide-react";
import { useBranches } from "../../lookups/hooks/useLookups";
import {
    useMyBranches,
    useJoinBranch,
    useAddSchedule,
} from "../hooks/useDoctorClinic";

// ── Zod Schemas ───────────────────────────────────────────────────────────────

const joinBranchSchema = z.object({
    branchId: z.string().min(1, "Please select a branch"),
    consultionFee: z.number().min(0, "Fee must be a non-negative number"),
    isPrimary: z.boolean(),
});
type JoinBranchFormData = z.infer<typeof joinBranchSchema>;

const addScheduleSchema = z.object({
    branchId: z.string().min(1, "Please select a branch"),
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    slotDurationMinutes: z.number().min(5).max(120),
    maxPatients: z.number().min(1).max(100),
}).refine((data) => data.startTime < data.endTime, {
    message: "Start time must be before end time",
    path: ["endTime"],
});
type AddScheduleFormData = z.infer<typeof addScheduleSchema>;

const DAYS_OF_WEEK = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
];

export default function DoctorClinicPage() {
    const { data: myBranches = [], isLoading: isMyBranchesLoading } = useMyBranches();
    const { data: allBranches = [] } = useBranches();

    const joinBranchMutation = useJoinBranch();
    const addScheduleMutation = useAddSchedule();

    const [joinSuccess, setJoinSuccess] = useState<string | null>(null);
    const [joinError, setJoinError] = useState<string | null>(null);

    const [scheduleSuccess, setScheduleSuccess] = useState<string | null>(null);
    const [scheduleError, setScheduleError] = useState<string | null>(null);

    // Join Branch Form
    const {
        register: registerJoin,
        handleSubmit: handleSubmitJoin,
        reset: resetJoin,
        formState: { errors: joinErrors },
    } = useForm<JoinBranchFormData>({
        resolver: zodResolver(joinBranchSchema),
        defaultValues: { isPrimary: true, consultionFee: 150 },
    });

    // Add Schedule Form
    const {
        register: registerSchedule,
        handleSubmit: handleSubmitSchedule,
        reset: resetSchedule,
        formState: { errors: scheduleErrors },
    } = useForm<AddScheduleFormData>({
        resolver: zodResolver(addScheduleSchema),
        defaultValues: {
            dayOfWeek: 1,
            startTime: "09:00",
            endTime: "17:00",
            slotDurationMinutes: 30,
            maxPatients: 15,
        },
    });

    // Branches available to join (not already joined)
    const joinedIds = new Set(myBranches.map((mb) => mb.branchId.toLowerCase()));
    const availableBranches = allBranches.filter((b) => !joinedIds.has(b.id.toLowerCase()));

    const onJoinSubmit = (data: JoinBranchFormData) => {
        setJoinSuccess(null);
        setJoinError(null);
        joinBranchMutation.mutate(
            {
                branchId: data.branchId,
                consultionFee: data.consultionFee,
                isPrimary: data.isPrimary,
            },
            {
                onSuccess: () => {
                    setJoinSuccess("Branch joined & consultation fee set successfully!");
                    resetJoin({ isPrimary: false, consultionFee: 150, branchId: "" });
                },
                onError: (err: { response?: { data?: { message?: string } }; message?: string }) => {
                    setJoinError(err?.response?.data?.message || err.message || "Failed to join branch.");
                },
            }
        );
    };

    const onScheduleSubmit = (data: AddScheduleFormData) => {
        setScheduleSuccess(null);
        setScheduleError(null);

        const formatTime = (t: string) => (t.length === 5 ? `${t}:00` : t);

        addScheduleMutation.mutate(
            {
                branchId: data.branchId,
                dayOfWeek: data.dayOfWeek,
                startTime: formatTime(data.startTime),
                endTime: formatTime(data.endTime),
                slotDurationMinutes: data.slotDurationMinutes,
                maxPatients: data.maxPatients,
            },
            {
                onSuccess: () => {
                    setScheduleSuccess("Working hours & schedule added successfully!");
                    resetSchedule();
                },
                onError: (err: { response?: { data?: { message?: string } }; message?: string }) => {
                    setScheduleError(err?.response?.data?.message || err.message || "Failed to add schedule.");
                },
            }
        );
    };

    return (
        <div className="max-w-6xl mx-auto !p-6 space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl !p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 !px-3 !py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-cyan-200">
                        <Sparkles className="h-3.5 w-3.5" />
                        Doctor Practice Portal
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Clinic Settings & Working Hours</h1>
                    <p className="text-blue-100 text-sm max-w-xl leading-relaxed">
                        Configure your practice locations, set your consultation pricing, and schedule weekly patient examination shifts.
                    </p>
                </div>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ── Left Column: Joined Branches & Join Form ── */}
                <div className="space-y-6">
                    {/* Joined Branches Summary Card */}
                    <div className="bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm !p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 !pb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base">Joined Branches</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Branches where you currently practice</p>
                                </div>
                            </div>
                            <span className="!px-3 !py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold">
                                {myBranches.length} Branch{myBranches.length !== 1 ? "es" : ""}
                            </span>
                        </div>

                        {isMyBranchesLoading ? (
                            <div className="space-y-3 !py-4 animate-pulse">
                                <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                            </div>
                        ) : myBranches.length === 0 ? (
                            <div className="!py-8 text-center space-y-2 border-2 border-dashed border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl !px-4">
                                <ShieldAlert className="h-8 w-8 text-amber-500 mx-auto" />
                                <p className="text-sm font-bold text-amber-900 dark:text-amber-300">No Branches Joined Yet</p>
                                <p className="text-xs text-amber-700 dark:text-amber-400 max-w-sm mx-auto">
                                    You must join at least one branch below before patients can book appointments with you.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {myBranches.map((mb) => (
                                    <div
                                        key={mb.branchId}
                                        className="flex items-center justify-between !p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    {mb.branchName}
                                                </span>
                                                {mb.isPrimary && (
                                                    <span className="!px-2 !py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold uppercase">
                                                        Primary Clinic
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                                                Consultation Fee: <span className="font-semibold text-slate-700 dark:text-slate-300">{mb.consultionFee} EGP</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Join Branch Form Card */}
                    <div className="bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm !p-6 space-y-4">
                        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 !pb-4">
                            <div className="h-10 w-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                                <Plus className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base">Join a Branch</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Subscribe to a clinic location & set consultation fee</p>
                            </div>
                        </div>

                        {joinSuccess && (
                            <div className="!p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                {joinSuccess}
                            </div>
                        )}
                        {joinError && (
                            <div className="!p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4 shrink-0" />
                                {joinError}
                            </div>
                        )}

                        <form onSubmit={handleSubmitJoin(onJoinSubmit)} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Select Branch <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    {...registerJoin("branchId")}
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !px-4 !py-3 text-sm text-slate-900 dark:text-slate-100 outline-none"
                                >
                                    <option value="">Select an available branch…</option>
                                    {availableBranches.map((b) => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                                {joinErrors.branchId && (
                                    <p className="text-xs text-rose-500">{joinErrors.branchId.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Consultation Fee (EGP) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="10"
                                    {...registerJoin("consultionFee", { valueAsNumber: true })}
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !px-4 !py-3 text-sm text-slate-900 dark:text-slate-100 outline-none"
                                />
                                {joinErrors.consultionFee && (
                                    <p className="text-xs text-rose-500">{joinErrors.consultionFee.message}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 !pt-1">
                                <input
                                    type="checkbox"
                                    id="isPrimary"
                                    {...registerJoin("isPrimary")}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <label htmlFor="isPrimary" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                    Set as Primary Practice Branch
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={joinBranchMutation.isPending || availableBranches.length === 0}
                                className="w-full !py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer !mt-2"
                            >
                                {joinBranchMutation.isPending ? "Joining…" : "Subscribe to Branch"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* ── Right Column: Add Schedule Form ── */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm !p-6 space-y-4">
                        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 !pb-4">
                            <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base">Add Working Hours</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Define daily shifts & patient slot capacity</p>
                            </div>
                        </div>

                        {scheduleSuccess && (
                            <div className="!p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                {scheduleSuccess}
                            </div>
                        )}
                        {scheduleError && (
                            <div className="!p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4 shrink-0" />
                                {scheduleError}
                            </div>
                        )}

                        <form onSubmit={handleSubmitSchedule(onScheduleSubmit)} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Select Joined Branch <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    {...registerSchedule("branchId")}
                                    disabled={myBranches.length === 0}
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !px-4 !py-3 text-sm text-slate-900 dark:text-slate-100 outline-none disabled:opacity-50"
                                >
                                    <option value="">{myBranches.length > 0 ? "Select branch…" : "Join a branch first"}</option>
                                    {myBranches.map((b) => (
                                        <option key={b.branchId} value={b.branchId}>{b.branchName}</option>
                                    ))}
                                </select>
                                {scheduleErrors.branchId && (
                                    <p className="text-xs text-rose-500">{scheduleErrors.branchId.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Day of Week <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    {...registerSchedule("dayOfWeek", { valueAsNumber: true })}
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !px-4 !py-3 text-sm text-slate-900 dark:text-slate-100 outline-none"
                                >
                                    {DAYS_OF_WEEK.map((d) => (
                                        <option key={d.value} value={d.value}>{d.label}</option>
                                    ))}
                                </select>
                                {scheduleErrors.dayOfWeek && (
                                    <p className="text-xs text-rose-500">{scheduleErrors.dayOfWeek.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Start Time <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        {...registerSchedule("startTime")}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !px-4 !py-3 text-sm text-slate-900 dark:text-slate-100 outline-none"
                                    />
                                    {scheduleErrors.startTime && (
                                        <p className="text-xs text-rose-500">{scheduleErrors.startTime.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        End Time <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        {...registerSchedule("endTime")}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !px-4 !py-3 text-sm text-slate-900 dark:text-slate-100 outline-none"
                                    />
                                    {scheduleErrors.endTime && (
                                        <p className="text-xs text-rose-500">{scheduleErrors.endTime.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Slot Duration (Mins)
                                    </label>
                                    <select
                                        {...registerSchedule("slotDurationMinutes", { valueAsNumber: true })}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !px-4 !py-3 text-sm text-slate-900 dark:text-slate-100 outline-none"
                                    >
                                        <option value={15}>15 mins</option>
                                        <option value={20}>20 mins</option>
                                        <option value={30}>30 mins</option>
                                        <option value={45}>45 mins</option>
                                        <option value={60}>60 mins</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Max Patients
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        {...registerSchedule("maxPatients", { valueAsNumber: true })}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !px-4 !py-3 text-sm text-slate-900 dark:text-slate-100 outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={addScheduleMutation.isPending || myBranches.length === 0}
                                className="w-full !py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer !mt-4"
                            >
                                {addScheduleMutation.isPending ? "Adding Schedule…" : "Save Working Hours"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
