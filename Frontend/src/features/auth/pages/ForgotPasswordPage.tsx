import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
    HeartPulse, Loader2, ShieldCheck, Mail, Users,
    Activity, Star, KeyRound
} from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../validation/loginSchema";
import authService from "../services/authService";

/* ─── tiny reusable field wrapper ─────────────────────────────── */
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5 min-w-0 w-full">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
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

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [submittedIdentifier, setSubmittedIdentifier] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        setServerError(null);
        try {
            await authService.forgotPassword({ userNameOrEmail: data.userNameOrEmail });
            setSubmittedIdentifier(data.userNameOrEmail);
            setSuccess(true);
        } catch (error) {
            setServerError(error instanceof Error ? error.message : "Failed to send OTP.");
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
            <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] dark:bg-[#020617] !p-4 transition-colors duration-300">
                <div className="w-full max-w-md rounded-[32px] bg-white dark:bg-[#0F172A] !p-10 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.18)] dark:shadow-[0_32px_80px_-12px_rgba(0,0,0,0.7)] text-center border border-transparent dark:border-slate-800">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/30">
                        <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">OTP Sent!</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                        A 6-digit OTP has been sent to your email. Enter it to reset your password.
                    </p>
                    <button
                        onClick={() => navigate("/verify-otp", { state: { identifier: submittedIdentifier } })}
                        className="flex h-[52px] w-full items-center justify-center rounded-2xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-200/60 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 dark:shadow-none"
                    >
                        Enter OTP
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] dark:bg-[#020617] !p-4 transition-colors duration-300">
            {/*
                Outer card: max-w-5xl, two columns
                Left  ≈ 45%  (form)
                Right ≈ 55%  (brand panel)
            */}
            <div className="flex w-full max-w-5xl overflow-hidden rounded-[32px] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.18)] dark:shadow-[0_32px_80px_-12px_rgba(0,0,0,0.7)] h-[400px]">

                {/* ━━━ LEFT — Form ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <section className="flex w-full flex-col justify-center bg-white dark:bg-[#0F172A] !px-10 !py-14 sm:!px-14 lg:w-[45%]">

                    {/* Logo */}
                    <div className="!mb-8 flex items-center justify-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-200 dark:shadow-blue-950/60">
                            <HeartPulse className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Shefaa</span>
                    </div>

                    {/* Heading */}
                    <div className="!mb-9 text-center">
                        <h1 className="text-3xl font-extrabold leading-tight text-slate-900 dark:text-white">
                            Forgot Password?
                        </h1>
                        <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">
                            No worries! Enter your email or username and we'll send you an OTP.
                        </p>
                    </div>

                    {/* Constrained form area */}
                    <div className="w-full max-w-sm mx-auto">
                        {serverError && (
                            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 !px-4 !py-3.5 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                                <ShieldCheck className="mt-px h-4 w-4 shrink-0" />
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                            {/* Email/Username field */}
                            <Field label="Email or Username" error={errors.userNameOrEmail?.message}>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        {...register("userNameOrEmail")}
                                        placeholder="Enter your email or username"
                                        className={`${inputCls(!!errors.userNameOrEmail)} !pl-11`}
                                    />
                                </div>
                            </Field>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex !h-[45px] w-full items-center justify-center gap-2.5 rounded-2xl bg-blue-600 text-[15px] font-bold text-white shadow-lg shadow-blue-200/60 transition-all duration-200 hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-blue-950/50 !mt-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                                        Sending OTP…
                                    </>
                                ) : (
                                    "Send OTP"
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="!mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ━━━ RIGHT — Brand Panel ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <section className="relative hidden lg:flex lg:w-[55%] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 !px-12 !py-14">

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
                        <KeyRound className="h-16 w-16 text-white relative z-10" />
                    </div>

                    {/* Heading */}
                    <div className="relative text-center mb-10">
                        <h2 className="text-[2.1rem] font-extrabold leading-tight text-white">
                            We've got you<br />
                            <span className="text-blue-200">covered.</span>
                        </h2>
                        <p className="mt-4 text-[15px] leading-relaxed text-blue-100/75 max-w-xs mx-auto">
                            We will help you securely verify your identity and get you back into your account.
                        </p>
                    </div>

                    {/* Stats row */}
                    <div className="relative grid grid-cols-3 gap-3 w-full max-w-sm">
                        <Stat icon={Users} value="24/7" label="Support" />
                        <Stat icon={Activity} value="99.9%" label="Reliability" />
                        <Stat icon={Star} value="100%" label="Secure reset" />
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
