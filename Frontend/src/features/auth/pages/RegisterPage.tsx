import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
    HeartPulse, Loader2, ShieldCheck, User, Users,
    Activity, Star, Mail, Lock, UserCheck, Phone,
    FileText, Calendar, Building2, MapPin, CreditCard,
    Briefcase, ImagePlus
} from "lucide-react";
import {
    registerSchema,
    registerDoctorSchema,
    registerReceptionistSchema,
    type RegisterFormData,
    type RegisterDoctorFormData,
    type RegisterReceptionistFormData,
} from "../validation/loginSchema";
import authService from "../services/authService";
import {
    useSpecializations,
    useBranches,
    useOrganizations,
} from "../../lookups/hooks/useLookups";

type Role = "patient" | "doctor" | "receptionist";

/* ─── tiny reusable field wrapper ─────────────────────────────── */
function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5 min-w-0 w-full">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

/* ─── stat pill ────────────────────────────────────────────────── */
function Stat({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
    return (
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 !px-4 !py-3 backdrop-blur-sm ring-1 ring-white/20">
            <Icon className="h-5 w-5 text-white/70" />
            <span className="text-lg font-bold text-white">{value}</span>
            <span className="text-[10px] font-medium text-blue-100/70 text-center">{label}</span>
        </div>
    );
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState<Role>("patient");
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { data: specializations = [] } = useSpecializations();
    const { data: branches = [] } = useBranches();
    const { data: organizations = [] } = useOrganizations();

    // Form setup based on role
    const currentSchema =
        role === "doctor" ? registerDoctorSchema
            : role === "receptionist" ? registerReceptionistSchema
                : registerSchema;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm<any>({
        resolver: (values, context, options) => zodResolver(currentSchema)(values, context, options),
        defaultValues: { gender: 0, yearsOfExperience: 0 },
    });

    const selectedOrganizationId = watch("organizationId");
    useEffect(() => { setValue("branchId", ""); }, [selectedOrganizationId, setValue]);

    const filteredBranches = branches.filter((b) => b.organizationId === selectedOrganizationId);

    // Reset form when role changes
    useEffect(() => {
        reset({ gender: 0, yearsOfExperience: 0 });
        setServerError(null);
    }, [role, reset]);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setServerError(null);
        try {
            if (role === "patient") {
                const pData = data as RegisterFormData;
                await authService.registerPatient({
                    ...pData,
                    phoneNumbers: [pData.phoneNumber],
                    profileImg: pData.profileImg?.[0] instanceof File ? pData.profileImg[0] : null,
                });
            } else if (role === "doctor") {
                const dData = data as RegisterDoctorFormData;
                await authService.registerDoctor({
                    ...dData,
                    phoneNumbers: [dData.phoneNumber],
                    profileImg: dData.profileImg?.[0] instanceof File ? dData.profileImg[0] : null,
                });
            } else if (role === "receptionist") {
                const rData = data as RegisterReceptionistFormData;
                await authService.registerReceptionist({
                    ...rData,
                    phoneNumbers: [rData.phoneNumber],
                    profileImg:
                        rData.profileImg?.[0] instanceof File
                            ? rData.profileImg[0]
                            : null,
                });
            }
            setSuccess(true);
        } catch (error) {
            setServerError(error instanceof Error ? error.message : "Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };

    /* shared input class */
    const inputCls = (hasError: boolean) =>
        [
            "w-full rounded-2xl border bg-slate-50 dark:bg-slate-800/60 !px-4 text-sm font-medium text-slate-900 dark:text-slate-100",
            "placeholder:text-slate-450 dark:placeholder:text-slate-555 outline-none transition-all duration-200 h-[52px]",
            hasError
                ? "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-400/10"
                : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
        ].join(" ");

    if (success) {
        return (
            <div className="flex min-h-screen w-full items-start sm:items-center justify-center overflow-y-auto bg-[#F8FAFC] dark:bg-[#020617] !px-4 !py-8 transition-colors duration-300">
                <div className="w-full max-w-md rounded-[32px] bg-white dark:bg-[#0F172A] !p-10 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.18)] dark:shadow-[0_32px_80px_-12px_rgba(0,0,0,0.7)] text-center border border-transparent dark:border-slate-800">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-950/30">
                        <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">Registration Successful!</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                        Please check your email to confirm your account before logging in.
                        {role === "doctor" || role === "receptionist" ? " Admin approval may also be required." : ""}
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="flex h-[52px] w-full items-center justify-center rounded-2xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-200/60 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 dark:shadow-none"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full items-start sm:items-center justify-center overflow-y-auto bg-[#F8FAFC] dark:bg-[#020617] !px-4 !py-8 transition-colors duration-300">
            {/*
                Outer card: max-w-5xl, two columns
                Left  ≈ 50%  (form)
                Right ≈ 50%  (brand panel)
            */}
            <div className="flex w-full max-w-5xl overflow-hidden rounded-[32px] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.18)] dark:shadow-[0_32px_80px_-12px_rgba(0,0,0,0.7)]">

                {/* ━━━ LEFT — Form ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <section className="flex w-full flex-col justify-center bg-white dark:bg-[#0F172A] !px-10 !py-10 sm:!px-14 lg:w-[52%]">

                    {/* Logo */}
                    <div className="mb-8 flex items-center justify-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-md shadow-blue-200 dark:shadow-blue-950/60">
                            <HeartPulse className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Shefaa</span>
                    </div>

                    {/* Heading */}
                    <div className="mb-7 text-center">
                        <h1 className="text-2xl font-extrabold leading-tight text-slate-900 dark:text-white">
                            Create Account
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Join us and get started on your journey
                        </p>
                    </div>

                    {/* Role Picker Tabs */}
                    <div className="mb-7 flex justify-center">
                        <div className="w-full max-w-[360px]">
                            <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 !p-1.5">
                                {(["patient", "doctor", "receptionist"] as const).map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={`flex-1 rounded-xl !py-2.5 text-xs font-bold transition-all duration-200 ${role === r
                                            ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                            }`}
                                    >
                                        {r.charAt(0).toUpperCase() + r.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Constrained form area */}
                    <div className="w-full max-w-lg mx-auto">
                        {serverError && (
                            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 !px-4 !py-3.5 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                                <ShieldCheck className="mt-px h-4 w-4 shrink-0" />
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 !pl-6">
                            {/* Names row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="First Name" error={errors.firstName?.message?.toString()} required>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            {...register("firstName")}
                                            placeholder="John"
                                            className={`${inputCls(!!errors.firstName)} !pl-11 !h-[45px]`}
                                        />
                                    </div>
                                </Field>
                                <Field label="Last Name" error={errors.lastName?.message?.toString()} required>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            {...register("lastName")}
                                            placeholder="Doe"
                                            className={`${inputCls(!!errors.lastName)} !pl-11 !h-[45px]`}
                                        />
                                    </div>
                                </Field>
                            </div>

                            {/* Email & Username row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Email Address" error={errors.email?.message?.toString()} required>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            {...register("email")}
                                            placeholder="john@example.com"
                                            className={`${inputCls(!!errors.email)} !pl-11 !h-[45px]`}
                                        />
                                    </div>
                                </Field>
                                <Field label="Username" error={errors.userName?.message?.toString()} required>
                                    <div className="relative">
                                        <UserCheck className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            {...register("userName")}
                                            placeholder="johndoe"
                                            className={`${inputCls(!!errors.userName)} !pl-11 !h-[45px]`}
                                        />
                                    </div>
                                </Field>
                            </div>

                            {/* Passwords row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Password" error={errors.password?.message?.toString()} required>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            {...register("password")}
                                            placeholder="••••••••"
                                            className={`${inputCls(!!errors.password)} !pl-11 !h-[45px]`}
                                        />
                                    </div>
                                </Field>
                                <Field label="Confirm Password" error={errors.confirmPassword?.message?.toString()} required>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            {...register("confirmPassword")}
                                            placeholder="••••••••"
                                            className={`${inputCls(!!errors.confirmPassword)} !pl-11 !h-[45px]`}
                                        />
                                    </div>
                                </Field>
                            </div>

                            {/* Gender & Birth Date row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Gender" required>
                                    <select
                                        {...register("gender", { valueAsNumber: true })}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 !h-[45px] dark:bg-slate-800/60 !px-4 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none transition-all duration-200 h-[52px]"
                                    >
                                        <option value={0}>Male</option>
                                        <option value={1}>Female</option>
                                    </select>
                                </Field>
                                <Field label="Date of Birth" error={errors.dateOfBirth?.message?.toString()} required>
                                    <div className="relative">
                                        <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 " />
                                        <input
                                            type="date"
                                            {...register("dateOfBirth")}
                                            className={`${inputCls(!!errors.dateOfBirth)} !pl-11 !pr-4 !h-[45px]`}
                                        />
                                    </div>
                                </Field>
                            </div>

                            {/* Phone & Profile Image row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Phone Number" error={errors.phoneNumber?.message?.toString()} required>
                                    <div className="relative">
                                        <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="tel"
                                            {...register("phoneNumber")}
                                            placeholder="0123456789"
                                            className={`${inputCls(!!errors.phoneNumber)} !pl-11 !h-[45px]`}
                                        />
                                    </div>
                                </Field>
                                <Field label="Profile Image (optional)">
                                    <div className="relative">
                                        <ImagePlus className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            {...register("profileImg")}
                                            className="w-full rounded-2xl border border-slate-200 !h-[45px] dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !pl-11 !pr-3 text-xs font-medium text-slate-500 dark:text-slate-450 outline-none transition-all duration-200 leading-[40px] cursor-pointer flex items-center file:mr-3 file:my-auto file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-600 file:!px-3 file:!py-1.5 file:text-xs file:font-semibold file:text-white file:transition-colors file:align-middle hover:file:bg-blue-700"
                                        />
                                    </div>
                                </Field>
                            </div>

                            {/* Address & National ID row */}
                            {(role === "patient" || role === "receptionist") && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Address (optional)">
                                        <div className="relative">
                                            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                {...register("address")}
                                                placeholder="Street address"
                                                className={`${inputCls(false)} !pl-11 !h-[45px]`}
                                            />
                                        </div>
                                    </Field>
                                    <Field label="National ID (optional)">
                                        <div className="relative">
                                            <CreditCard className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                {...register("nationalId")}
                                                placeholder="ID Number"
                                                className={`${inputCls(false)} !pl-11 !h-[45px]`}
                                            />
                                        </div>
                                    </Field>
                                </div>
                            )}

                            {/* Patient Specific: Emergency contact & Blood Type */}
                            {role === "patient" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Emergency Contact (optional)">
                                        <div className="relative">
                                            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                {...register("emergencyContact")}
                                                placeholder="Contact number"
                                                className={`${inputCls(false)} !pl-11 !h-[45px]`}
                                            />
                                        </div>
                                    </Field>
                                    <Field label="Blood Type (optional)">
                                        <select
                                            {...register("bloodType")}
                                            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !px-4 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none transition-all duration-200 !h-[45px]"
                                        >
                                            <option value="">Select...</option>
                                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bt => (
                                                <option key={bt} value={bt}>{bt}</option>
                                            ))}
                                        </select>
                                    </Field>
                                </div>
                            )}

                            {/* Doctor Specific: Bio, Exp, License, Specialization */}
                            {role === "doctor" && (
                                <div className="space-y-4">
                                    <Field label="Bio" error={errors.bio?.message?.toString()} required>
                                        <div className="relative">
                                            <FileText className="pointer-events-none absolute left-4 top-3 h-4 w-4 text-slate-400" />
                                            <textarea
                                                {...register("bio")}
                                                rows={2}
                                                placeholder="Write a brief professional bio..."
                                                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !pl-11 !pr-4 !pt-3 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all duration-200 !h-[45px]"
                                            />
                                        </div>
                                    </Field>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <Field label="Years Exp." error={errors.yearsOfExperience?.message?.toString()} required>
                                            <input
                                                type="number"
                                                {...register("yearsOfExperience", { valueAsNumber: true })}
                                                className={`${inputCls(!!errors.yearsOfExperience)} !pl-4 !h-[45px]`}
                                            />
                                        </Field>
                                        <Field label="License No." error={errors.licenseNumber?.message?.toString()} required>
                                            <input
                                                type="text"
                                                {...register("licenseNumber")}
                                                placeholder="LIC123"
                                                className={`${inputCls(!!errors.licenseNumber)} !pl-4 !h-[45px]`}
                                            />
                                        </Field>
                                        <Field label="Specialization" error={errors.specializationId?.message?.toString()} required>
                                            <select
                                                {...register("specializationId")}
                                                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !px-4 text-xs font-semibold text-slate-950 dark:text-slate-100 outline-none transition-all duration-200 !h-[45px]"
                                            >
                                                <option value="">Select...</option>
                                                {specializations.map((item) => (
                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                ))}
                                            </select>
                                        </Field>
                                    </div>
                                </div>
                            )}

                            {/* Receptionist Specific: Organization & Branch */}
                            {role === "receptionist" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Organization" error={errors.organizationId?.message?.toString()} required>
                                        <select
                                            {...register("organizationId")}
                                            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !px-4 text-xs font-semibold text-slate-950 dark:text-slate-100 outline-none transition-all duration-200 !h-[45px]"
                                        >
                                            <option value="">Select Organization</option>
                                            {organizations.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field label="Branch" error={errors.branchId?.message?.toString()} required>
                                        <select
                                            {...register("branchId")}
                                            disabled={!selectedOrganizationId}
                                            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 !px-4 text-xs font-semibold text-slate-950 dark:text-slate-100 outline-none transition-all duration-200 !h-[45px] disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            <option value="">{selectedOrganizationId ? "Select Branch" : "Select Organization First"}</option>
                                            {filteredBranches.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </Field>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex !h-[45px] w-full items-center justify-center gap-2.5 rounded-2xl bg-blue-600 text-[15px] font-bold text-white shadow-lg shadow-blue-200/60 transition-all duration-200 hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-blue-950/50 !mt-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                                        Creating account…
                                    </>
                                ) : (
                                    `Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account`
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ━━━ RIGHT — Brand Panel ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <section className="relative hidden lg:flex lg:w-[48%] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 !px-12 !py-14">

                    {/* Background texture */}
                    <div className="absolute inset-0"
                        style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.06) 0%, transparent 50%)" }} />
                    <div className="absolute inset-0 opacity-[0.07]"
                        style={{ backgroundImage: "radial-gradient(white 1.5px, transparent 1.5px)", backgroundSize: "30px 30px" }} />

                    {/* Glow blobs */}
                    <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-400/30 blur-[80px]" />
                    <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-800/40 blur-[60px]" />

                    {/* Center icon circle */}
                    <div className="relative mb-10 flex h-[120px] w-[120px] items-center justify-center rounded-[32px] bg-white/15 ring-1 ring-white/25 shadow-2xl backdrop-blur-sm">
                        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/20 to-transparent" />
                        <Briefcase className="h-16 w-16 text-white relative z-10" />
                    </div>

                    {/* Heading */}
                    <div className="relative text-center mb-10">
                        <h2 className="text-[2.1rem] font-extrabold leading-tight text-white">
                            Better healthcare<br />
                            <span className="text-blue-200">starts here.</span>
                        </h2>
                        <p className="mt-4 text-[15px] leading-relaxed text-blue-100/75 max-w-xs mx-auto">
                            Join our platform to access top medical features, manage branches, and schedule workflows efficiently.
                        </p>
                    </div>

                    {/* Stats row */}
                    <div className="relative grid grid-cols-3 gap-3 w-full max-w-sm">
                        <Stat icon={Users} value="120+" label="Branches" />
                        <Stat icon={Activity} value="99.9%" label="Precision" />
                        <Stat icon={Star} value="4.8★" label="Satisfaction" />
                    </div>

                    {/* Bottom bar */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 !pb-6">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-200/60" />
                        <span className="text-xs text-blue-100/50 font-medium">HIPAA compliant · End-to-end encrypted</span>
                    </div>
                </section>

            </div>
        </div>
    );
}